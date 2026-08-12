// SkeletKey Puca App — GPS speedometer + ignition
window.PUCA_CONFIG = {
  appName: "SkeletKey Puca",
  controller: "FarDriver ND72360 BT",

  // Google Maps JavaScript API key (optional — maps pane)
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",

  // Pack energy for range estimate
  packKwh: 8.5,
  whPerMile: 80,

  // Speedometer scale (mph)
  maxSpeedMph: 80,

  // Speed alert threshold (0 = off)
  speedAlertMph: 0,

  // Units
  units: "mph", // mph | kmh

  // 16S pack nominal for display defaults
  seriesCells: 16,
  nominalVoltage: 60.8,

  // Optional future BLE (FarDriver dongle / relay for ignition hardware)
  ble: {
    optionalServices: [
      "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
      "0000ffe0-0000-1000-8000-00805f9b34fb"
    ]
  }
};
