/**
 * Puca CAN / telemetry protocol helpers
 *
 * Real hardware path:
 *   Motor controller + BMS on CAN → BLE or Wi‑Fi CAN bridge → this app
 *
 * Default frame map (adjust to your controller/BMS DBC):
 *   0x100  speed_mph_x10   uint16 LE
 *   0x101  pack_voltage_x10, soc_percent
 *   0x102  battery_current_x10 (signed), motor_temp_c
 *   0x103  controller_temp_c, range_flags
 *
 * Bridges may also send JSON lines:
 *   {"speed":42.5,"soc":84,"voltage":60.8,"current":12.3,"motorTemp":48,"ctrlTemp":39}
 */
(function (global) {
  function u16le(b, i) { return b[i] | (b[i + 1] << 8); }
  function i16le(b, i) {
    var v = u16le(b, i);
    return v > 0x7fff ? v - 0x10000 : v;
  }

  function parseCanFrame(id, data) {
    var out = {};
    if (!data || data.length < 2) return out;
    switch (id & 0x7ff) {
      case 0x100:
        out.speed = u16le(data, 0) / 10;
        break;
      case 0x101:
        out.voltage = u16le(data, 0) / 10;
        if (data.length > 2) out.soc = data[2];
        break;
      case 0x102:
        out.current = i16le(data, 0) / 10;
        if (data.length > 2) out.motorTemp = data[2];
        break;
      case 0x103:
        out.ctrlTemp = data[0];
        break;
      default:
        break;
    }
    return out;
  }

  /** Parse a BLE/WS payload: JSON text, or binary [id_lo,id_hi,d0..] */
  function parsePayload(raw) {
    if (raw == null) return {};
    if (typeof raw === "string") {
      var t = raw.trim();
      if (!t) return {};
      if (t[0] === "{") {
        try { return JSON.parse(t); } catch (e) { return {}; }
      }
      // hex line: "100:1A2B" or "0x100 1A 2B"
      var m = t.match(/^(?:0x)?([0-9A-Fa-f]+)\s*[ :,]\s*([0-9A-Fa-f\s]+)$/);
      if (m) {
        var id = parseInt(m[1], 16);
        var bytes = m[2].replace(/\s+/g, "").match(/.{1,2}/g) || [];
        return parseCanFrame(id, bytes.map(function (x) { return parseInt(x, 16); }));
      }
      return {};
    }
    if (raw instanceof ArrayBuffer) raw = new Uint8Array(raw);
    if (raw.length >= 3) {
      var id2 = raw[0] | (raw[1] << 8);
      return parseCanFrame(id2, Array.prototype.slice.call(raw, 2));
    }
    return {};
  }

  function estimateRangeMiles(socPercent, packKwh, whPerMile) {
    if (socPercent == null || !packKwh || !whPerMile) return null;
    var kwhLeft = packKwh * (Math.max(0, Math.min(100, socPercent)) / 100);
    return (kwhLeft * 1000) / whPerMile;
  }

  global.PucaCan = {
    parseCanFrame: parseCanFrame,
    parsePayload: parsePayload,
    estimateRangeMiles: estimateRangeMiles
  };
})(window);
