(function () {
  var cfg = window.PUCA_CONFIG || {};
  var bleCfg = cfg.ble || {};
  var STORAGE = {
    odo: "sk_puca_odo_mi",
    trip: "sk_puca_trip_mi",
    ign: "sk_puca_ignition",
    lastLat: "sk_puca_last_lat",
    lastLng: "sk_puca_last_lng",
    lastLocTs: "sk_puca_last_loc_ts"
  };

  var state = {
    ignition: false,
    speedMph: 0,
    maxMph: 0,
    tripMi: 0,
    odoMi: 0,
    tripMs: 0,
    movingMs: 0,
    heading: null,
    altitudeFt: null,
    gpsOk: false,
    accuracyM: null,
    soc: 84,
    range: 105,
    units: cfg.units || "mph",
    lastFixTs: 0,
    lastLat: null,
    lastLng: null,
    bleConnected: false,
    bleName: null,
    locationSource: null, // gps | network | cache | ip | map
    geoWatchId: null
  };

  // BLE Nordic UART handles
  var ble = {
    device: null,
    server: null,
    rxChar: null, // write commands
    txChar: null  // notifications
  };

  var els = {};
  function $(id) { return document.getElementById(id); }

  function cacheEls() {
    [
      "speedValue", "speedUnit", "speedRing", "tripValue", "tripUnit",
      "maxValue", "maxUnit", "avgValue", "avgUnit", "timeValue",
      "headingValue", "altValue", "rangeValue", "rangeBar", "socValue",
      "socBar", "odoValue", "odoUnit", "connDot", "connLabel", "ignLabel",
      "ignHint", "gpsAcc", "btnIgnition", "btnUnits", "sourceValue",
      "btnBle", "bleLabel"
    ].forEach(function (id) {
      els[id] = $(id);
    });
  }

  function loadPersisted() {
    try {
      var o = parseFloat(localStorage.getItem(STORAGE.odo));
      if (!isNaN(o) && o >= 0) state.odoMi = o;
      var t = parseFloat(localStorage.getItem(STORAGE.trip));
      if (!isNaN(t) && t >= 0) state.tripMi = t;
      // Do not auto-restore ignition ON — always start OFF for safety
      state.ignition = false;
    } catch (e) {}
  }

  function saveOdo() {
    try {
      localStorage.setItem(STORAGE.odo, String(state.odoMi));
      localStorage.setItem(STORAGE.trip, String(state.tripMi));
    } catch (e) {}
  }

  function updateBleUi() {
    if (els.btnBle) {
      els.btnBle.textContent = state.bleConnected ? "Disconnect relay" : "Connect relay";
    }
    if (els.bleLabel) {
      els.bleLabel.textContent = state.bleConnected
        ? ("Relay · " + (state.bleName || "PucaIgn"))
        : "Relay · offline";
    }
    if (els.ignHint) {
      if (!state.bleConnected) {
        els.ignHint.textContent = state.ignition
          ? "IGN ON (UI only · connect relay for hardware)"
          : "Connect relay, then turn ignition on";
      } else {
        els.ignHint.textContent = state.ignition
          ? "Ignition on · relay closed · GPS active"
          : "Ignition off · relay open";
      }
    }
  }

  function setIgnition(on, opts) {
    opts = opts || {};
    state.ignition = !!on;
    var app = $("app");
    var btn = els.btnIgnition;
    if (app) {
      app.classList.toggle("ignition-off", !state.ignition);
      app.classList.toggle("ignition-on", state.ignition);
    }
    if (btn) {
      btn.classList.toggle("on", state.ignition);
      btn.setAttribute("aria-pressed", state.ignition ? "true" : "false");
    }
    if (els.ignLabel) els.ignLabel.textContent = state.ignition ? "IGN ON" : "IGN OFF";
    updateBleUi();

    // Send to hardware unless this update came FROM the hardware
    if (!opts.fromBle) {
      bleSendIgnition(state.ignition);
    }
  }

  function toggleIgnition() {
    setIgnition(!state.ignition);
  }

  // ---- BLE ignition relay ----
  function bleSupported() {
    return !!(navigator.bluetooth && navigator.bluetooth.requestDevice);
  }

  function bleSend(text) {
    if (!ble.rxChar || !state.bleConnected) return Promise.resolve(false);
    var payload = text.endsWith("\n") ? text : text + "\n";
    var encoder = new TextEncoder();
    return ble.rxChar.writeValue(encoder.encode(payload))
      .then(function () { return true; })
      .catch(function (err) {
        console.warn("BLE write failed", err);
        return false;
      });
  }

  function bleSendIgnition(on) {
    return bleSend(on ? "IGN:1" : "IGN:0");
  }

  function onBleNotify(ev) {
    try {
      var raw = new TextDecoder().decode(ev.target.value);
      var lines = raw.split(/\r?\n/);
      lines.forEach(function (line) {
        line = line.trim();
        if (!line) return;
        if (line === "IGN:1") setIgnition(true, { fromBle: true });
        else if (line === "IGN:0") setIgnition(false, { fromBle: true });
        // PONG / ERR ignored for now
      });
    } catch (e) {
      console.warn(e);
    }
  }

  function onBleDisconnected() {
    state.bleConnected = false;
    state.bleName = null;
    ble.rxChar = null;
    ble.txChar = null;
    ble.server = null;
    ble.device = null;
    if (bleCfg.failSafeOffOnDisconnect !== false) {
      setIgnition(false, { fromBle: true });
    }
    updateBleUi();
  }

  function connectBle() {
    if (state.bleConnected) {
      disconnectBle();
      return;
    }
    if (!bleSupported()) {
      alert("Web Bluetooth needs Chrome on Android (or Edge). iOS Safari does not support it.");
      return;
    }

    var hints = bleCfg.deviceNameHints || ["PucaIgn", "SkeletKey"];
    var filters = hints.map(function (n) { return { namePrefix: n }; });

    navigator.bluetooth.requestDevice({
      filters: filters,
      optionalServices: bleCfg.optionalServices || [bleCfg.serviceUuid]
    }).catch(function () {
      // Fallback: accept all devices if name filter fails
      return navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: bleCfg.optionalServices || [bleCfg.serviceUuid]
      });
    }).then(function (device) {
      ble.device = device;
      state.bleName = device.name || "PucaIgn";
      device.addEventListener("gattserverdisconnected", onBleDisconnected);
      return device.gatt.connect();
    }).then(function (server) {
      ble.server = server;
      return server.getPrimaryService(bleCfg.serviceUuid || "6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    }).then(function (service) {
      return Promise.all([
        service.getCharacteristic(bleCfg.rxCharUuid || "6e400002-b5a3-f393-e0a9-e50e24dcca9e"),
        service.getCharacteristic(bleCfg.txCharUuid || "6e400003-b5a3-f393-e0a9-e50e24dcca9e")
      ]);
    }).then(function (chars) {
      ble.rxChar = chars[0];
      ble.txChar = chars[1];
      return ble.txChar.startNotifications();
    }).then(function () {
      ble.txChar.addEventListener("characteristicvaluechanged", onBleNotify);
      state.bleConnected = true;
      updateBleUi();
      // Sync hardware to current UI state (usually OFF after connect)
      return bleSendIgnition(state.ignition).then(function () {
        return bleSend("STATUS?");
      });
    }).catch(function (err) {
      console.warn(err);
      onBleDisconnected();
      var msg = (err && err.message) ? err.message : String(err);
      if (msg.indexOf("cancel") < 0 && msg.indexOf("User cancelled") < 0) {
        alert("Relay connect failed: " + msg);
      }
    });
  }

  function disconnectBle() {
    try {
      if (state.bleConnected) bleSend("IGN:0");
    } catch (e) {}
    try {
      if (ble.device && ble.device.gatt && ble.device.gatt.connected) {
        ble.device.gatt.disconnect();
      }
    } catch (e) {}
    onBleDisconnected();
  }

  function unitSpeed(mph) {
    return state.units === "kmh" ? mph * 1.60934 : mph;
  }
  function unitDist(mi) {
    return state.units === "kmh" ? mi * 1.60934 : mi;
  }
  function speedLabel() { return state.units === "kmh" ? "km/h" : "mph"; }
  function distLabel() { return state.units === "kmh" ? " km" : " mi"; }

  function formatTime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    s = s % 60;
    m = m % 60;
    if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    return m + ":" + String(s).padStart(2, "0");
  }

  function headingCardinal(deg) {
    if (deg == null || isNaN(deg)) return "—";
    var dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    var i = Math.round(deg / 45) % 8;
    return dirs[i] + " " + Math.round(deg) + "°";
  }

  function setGpsStatus(ok, accM, source) {
    state.gpsOk = ok;
    state.accuracyM = accM;
    if (source) state.locationSource = source;
    var src = state.locationSource || "gps";
    var label = {
      gps: "GPS",
      network: "Network",
      cache: "Cached",
      ip: "IP approx",
      map: "Map"
    }[src] || "GPS";

    if (els.connDot) {
      els.connDot.className = "dot " + (ok ? "ok" : "err");
    }
    if (els.connLabel) {
      if (ok) {
        els.connLabel.textContent = src === "gps" ? "GPS locked" : (label + " · fix");
      } else {
        els.connLabel.textContent = "GPS searching…";
      }
    }
    if (els.gpsAcc) {
      if (ok && accM != null) {
        els.gpsAcc.textContent = label + " · ±" + Math.round(accM) + " m";
      } else if (ok) {
        els.gpsAcc.textContent = label + " · ready";
      } else {
        els.gpsAcc.textContent = "Location · waiting…";
      }
    }
  }

  function persistLastLocation(lat, lng) {
    try {
      localStorage.setItem(STORAGE.lastLat, String(lat));
      localStorage.setItem(STORAGE.lastLng, String(lng));
      localStorage.setItem(STORAGE.lastLocTs, String(Date.now()));
    } catch (e) {}
  }

  function loadCachedLocation() {
    try {
      var lat = parseFloat(localStorage.getItem(STORAGE.lastLat));
      var lng = parseFloat(localStorage.getItem(STORAGE.lastLng));
      var ts = parseInt(localStorage.getItem(STORAGE.lastLocTs) || "0", 10);
      if (isNaN(lat) || isNaN(lng)) return null;
      // Cache valid for 24h
      if (Date.now() - ts > 24 * 60 * 60 * 1000) return null;
      return { lat: lat, lng: lng, ts: ts };
    } catch (e) {
      return null;
    }
  }

  function applyLocation(lat, lng, accM, source) {
    state.lastLat = lat;
    state.lastLng = lng;
    setGpsStatus(true, accM != null ? accM : (source === "ip" ? 5000 : 100), source);
    if (source === "gps" || source === "network") persistLastLocation(lat, lng);
    if (window._pucaMap && window._pucaMapMarker) {
      var ll = [lat, lng];
      window._pucaMapMarker.setLatLng(ll);
      if (window._pucaMapFollow) {
        window._pucaMap.setView(ll, Math.max(window._pucaMap.getZoom(), 14), { animate: true });
      }
    }
  }

  function ipGeolocate() {
    // Primary IP provider, then fallback provider — city-level (~1–50 km)
    function parseWhois(data) {
      if (!data || data.success === false || data.latitude == null) throw new Error("ipwho failed");
      return { lat: Number(data.latitude), lng: Number(data.longitude), accuracy: 8000 };
    }
    function parseIpapi(data) {
      if (!data || data.latitude == null || data.error) throw new Error("ipapi failed");
      return { lat: Number(data.latitude), lng: Number(data.longitude), accuracy: 10000 };
    }
    return fetch("https://ipwho.is/")
      .then(function (r) { return r.json(); })
      .then(parseWhois)
      .catch(function () {
        return fetch("https://ipapi.co/json/")
          .then(function (r) { return r.json(); })
          .then(parseIpapi);
      });
  }

  function render() {
    var maxScale = cfg.maxSpeedMph || 80;
    var displaySpeed = unitSpeed(state.speedMph);

    if (els.speedValue) els.speedValue.textContent = String(Math.round(displaySpeed));
    if (els.speedUnit) els.speedUnit.textContent = speedLabel();
    if (els.btnUnits) els.btnUnits.textContent = speedLabel();

    if (els.speedRing) {
      var c = 326.73;
      var pct = Math.min(1, state.speedMph / maxScale);
      if (!state.ignition) pct = 0;
      els.speedRing.style.strokeDashoffset = String(c * (1 - pct));
    }

    if (els.tripValue) els.tripValue.textContent = unitDist(state.tripMi).toFixed(1);
    if (els.tripUnit) els.tripUnit.textContent = distLabel();
    if (els.maxValue) els.maxValue.textContent = String(Math.round(unitSpeed(state.maxMph)));
    if (els.maxUnit) els.maxUnit.textContent = " " + speedLabel();
    var avg = state.movingMs > 0 ? state.tripMi / (state.movingMs / 3600000) : 0;
    if (els.avgValue) els.avgValue.textContent = String(Math.round(unitSpeed(avg)));
    if (els.avgUnit) els.avgUnit.textContent = " " + speedLabel();
    if (els.timeValue) els.timeValue.textContent = formatTime(state.tripMs);

    if (els.headingValue) els.headingValue.textContent = headingCardinal(state.heading);
    if (els.altValue) {
      els.altValue.textContent = state.altitudeFt == null ? "—" : String(Math.round(state.altitudeFt));
    }

    if (els.odoValue) els.odoValue.textContent = unitDist(state.odoMi).toFixed(1);
    if (els.odoUnit) els.odoUnit.textContent = distLabel();

    var soc = Math.max(0, Math.min(100, state.soc));
    if (els.socValue) els.socValue.textContent = String(Math.round(soc));
    if (els.socBar) {
      els.socBar.style.width = soc + "%";
      els.socBar.style.background = soc < 20 ? "var(--red)" : soc < 40 ? "#f5a524" : "var(--green)";
    }
    var range = Math.max(0, state.range);
    if (els.rangeValue) els.rangeValue.textContent = range >= 100 ? String(Math.round(range)) : range.toFixed(1);
    if (els.rangeBar) els.rangeBar.style.width = Math.min(100, (range / 120) * 100) + "%";

    if (els.sourceValue) {
      var src = [];
      if (state.gpsOk) src.push("GPS");
      if (state.bleConnected) src.push("BLE relay");
      els.sourceValue.textContent = src.length ? src.join(" + ") : "—";
    }
  }

  function onPosition(pos) {
    var c = pos.coords;
    var mph = (c.speed != null && !isNaN(c.speed)) ? c.speed * 2.236936 : 0;
    if (mph < 0) mph = 0;
    if (mph < 0.8) mph = 0;

    var now = Date.now();
    var dt = state.lastFixTs ? (now - state.lastFixTs) / 1000 : 0;
    state.lastFixTs = now;

    if (state.ignition && dt > 0 && dt < 5) {
      state.tripMs += dt * 1000;
      if (mph > 0.8) state.movingMs += dt * 1000;
    }

    if (state.ignition && mph > 0.8 && dt > 0 && dt < 5) {
      var dMi = mph * (dt / 3600);
      state.tripMi += dMi;
      state.odoMi += dMi;
      saveOdo();
    }

    state.speedMph = mph;
    if (state.ignition && mph > state.maxMph) state.maxMph = mph;

    if (c.heading != null && !isNaN(c.heading)) state.heading = c.heading;
    if (c.altitude != null && !isNaN(c.altitude)) state.altitudeFt = c.altitude * 3.28084;

    state.lastLat = c.latitude;
    state.lastLng = c.longitude;
    persistLastLocation(c.latitude, c.longitude);

    // accuracy < 100m → treat as GPS; coarser → network
    var src = (c.accuracy != null && c.accuracy <= 100) ? "gps" : "network";
    setGpsStatus(true, c.accuracy, src);
    render();

    if (window._pucaMap && c.latitude != null) {
      var ll = [c.latitude, c.longitude];
      if (window._pucaMapMarker) window._pucaMapMarker.setLatLng(ll);
      if (window._pucaMapFollow) window._pucaMap.setView(ll, window._pucaMap.getZoom(), { animate: false });
    }
  }

  function onPositionError(err) {
    state.speedMph = 0;
    var code = err && err.code;
    // 1 PERMISSION_DENIED  2 POSITION_UNAVAILABLE  3 TIMEOUT
    if (code === 1) {
      setGpsStatus(false, null);
      if (els.connLabel) els.connLabel.textContent = "Location denied";
      if (els.gpsAcc) els.gpsAcc.textContent = "Allow location or use IP/map";
      // Fall back to cache → IP
      fallbackLocationChain();
    } else if (code === 3) {
      // Timeout — try low-accuracy single shot, then IP
      if (els.gpsAcc) els.gpsAcc.textContent = "GPS timeout · trying network…";
      tryLowAccuracyFix().then(function (ok) {
        if (!ok) fallbackLocationChain();
      });
    } else {
      setGpsStatus(false, null);
      fallbackLocationChain();
    }
    render();
  }

  function tryLowAccuracyFix() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var c = pos.coords;
          applyLocation(c.latitude, c.longitude, c.accuracy, "network");
          render();
          resolve(true);
        },
        function () { resolve(false); },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
      );
    });
  }

  function fallbackLocationChain() {
    var cached = loadCachedLocation();
    if (cached) {
      applyLocation(cached.lat, cached.lng, 200, "cache");
      render();
    }
    ipGeolocate()
      .then(function (pos) {
        // Don't overwrite a fresh GPS fix
        if (state.locationSource === "gps") return;
        applyLocation(pos.lat, pos.lng, pos.accuracy, "ip");
        render();
      })
      .catch(function () {
        if (!state.lastLat && els.gpsAcc) {
          els.gpsAcc.textContent = "Tap My location or pan map";
        }
      });
  }

  function startGps() {
    // Primary: IP geolocation (no browser permission prompt)
    if (els.connLabel) els.connLabel.textContent = "IP locating…";
    if (els.gpsAcc) els.gpsAcc.textContent = "IP geolocation…";

    var cached = loadCachedLocation();
    if (cached) {
      applyLocation(cached.lat, cached.lng, 150, "cache");
      render();
    }

    ipGeolocate()
      .then(function (pos) {
        applyLocation(pos.lat, pos.lng, pos.accuracy, "ip");
        persistLastLocation(pos.lat, pos.lng);
        render();
        if (els.connLabel) els.connLabel.textContent = "IP · approx";
        if (els.gpsAcc) els.gpsAcc.textContent = "IP · ±" + Math.round(pos.accuracy / 1000) + " km";
      })
      .catch(function (err) {
        console.warn("IP geo", err);
        if (!state.lastLat) {
          setGpsStatus(false, null);
          if (els.connLabel) els.connLabel.textContent = "IP failed";
          if (els.gpsAcc) els.gpsAcc.textContent = "Pan map or try My location";
        }
      });

    // Optional: browser GPS only upgrades accuracy if user already granted
    // Does not prompt aggressively — used for speed when available
    if (navigator.geolocation && navigator.permissions) {
      try {
        navigator.permissions.query({ name: "geolocation" }).then(function (res) {
          if (res.state === "granted") {
            state.geoWatchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
              enableHighAccuracy: true,
              maximumAge: 1000,
              timeout: 20000
            });
          }
        }).catch(function () {});
      } catch (e) {}
    }
  }

  function resetTrip() {
    state.tripMi = 0;
    state.tripMs = 0;
    state.movingMs = 0;
    state.maxMph = 0;
    saveOdo();
    render();
  }

  function toggleUnits() {
    state.units = state.units === "mph" ? "kmh" : "mph";
    render();
  }

  window.initPucaMap = function () {
    try {
      var el = $("map");
      if (!el || typeof L === "undefined") {
        if (els.navHint || $("navHint")) {
          var nh = $("navHint");
          if (nh) nh.textContent = "Leaflet failed to load";
        }
        return;
      }
      if (window._pucaMap) return; // already init

      window._pucaMap = L.map(el, {
        zoomControl: false,
        attributionControl: true
      }).setView([40.7128, -74.006], 15);

      L.control.zoom({ position: "topright" }).addTo(window._pucaMap);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
      }).addTo(window._pucaMap);

      window._pucaMapMarker = L.circleMarker([40.7128, -74.006], {
        radius: 8,
        color: "#3dd68c",
        fillColor: "#3dd68c",
        fillOpacity: 0.9,
        weight: 2
      }).addTo(window._pucaMap).bindPopup("Puca");

      window._pucaMapFollow = true;
      var nh = $("navHint");
      if (nh) nh.textContent = "OpenStreetMap · live GPS";
      locate();
    } catch (err) {
      console.warn("initPucaMap", err);
      var nh2 = $("navHint");
      if (nh2) nh2.textContent = "Map error · GPS still works";
    }
  };

  function locate() {
    window._pucaMapFollow = true;
    if (els.gpsAcc) els.gpsAcc.textContent = "IP geolocation…";
    if (els.connLabel) els.connLabel.textContent = "IP locating…";

    ipGeolocate()
      .then(function (pos) {
        applyLocation(pos.lat, pos.lng, pos.accuracy, "ip");
        persistLastLocation(pos.lat, pos.lng);
        if (window._pucaMap) window._pucaMap.setView([pos.lat, pos.lng], 12);
        render();
        if (els.connLabel) els.connLabel.textContent = "IP · approx";
        if (els.gpsAcc) els.gpsAcc.textContent = "IP · ±" + Math.round(pos.accuracy / 1000) + " km";
      })
      .catch(function (err) {
        console.warn("locate IP", err);
        var c = loadCachedLocation();
        if (c) {
          applyLocation(c.lat, c.lng, 200, "cache");
          if (window._pucaMap) window._pucaMap.setView([c.lat, c.lng], 12);
          render();
        } else if (els.gpsAcc) {
          els.gpsAcc.textContent = "IP failed — pan map to set origin";
        }
      });
  }

  var routeLayer = null;
  var destMarker = null;
  var destLatLng = null;

  function clearRoute() {
    try {
      if (routeLayer && window._pucaMap) window._pucaMap.removeLayer(routeLayer);
      if (destMarker && window._pucaMap) window._pucaMap.removeLayer(destMarker);
    } catch (e) {}
    routeLayer = null;
    destMarker = null;
    destLatLng = null;
    var nh = $("navHint");
    if (nh) nh.textContent = "OpenStreetMap · live GPS";
    var bc = $("btnClearRoute");
    if (bc) bc.style.display = "none";
  }

  function formatKm(m) {
    if (m >= 1000) return (m / 1609.344).toFixed(1) + " mi";
    return Math.round(m * 3.28084) + " ft";
  }

  function formatEta(sec) {
    var m = Math.round(sec / 60);
    if (m < 60) return m + " min";
    return Math.floor(m / 60) + "h " + (m % 60) + "m";
  }

  function drawRouteTo(destLat, destLng) {
    var lat = state.lastLat;
    var lng = state.lastLng;
    if (lat == null || lng == null) {
      var o = getNavOrigin();
      if (o) {
        lat = o.lat;
        lng = o.lng;
        state.lastLat = lat;
        state.lastLng = lng;
      } else {
        if (nh) nh.textContent = "Pan map / allow location, then Navigate";
        return;
      }
    }
    destLatLng = [destLat, destLng];
    var nh = $("navHint");
    if (nh) nh.textContent = "Routing…";

    var url = "https://router.project-osrm.org/route/v1/driving/" +
      lng + "," + lat + ";" + destLng + "," + destLat +
      "?overview=full&geometries=geojson&steps=true";

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("OSRM " + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data.routes || !data.routes.length) throw new Error("No route");
        var route = data.routes[0];
        var coords = route.geometry.coordinates.map(function (c) {
          return [c[1], c[0]];
        });

        if (routeLayer && window._pucaMap) window._pucaMap.removeLayer(routeLayer);
        if (destMarker && window._pucaMap) window._pucaMap.removeLayer(destMarker);

        routeLayer = L.polyline(coords, {
          color: "#3dd68c",
          weight: 5,
          opacity: 0.9
        }).addTo(window._pucaMap);

        destMarker = L.circleMarker(destLatLng, {
          radius: 9,
          color: "#ff6b7a",
          fillColor: "#ff6b7a",
          fillOpacity: 0.95,
          weight: 2
        }).addTo(window._pucaMap).bindPopup("Destination");

        window._pucaMap.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });
        window._pucaMapFollow = false;

        if (nh) {
          nh.textContent = formatKm(route.distance) + " · " + formatEta(route.duration) + " · tap map to change dest";
        }
        var bc = $("btnClearRoute");
        if (bc) bc.style.display = "";
      })
      .catch(function (err) {
        console.warn(err);
        if (nh) nh.textContent = "Routing failed · tap map to retry";
        alert("Could not get a route. Check connection and try again.");
      });
  }

  function getNavOrigin() {
    if (state.lastLat != null && state.lastLng != null) {
      return { lat: state.lastLat, lng: state.lastLng, source: "gps" };
    }
    try {
      if (window._pucaMapMarker) {
        var ll = window._pucaMapMarker.getLatLng();
        if (ll) return { lat: ll.lat, lng: ll.lng, source: "marker" };
      }
    } catch (e) {}
    try {
      if (window._pucaMap) {
        var c = window._pucaMap.getCenter();
        if (c) return { lat: c.lat, lng: c.lng, source: "map" };
      }
    } catch (e2) {}
    return null;
  }

  function openNavigator() {
    var nh = $("navHint");
    if (!window._pucaMap) {
      alert("Map not ready");
      return;
    }
    // Try to improve GPS in background; don't block navigation
    if (state.lastLat == null) locate();

    window._pucaMapFollow = false;
    if (nh) nh.textContent = "Tap the map to set destination";

    window._pucaMap.once("click", function (e) {
      var origin = getNavOrigin();
      if (!origin) {
        // Last resort: use click point as origin too (user can pan first)
        origin = { lat: e.latlng.lat, lng: e.latlng.lng, source: "tap" };
      }
      // Stash origin into state so drawRouteTo can use it
      if (state.lastLat == null) {
        state.lastLat = origin.lat;
        state.lastLng = origin.lng;
      }
      drawRouteTo(e.latlng.lat, e.latlng.lng);
    });
  }

  function boot() {
    window.state = state;
    cacheEls();
    loadPersisted();
    setIgnition(false);
    updateBleUi();
    render();
    startGps();

    if (els.btnIgnition) els.btnIgnition.addEventListener("click", toggleIgnition);
    if ($("btnResetTrip")) $("btnResetTrip").addEventListener("click", resetTrip);
    if (els.btnUnits) els.btnUnits.addEventListener("click", toggleUnits);
    if ($("btnLocate")) $("btnLocate").addEventListener("click", locate);
    // Navigate bound by index.html inline override (prevents stale /*disabled*/void)
    // if ($("btnNavigate")) $("btnNavigate").addEventListener("click", openNavigator);
    if ($("btnClearRoute")) $("btnClearRoute").addEventListener("click", clearRoute);
    if (els.btnBle) els.btnBle.addEventListener("click", connectBle);

    setInterval(function () {
      if (state.ignition && state.gpsOk) render();
    }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
