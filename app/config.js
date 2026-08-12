// SkeletKey Puca App — GPS speedometer + BLE ignition relay
window.PUCA_CONFIG = {
  appName: "SkeletKey Puca",
  controller: "FarDriver ND72360 BT",

  // Google Maps JavaScript API key (optional — maps pane)
  googleMapsApiKey: "AQ.Ab8RN6LPuyYoni3OMGSfqIJ1bu-OFSU-z5T0gtCayKfqVrrs6w",

  packKwh: 8.5,
  whPerMile: 80,
  maxSpeedMph: 80,
  speedAlertMph: 0,
  units: "mph", // mph | kmh

  seriesCells: 16,
  nominalVoltage: 60.8,

  /**
   * BLE ignition relay (ESP32 firmware in hardware/esp32-ignition-relay/)
   * Protocol: Nordic UART Service (NUS)
   *   App → device (RX char):  "IGN:1\n" | "IGN:0\n" | "PING\n" | "STATUS?\n"
   *   Device → app (TX char):  "IGN:1\n" | "IGN:0\n" | "PONG\n" | "ERR:...\n"
   * Device advertises local name containing "PucaIgn" or "SkeletKey"
   */
  ble: {
    deviceNameHints: ["PucaIgn", "SkeletKey", "Puca"],
    // Nordic UART Service
    serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    // ESP32: RX = phone writes commands here
    rxCharUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    // ESP32: TX = phone receives notifications here
    txCharUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
    optionalServices: [
      "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
      "0000ffe0-0000-1000-8000-00805f9b34fb"
    ],
    // On BLE disconnect, treat ignition as OFF in the UI (hardware also drops relay)
    failSafeOffOnDisconnect: true
  }
};
