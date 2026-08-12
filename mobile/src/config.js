/**
 * SkeletKey Puca — Expo app config
 * Mirrors web app/config.js where practical.
 */
export const PUCA_CONFIG = {
  appName: 'SkeletKey Puca',
  controller: 'FarDriver ND72360 BT',

  // Google Maps — on native, react-native-maps uses platform keys:
  // Android: android/app/src/main/AndroidManifest.xml meta-data
  // iOS: AppDelegate / Info.plist
  // For Expo: set in app.json ios.config.googleMapsApiKey / android.config.googleMaps.apiKey after prebuild
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',

  packKwh: 8.5,
  whPerMile: 80,
  maxSpeedMph: 80,
  unitsDefault: 'mph',

  seriesCells: 16,
  nominalVoltage: 60.8,

  ble: {
    deviceNameHints: ['PucaIgn', 'SkeletKey', 'Puca'],
    serviceUuid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    rxCharUuid: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    txCharUuid: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
    failSafeOffOnDisconnect: true,
  },
};
