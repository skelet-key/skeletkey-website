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

---

## EAS Build

Config files: `eas.json`, `app.json` (`extra.eas.projectId`), `.easignore`.

### One-time setup

```bash
cd mobile
npm install
npm install -g eas-cli   # or use npx eas
eas login                # Expo account (expo.dev)
eas init                 # links project; writes real projectId into app.json
```

Replace `REPLACE_AFTER_EAS_INIT` in `app.json` if `eas init` does not update it automatically.

### Profiles (`eas.json`)

| Profile | Use | Android output | iOS |
|---------|-----|----------------|-----|
| **development** | Dev client + BLE debugging | Debug APK | Simulator |
| **preview** | Internal testers | **APK** (sideload) | Ad hoc device |
| **production** | Stores | **AAB** (Play) | App Store build |

### Commands

```bash
# Internal APK to install on a phone
npm run build:preview:android

# Play Store bundle
npm run build:production:android

# iOS (needs Apple Developer Program)
npm run build:preview:ios
npm run build:production:ios
```

Or:

```bash
eas build --platform android --profile preview
eas build --platform all --profile production
```

### BLE ignition builds

Expo Go cannot use BLE. For hardware relay:

```bash
npx expo install react-native-ble-plx
eas build --platform android --profile development
# install the development client, then
npx expo start --dev-client
```

### Credentials

- **Android:** EAS can generate a keystore on first build (recommended) or you upload your own.
- **iOS:** EAS manages certs/profiles after you sign in with your Apple Developer account.
- **Submit:** put Play service account JSON path in `eas.json` → `submit.production.android.serviceAccountKeyPath`, and fill App Store Connect IDs under `submit.production.ios`.

### Google Maps on native builds

Keys are set under `app.json` → `android.config.googleMaps.apiKey` and `ios.config.googleMapsApiKey`.  
In Google Cloud, restrict the key to:

- Android package `com.skeletkey.puca` + SHA-1 of the **EAS** signing cert  
- iOS bundle `com.skeletkey.puca`

Get Android SHA-1 after the first EAS build from the Expo credentials page or:

```bash
eas credentials -p android
```
