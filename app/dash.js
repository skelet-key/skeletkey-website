(function () {
  var cfg = window.PUCA_CONFIG || {};
  var state = {
    speed: 0,
    soc: 84,
    voltage: 60.8,
    current: 0,
    motorTemp: null,
    ctrlTemp: null,
    range: 105,
    odo: 0,
    mode: "demo", // demo | ble | ws
    demo: true
  };

  var els = {};
  function $(id) { return document.getElementById(id); }

  function cacheEls() {
    els.speed = $("speedValue");
    els.ring = $("speedRing");
    els.range = $("rangeValue");
    els.rangeBar = $("rangeBar");
    els.soc = $("socValue");
    els.socBar = $("socBar");
    els.volt = $("voltValue");
    els.power = $("powerValue");
    els.motorTemp = $("motorTemp");
    els.ctrlTemp = $("ctrlTemp");
    els.odo = $("odoValue");
    els.connDot = $("connDot");
    els.connLabel = $("connLabel");
  }

  function setConn(mode, ok) {
    state.mode = mode;
    els.connDot.className = "dot " + (ok ? "ok" : mode === "demo" ? "" : "err");
    var labels = {
      demo: "Demo mode",
      ble: ok ? "CAN · BLE connected" : "BLE disconnected",
      ws: ok ? "CAN · WebSocket" : "WebSocket offline"
    };
    els.connLabel.textContent = labels[mode] || mode;
  }

  function applyTelemetry(partial) {
    if (!partial) return;
    Object.keys(partial).forEach(function (k) {
      if (partial[k] != null && partial[k] !== "") state[k] = partial[k];
    });
    if (partial.soc != null && partial.range == null) {
      var est = window.PucaCan.estimateRangeMiles(
        state.soc,
        cfg.packKwh || 8.5,
        cfg.whPerMile || 80
      );
      if (est != null) state.range = est;
    }
    render();
  }

  function render() {
    var maxS = cfg.maxSpeedMph || 80;
    var speed = Math.max(0, Number(state.speed) || 0);
    els.speed.textContent = String(Math.round(speed));
    // circumference ~ 2*pi*52 ≈ 326.73
    var c = 326.73;
    var pct = Math.min(1, speed / maxS);
    els.ring.style.strokeDashoffset = String(c * (1 - pct));

    var range = Math.max(0, Number(state.range) || 0);
    els.range.textContent = range >= 100 ? String(Math.round(range)) : range.toFixed(1);
    var rangePct = Math.min(100, (range / 120) * 100);
    els.rangeBar.style.width = rangePct + "%";

    var soc = Math.max(0, Math.min(100, Number(state.soc) || 0));
    els.soc.textContent = String(Math.round(soc));
    els.socBar.style.width = soc + "%";
    els.socBar.style.background = soc < 20 ? "var(--red)" : soc < 40 ? "#f5a524" : "var(--green)";

    els.volt.textContent = (Number(state.voltage) || 0).toFixed(1);
    var powerKw = ((Number(state.voltage) || 0) * (Number(state.current) || 0)) / 1000;
    els.power.textContent = powerKw.toFixed(1);

    els.motorTemp.textContent = state.motorTemp == null ? "—" : String(Math.round(state.motorTemp));
    els.ctrlTemp.textContent = state.ctrlTemp == null ? "—" : String(Math.round(state.ctrlTemp));
    els.odo.textContent = (Number(state.odo) || 0).toFixed(1);
  }

  // ---- Demo telemetry ----
  var demoTimer = null;
  function startDemo() {
    stopDemo();
    state.demo = true;
    setConn("demo", true);
    var t0 = performance.now();
    demoTimer = setInterval(function () {
      var t = (performance.now() - t0) / 1000;
      var speed = 35 + Math.sin(t * 0.35) * 28 + Math.sin(t * 1.1) * 4;
      speed = Math.max(0, Math.min(72, speed));
      var soc = 84 - (t * 0.01);
      if (soc < 12) soc = 84;
      var voltage = 58 + (soc / 100) * 8.5 - speed * 0.01;
      var current = speed * 0.55 + Math.sin(t) * 8;
      applyTelemetry({
        speed: speed,
        soc: soc,
        voltage: voltage,
        current: Math.max(0, current),
        motorTemp: 38 + speed * 0.25,
        ctrlTemp: 34 + speed * 0.12,
        odo: (Number(state.odo) || 0) + speed / 3600 * 0.25
      });
    }, 250);
  }
  function stopDemo() {
    state.demo = false;
    if (demoTimer) clearInterval(demoTimer);
    demoTimer = null;
  }

  // ---- WebSocket CAN bridge ----
  function connectWs() {
    if (!cfg.wsUrl) return;
    stopDemo();
    try {
      var ws = new WebSocket(cfg.wsUrl);
      ws.binaryType = "arraybuffer";
      setConn("ws", false);
      ws.onopen = function () { setConn("ws", true); };
      ws.onclose = function () { setConn("ws", false); };
      ws.onerror = function () { setConn("ws", false); };
      ws.onmessage = function (ev) {
        applyTelemetry(window.PucaCan.parsePayload(ev.data));
      };
      window._pucaWs = ws;
    } catch (e) {
      console.warn(e);
      setConn("ws", false);
    }
  }

  // ---- Web Bluetooth CAN bridge ----
  var bleChar = null;
  function connectBle() {
    if (!navigator.bluetooth) {
      alert("Web Bluetooth is not available in this browser. Use Chrome on Android, or a WebSocket bridge.");
      return;
    }
    stopDemo();
    setConn("ble", false);
    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: (cfg.ble && cfg.ble.optionalServices) || []
    }).then(function (device) {
      return device.gatt.connect();
    }).then(function (server) {
      return server.getPrimaryServices();
    }).then(function (services) {
      // Prefer Nordic UART RX characteristic
      var prefer = services.slice().sort(function (a, b) {
        var as = a.uuid.indexOf("6e400001") >= 0 ? 0 : 1;
        var bs = b.uuid.indexOf("6e400001") >= 0 ? 0 : 1;
        return as - bs;
      });
      return prefer[0].getCharacteristics().then(function (chars) {
        var notify = chars.filter(function (c) {
          return c.properties.notify || c.properties.indicate;
        })[0];
        if (!notify) throw new Error("No notify characteristic on bridge");
        bleChar = notify;
        return notify.startNotifications();
      });
    }).then(function () {
      setConn("ble", true);
      bleChar.addEventListener("characteristicvaluechanged", function (ev) {
        var value = ev.target.value;
        var bytes = new Uint8Array(value.buffer);
        // try text decode first
        var text = "";
        try { text = new TextDecoder().decode(bytes); } catch (e) {}
        if (text && (text[0] === "{" || /[0-9A-Fa-f]{2}/.test(text))) {
          applyTelemetry(window.PucaCan.parsePayload(text));
        } else {
          applyTelemetry(window.PucaCan.parsePayload(bytes.buffer));
        }
      });
    }).catch(function (err) {
      console.warn(err);
      setConn("ble", false);
      if (String(err).indexOf("User cancelled") < 0 && String(err).indexOf("cancel") < 0) {
        alert("BLE connect failed: " + err.message);
      }
    });
  }

  // ---- Google Maps ----
  var map, marker;
  window.initPucaMap = function () {
    var el = $("map");
    if (!el || !window.google) return;
    map = new google.maps.Map(el, {
      center: { lat: 40.7128, lng: -74.006 },
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1f2b" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0b0f19" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#a8b4c4" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a3142" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1628" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] }
      ]
    });
    marker = new google.maps.Marker({ map: map, title: "Puca" });
    locate();
  };

  function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var ll = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (map) {
        map.setCenter(ll);
        map.setZoom(15);
        if (marker) marker.setPosition(ll);
      }
    }, function () {}, { enableHighAccuracy: true, timeout: 8000 });
  }

  function boot() {
    cacheEls();
    $("btnBle").addEventListener("click", connectBle);
    $("btnDemo").addEventListener("click", function () {
      if (state.demo) {
        stopDemo();
        setConn("demo", false);
        els.connLabel.textContent = "Paused";
      } else startDemo();
    });
    $("btnLocate").addEventListener("click", locate);
    if (cfg.wsUrl) connectWs();
    else startDemo();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
