// SkeletKey Puca App — GPS speedometer + BLE ignition relay
window.PUCA_CONFIG = {
  appName: "SkeletKey Puca",
  controller: "FarDriver ND72360 BT",

  // Google Maps JavaScript API key — leave empty in git; set via app/config.local.js
  googleMapsApiKey: "",

  packKwh: 8.5,
  whPerMile: 80,
  maxSpeedMph: 80,
  speedAlertMph: 0,
  units: "mph",

  seriesCells: 16,
  nominalVoltage: 60.8,

  ble: {
    deviceNameHints: ["PucaIgn", "SkeletKey", "Puca"],
    serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    rxCharUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    txCharUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
    optionalServices: [
      "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
      "0000ffe0-0000-1000-8000-00805f9b34fb"
    ],
    failSafeOffOnDisconnect: true
  }
};
