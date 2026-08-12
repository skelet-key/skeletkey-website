/**
 * Puca CAN protocol — Votol EM150 (and EM-series CAN variants)
 *
 * Hardware path:
 *   Votol EM150 CAN-H / CAN-L @ 250 kbit/s
 *     → ESP32 (or other) CAN↔BLE/Wi‑Fi bridge
 *     → this app
 *
 * Live data (community-verified, Endless Sphere / votol-esp32-can-bus):
 *   Poll  ID 0x3FF — two 8-byte frames from display/bridge → controller
 *   Reply ID 0x3FE — three 8-byte frames → 24-byte payload B0..B23
 *
 *   B7–B8   pack voltage ×10 (u16 BE in stream as assembled; see parse)
 *   B9–B10  pack current ×10 (signed)
 *   B12–B15 fault bitmask (u32)
 *   B16–B17 motor RPM (u16)
 *   B18     controller temp °C = value - 50
 *   B19     motor / external temp °C = value - 50
 *   B22     gear / flags
 *   B23     controller state
 *
 * Note: EM150 does not publish SOC on this live frame. SOC/range come from
 * BMS (if bridge merges it) or are estimated from pack voltage.
 */
(function (global) {
  var POLL_ID = 0x3ff;
  var DATA_ID = 0x3fe;

  var POLL_FRAMES = [
    [0x09, 0x55, 0xaa, 0xaa, 0x00, 0xaa, 0x00, 0x00],
    [0x00, 0x18, 0xaa, 0x05, 0xd2, 0x00, 0x20, 0x33]
  ];

  var STATE_NAMES = {
    0: "IDLE", 1: "INIT", 2: "START", 3: "RUN",
    4: "STOP", 5: "BRAKE", 6: "WAIT", 7: "FAULT"
  };

  var GEAR_NAMES = { 0: "L", 1: "M", 2: "H", 3: "S" };

  function u16be(b, i) {
    return ((b[i] & 0xff) << 8) | (b[i + 1] & 0xff);
  }
  function u16le(b, i) {
    return (b[i] & 0xff) | ((b[i + 1] & 0xff) << 8);
  }
  function i16be(b, i) {
    var v = u16be(b, i);
    return v > 0x7fff ? v - 0x10000 : v;
  }

  /**
   * Assemble 3× 0x3FE frames into 24 bytes and decode telemetry.
   * Accepts either a full 24-byte buffer or sequential frame pushes via VotolAssembler.
   */
  function parseVotolLive24(bytes) {
    var out = {};
    if (!bytes || bytes.length < 24) return out;

    // Voltage / current: community docs use fixed-point /10
    // Try big-endian first (common in Votol dumps: 02 14 → 53.2V)
    var vBe = u16be(bytes, 7) / 10;
    var vLe = u16le(bytes, 7) / 10;
    out.voltage = vBe > 20 && vBe < 120 ? vBe : vLe;

    var cBe = i16be(bytes, 9) / 10;
    var cLe = (function () {
      var v = u16le(bytes, 9);
      return (v > 0x7fff ? v - 0x10000 : v) / 10;
    })();
    // Prefer magnitude that looks like real bus current
    out.current = Math.abs(cBe) < 500 ? cBe : cLe;

    out.fault = ((bytes[12] & 0xff) << 24) | ((bytes[13] & 0xff) << 16) |
                ((bytes[14] & 0xff) << 8) | (bytes[15] & 0xff);

    var rpmBe = u16be(bytes, 16);
    var rpmLe = u16le(bytes, 16);
    out.rpm = rpmBe < 15000 ? rpmBe : rpmLe;

    out.ctrlTemp = (bytes[18] & 0xff) - 50;
    out.motorTemp = (bytes[19] & 0xff) - 50;

    var flags = bytes[22] & 0xff;
    out.gear = GEAR_NAMES[flags & 0x03] || "?";
    out.reverse = !!(flags & 0x04);
    out.park = !!(flags & 0x08);
    out.brake = !!(flags & 0x10);
    out.regen = !!(flags & 0x80);

    var st = bytes[23] & 0xff;
    out.state = STATE_NAMES[st] || String(st);
    out.stateCode = st;

    return out;
  }

  /** Convert motor RPM → road speed mph using tire circumference (mm). */
  function rpmToMph(rpm, circumferenceMm) {
    if (!rpm || !circumferenceMm) return 0;
    // miles per minute = (rpm * circ_mm) / (1e6 * 1609.344) wait:
    // distance per rev (miles) = circ_mm / 1_609_344
    // mph = rpm * 60 * circ_mm / 1_609_344
    return (rpm * 60 * circumferenceMm) / 1609344;
  }

  /**
   * Rough SOC estimate for 16S NMC from pack voltage (no BMS).
   * 67.2V = 100%, 48V ≈ 0% (empty under load — conservative).
   */
  function socFromVoltage16s(v) {
    if (v == null || !isFinite(v)) return null;
    var full = 67.2;
    var empty = 48.0;
    var pct = ((v - empty) / (full - empty)) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  function estimateRangeMiles(socPercent, packKwh, whPerMile) {
    if (socPercent == null || !packKwh || !whPerMile) return null;
    var kwhLeft = packKwh * (Math.max(0, Math.min(100, socPercent)) / 100);
    return (kwhLeft * 1000) / whPerMile;
  }

  /** Stateful assembler for 0x3FE triple-frame responses */
  function VotolAssembler() {
    this.parts = [];
    this.lastAt = 0;
  }
  VotolAssembler.prototype.push = function (id, data8) {
    var now = Date.now();
    if (now - this.lastAt > 200) this.parts = [];
    this.lastAt = now;
    if ((id & 0x7ff) !== DATA_ID) return null;
    var d = data8 instanceof Uint8Array ? Array.prototype.slice.call(data8, 0, 8) : data8.slice(0, 8);
    while (d.length < 8) d.push(0);
    this.parts.push(d);
    if (this.parts.length < 3) return null;
    var buf = [].concat(this.parts[0], this.parts[1], this.parts[2]);
    this.parts = [];
    return parseVotolLive24(buf);
  };

  function parseCanFrame(id, data) {
    id = id & 0x7ff;
    if (id === DATA_ID) {
      // single frame alone is incomplete; return empty (use assembler)
      return {};
    }
    return {};
  }

  /**
   * Parse bridge payload:
   *  - JSON: {"rpm":1200,"voltage":60.8,"current":15,"soc":80,...}
   *  - JSON Votol stream: {"id":0x3FE,"data":[...8 bytes...]} repeated
   *  - Binary: [id_lo, id_hi, d0..d7]
   *  - 24-byte raw live buffer
   *  - hex line
   */
  function parsePayload(raw, assembler) {
    if (raw == null) return {};
    if (typeof raw === "string") {
      var t = raw.trim();
      if (!t) return {};
      if (t[0] === "{") {
        try {
          var j = JSON.parse(t);
          if (j.id != null && j.data) {
            var asm = assembler || parsePayload._asm || (parsePayload._asm = new VotolAssembler());
            var live = asm.push(Number(j.id), j.data);
            return live || {};
          }
          return j;
        } catch (e) { return {}; }
      }
      var m = t.match(/^(?:0x)?([0-9A-Fa-f]+)\s*[ :,]\s*([0-9A-Fa-f\s]+)$/);
      if (m) {
        var id = parseInt(m[1], 16);
        var bytes = (m[2].replace(/\s+/g, "").match(/.{1,2}/g) || []).map(function (x) {
          return parseInt(x, 16);
        });
        var asm2 = assembler || parsePayload._asm || (parsePayload._asm = new VotolAssembler());
        return asm2.push(id, bytes) || {};
      }
      return {};
    }
    if (raw instanceof ArrayBuffer) raw = new Uint8Array(raw);
    if (raw.length === 24) return parseVotolLive24(Array.prototype.slice.call(raw));
    if (raw.length >= 10) {
      var id2 = raw[0] | (raw[1] << 8);
      var data = Array.prototype.slice.call(raw, 2, 10);
      var asm3 = assembler || parsePayload._asm || (parsePayload._asm = new VotolAssembler());
      return asm3.push(id2, data) || {};
    }
    if (raw.length >= 3) {
      var id3 = raw[0] | (raw[1] << 8);
      return parseCanFrame(id3, Array.prototype.slice.call(raw, 2));
    }
    return {};
  }

  global.PucaCan = {
    POLL_ID: POLL_ID,
    DATA_ID: DATA_ID,
    POLL_FRAMES: POLL_FRAMES,
    parseVotolLive24: parseVotolLive24,
    parseCanFrame: parseCanFrame,
    parsePayload: parsePayload,
    rpmToMph: rpmToMph,
    socFromVoltage16s: socFromVoltage16s,
    estimateRangeMiles: estimateRangeMiles,
    VotolAssembler: VotolAssembler,
    STATE_NAMES: STATE_NAMES,
    GEAR_NAMES: GEAR_NAMES
  };
})(window);
