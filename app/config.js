// Puca Dash configuration
window.PUCA_CONFIG = {
  // Create a key at https://console.cloud.google.com/ — enable "Maps JavaScript API"
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",

  // Usable pack energy (kWh) for range estimate when BMS sends SOC only
  packKwh: 8.5,

  // Wh/mile used for range estimate (real-world ~45 mph cruise)
  whPerMile: 80,

  // Max speed ring scale (mph)
  maxSpeedMph: 80,

  // Optional WebSocket CAN bridge (e.g. ESP32 gateway)
  // wsUrl: "ws://192.168.4.1/can",
  wsUrl: null,

  // BLE Nordic UART-style service used by many CAN-BLE bridges (override if your dongle differs)
  ble: {
    // Leave serviceUuid null to accept any device and pick first UART-like service
    optionalServices: [
      "6e400001-b5a3-f393-e0a9-e50e24dcca9e", // Nordic UART
      "0000fff0-0000-1000-8000-00805f9b34fb"
    ]
  }
};
