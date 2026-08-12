# SkeletKey Puca — React Native (Expo)

Native Android / iOS app port of the Puca dash:

- GPS speedometer + trip computer  
- Software **IGN ON/OFF**  
- Map (react-native-maps)  
- Optional **BLE ignition relay** (`PucaIgn` ESP32) via `react-native-ble-plx` in a **dev/EAS build**

## Quick start (Expo Go — GPS + UI only)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android / iOS).  
Ignition works in the UI; **hardware BLE is not available in Expo Go**.

## BLE ignition (hardware)

```bash
npx expo install react-native-ble-plx
npx expo prebuild
npx expo run:android   # or run:ios on a Mac
```

Or EAS:

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Flash the ESP32 sketch in `../hardware/esp32-ignition-relay/` (advertises **PucaIgn**).

## Google Maps

For production native maps, after `prebuild` set platform keys:

- **Android:** `com.google.android.geo.API_KEY` in the Android manifest  
- **iOS:** `GMSServices.provideAPIKey` / Expo `ios.config.googleMapsApiKey`

The web key in `src/config.js` is for reference; restrict keys by package name / bundle ID in Google Cloud.

## Project layout

```
mobile/
  App.js
  app.json
  src/
    config.js
    hooks/usePucaRide.js
    screens/DashScreen.js
    services/bleIgnition.js
    services/storage.js
```

## Relation to web app

| Feature | Web `/app/` | Expo `mobile/` |
|---------|-------------|----------------|
| GPS speed / trip | Yes | Yes |
| Maps | Google Maps JS | react-native-maps |
| BLE relay | Web Bluetooth (Android Chrome) | ble-plx (dev build) |
| Install | PWA / browser | APK / IPA via EAS |
