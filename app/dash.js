(function () {
  var cfg = window.PUCA_CONFIG || {};
  var STORAGE = {
    odo: "sk_puca_odo_mi",
    trip: "sk_puca_trip_mi",
    ign: "sk_puca_ignition"
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
    lastLng: null
  };

  var els = {};
  function $(id) { return document.getElementById(id); }

  function cacheEls() {
    [
      "speedValue", "speedUnit", "speedRing", "tripValue", "tripUnit",
      "maxValue", "maxUnit", "avgValue", "avgUnit", "timeValue",
      "headingValue", "altValue", "rangeValue", "rangeBar", "socValue",
      "socBar", "odoValue", "odoUnit", "connDot", "connLabel", "ignLabel",
      "ignHint", "gpsAcc", "btnIgnition", "btnUnits", "sourceValue"
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
      state.ignition = localStorage.getItem(STORAGE.ign) === "1";
    } catch (e) {}
  }

  function saveOdo() {
    try {
      localStorage.setItem(STORAGE.odo, String(state.odoMi));
      localStorage.setItem(STORAGE.trip, String(state.tripMi));
    } catch (e) {}
  }

  function setIgnition(on) {
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
    if (els.ignHint) {
      els.ignHint.textContent = state.ignition
        ? "Ignition on · GPS tracking active"
        : "Turn ignition on to ride";
    }
    try { localStorage.setItem(STORAGE.ign, state.ignition ? "1" : "0"); } catch (e) {}
  }

  function toggleIgnition() {
    setIgnition(!state.ignition);
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

  function setGpsStatus(ok, accM) {
    state.gpsOk = ok;
    state.accuracyM = accM;
    if (els.connDot) {
      els.connDot.className = "dot " + (ok ? "ok" : "err");
    }
    if (els.connLabel) {
      els.connLabel.textContent = ok ? "GPS locked" : "GPS searching…";
    }
    if (els.gpsAcc) {
      if (ok && accM != null) {
        els.gpsAcc.textContent = "GPS · ±" + Math.round(accM) + " m";
      } else {
        els.gpsAcc.textContent = "GPS · waiting for fix";
      }
    }
  }

  function render() {
    var maxScale = cfg.maxSpeedMph || 80;
    var displaySpeed = unitSpeed(state.speedMph);
    var maxScaleDisplay = unitSpeed(maxScale);

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

    if (els.sourceValue) els.sourceValue.textContent = state.gpsOk ? "GPS" : "—";
  }

  function haversineMi(lat1, lon1, lat2, lon2) {
    var R = 3958.8;
    var toRad = Math.PI / 180;
    var dLat = (lat2 - lat1) * toRad;
    var dLon = (lon2 - lon1) * toRad;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  var watchId = null;
  var tripClock = null;

  function onPosition(pos) {
    var c = pos.coords;
    var mph = (c.speed != null && !isNaN(c.speed)) ? c.speed * 2.236936 : 0;
    if (mph < 0) mph = 0;
    // Filter tiny GPS noise when stationary
    if (mph < 0.8) mph = 0;

    var now = Date.now();
    var dt = state.lastFixTs ? (now - state.lastFixTs) / 1000 : 0;
    state.lastFixTs = now;

    if (state.ignition && dt > 0 && dt < 5) {
      state.tripMs += dt * 1000;
      if (mph > 0.8) state.movingMs += dt * 1000;
    }

    // Distance from speed integration when ignition on
    if (state.ignition && mph > 0.8 && dt > 0 && dt < 5) {
      var dMi = mph * (dt / 3600);
      state.tripMi += dMi;
      state.odoMi += dMi;
      saveOdo();
    } else if (state.ignition && state.lastLat != null && c.latitude != null && mph <= 0.8) {
      // optional: no integration when stopped
    }

    state.speedMph = mph;
    if (state.ignition && mph > state.maxMph) state.maxMph = mph;

    if (c.heading != null && !isNaN(c.heading)) state.heading = c.heading;
    if (c.altitude != null && !isNaN(c.altitude)) state.altitudeFt = c.altitude * 3.28084;

    state.lastLat = c.latitude;
    state.lastLng = c.longitude;

    setGpsStatus(true, c.accuracy);
    render();

    // Maps marker
    if (window._pucaMapMarker && c.latitude != null) {
      var ll = { lat: c.latitude, lng: c.longitude };
      window._pucaMapMarker.setPosition(ll);
      if (window._pucaMapFollow) window._pucaMap.setCenter(ll);
    }
  }

  function onPositionError() {
    setGpsStatus(false, null);
    state.speedMph = 0;
    render();
  }

  function startGps() {
    if (!navigator.geolocation) {
      setGpsStatus(false, null);
      if (els.connLabel) els.connLabel.textContent = "No GPS on this device";
      return;
    }
    if (watchId != null) return;
    watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
      enableHighAccuracy: true,
      maximumAge: 500,
      timeout: 15000
    });
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

  // ---- Google Maps ----
  window.initPucaMap = function () {
    var el = $("map");
    if (!el || !window.google) return;
    window._pucaMap = new google.maps.Map(el, {
      center: { lat: 40.7128, lng: -74.006 },
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1f2b" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0b0f19" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#a8b4c4" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a3142" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1628" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] }
      ]
    });
    window._pucaMapMarker = new google.maps.Marker({ map: window._pucaMap, title: "Puca" });
    window._pucaMapFollow = true;
    locate();
  };

  function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var ll = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (window._pucaMap) {
        window._pucaMap.setCenter(ll);
        window._pucaMap.setZoom(16);
        if (window._pucaMapMarker) window._pucaMapMarker.setPosition(ll);
      }
    }, function () {}, { enableHighAccuracy: true, timeout: 8000 });
  }

  function boot() {
    cacheEls();
    loadPersisted();
    setIgnition(state.ignition);
    render();
    startGps();

    if (els.btnIgnition) els.btnIgnition.addEventListener("click", toggleIgnition);
    if ($("btnResetTrip")) $("btnResetTrip").addEventListener("click", resetTrip);
    if (els.btnUnits) els.btnUnits.addEventListener("click", toggleUnits);
    if ($("btnLocate")) $("btnLocate").addEventListener("click", locate);

    // Keep trip clock updating time display while ignition on even between GPS ticks
    tripClock = setInterval(function () {
      if (state.ignition && state.gpsOk) render();
    }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
