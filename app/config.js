// Puca Dash — Votol EM150 configuration
window.PUCA_CONFIG = {
  controller: "Votol EM150",
  canBaud: 250000,

  // Google Maps JavaScript API key
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",

  // Usable pack energy (kWh) — Puca modular pack
  packKwh: 8.5,

  // Wh/mile for range estimate at ~45 mph cruise
  whPerMile: 80,

  // Tire circumference in mm (measure for your exact tire)
  // 20×4.0 fat tire ≈ 1600–1680 mm; adjust after a GPS speed check
  tireCircumferenceMm: 1640,

  // Max speed ring scale (mph)
  maxSpeedMph: 80,

  // 16S pack for voltage→SOC estimate when BMS SOC is absent
  seriesCells: 16,

  // Optional WebSocket bridge (ESP32 SoftAP example)
  // Bridge should poll Votol 0x3FF and forward 0x3FE frames or JSON telemetry
  wsUrl: null,

  ble: {
    optionalServices: [
      "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
      "0000fff0-0000-1000-8000-00805f9b34fb"
    ]
  }
};
