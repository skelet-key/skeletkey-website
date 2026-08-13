# Google Play Store listing — SkeletKey Puca

Use this copy when publishing the Expo / Android build (`com.skeletkey.puca`).

---

## App name (30 characters max)

**SkeletKey Puca**

Alternate if needed: **Puca Dash**

---

## Short description (80 characters max)

**Folding EV motorcycle dash: speed, trip, OSM map, IP location, BLE ignition.**

(78 characters)

---

## Full description

```
SkeletKey Puca is the rider dash for the SkeletKey folding electric motorcycle — speed, trip computer, navigation, and optional BLE ignition control in one dark, glanceable UI.

MAP & NAVIGATION (no Google Maps billing)
• OpenStreetMap via Leaflet — free map tiles
• Search a destination with autocomplete (Photon / OSM)
• In-app routing with OSRM — route draws on the same screen
• Follow mode keeps your position centered while you ride to the destination
• Tap Navigate and choose a point on the map, or search by name

LOCATION
• Primary positioning uses IP geolocation so the map centers quickly without requiring a browser-style permission wall on first load
• City-level accuracy for map origin and routing start
• Optional device GPS is used only when the system has already granted location access, to refine accuracy and support live speed
• Last known position is cached for faster startup

RIDE INSTRUMENTS
• Large digital speedometer (mph / km/h)
• Trip distance, max/avg speed, ride time
• Heading and altitude when available
• Estimated range and battery display
• Odometer stored on device

IGNITION (HARDWARE)
• Software IGN ON/OFF for the dash interlock
• Optional BLE link to a PucaIgn ESP32 relay for enable/contactor control
• Fail-safe: disconnect turns ignition UI/hardware path off
• Keep a physical key or e-stop in series with pack power

BUILT FOR PUCA
• FarDriver ND72360–class controllers
• Folding modular motorcycle workflow: garage, apartment, travel
• Works with the SkeletKey product line at skeletkey.com

NOTES
• IP location is approximate (typically city-level). For precise navigation while moving, allow device location when prompted by the system.
• BLE ignition requires a compatible relay module and is not available in Expo Go; use a production/dev build.
• Map data © OpenStreetMap contributors. Routing via OSRM. Search via Photon.

SkeletKey — the first folding, electric, modular, affordable motorcycle.
```

---

## App category

- **Primary:** Maps & Navigation  
- **Secondary:** Auto & Vehicles  

---

## Tags / keywords (internal reference)

```
electric motorcycle, folding motorcycle, EV dash, speedometer, OpenStreetMap,
OSRM, IP geolocation, trip computer, BLE ignition, SkeletKey, Puca, ebike dash
```

---

## Graphic assets (you provide)

| Asset | Spec |
|--------|------|
| App icon | 512 × 512 PNG, 32-bit |
| Feature graphic | 1024 × 500 PNG |
| Phone screenshots | min 2, up to 8 — 16:9 or 9:16 |
| Tablet screenshots | optional |

**Screenshot ideas**
1. Speedometer + trip metrics (dark UI)  
2. Map with green route and search box  
3. Destination autocomplete results  
4. IGN ON + GPS/IP status  
5. BLE “Connect relay” state  

---

## Content rating questionnaire (expected)

- No user-generated public social content  
- No violence / gambling / drugs  
- Location: **yes** (IP-based map center; optional GPS for speed)  
- Explain in privacy policy: IP used for approximate map position; GPS optional for accuracy/speed  

---

## Privacy policy — location blurb (paste into policy)

```
SkeletKey Puca estimates your approximate position using IP-based geolocation
to center the map and start routes without requiring precise device GPS on
first launch. If you grant location permission at the system level, the app
may use the device location provider to improve accuracy and show live speed.
Location data is processed on your device and for map/routing requests to
OpenStreetMap-related services (e.g. tile servers, Photon search, OSRM).
We do not sell your location data.
```

---

## Data safety form (Play Console summary)

| Data type | Collected? | Shared? | Purpose |
|-----------|------------|---------|---------|
| Approximate location (IP) | Yes | With map/search/routing providers | App functionality |
| Precise location (GPS) | Optional | Same, only if permitted | App functionality |
| App interactions | No (unless you add analytics later) | — | — |

---

## Release notes (1.0.0)

```
Initial release of SkeletKey Puca:
• Speedometer and trip computer
• OpenStreetMap + destination search
• In-app routing with rider follow mode
• IP geolocation for fast map centering
• Optional BLE ignition relay support
```

---

## Package / technical

- **Application ID:** `com.skeletkey.puca`  
- **Location mode:** IP-first (`ipwho.is` / `ipapi.co`), GPS only if already granted  
- **Maps:** Leaflet + OSM (not Google Maps SDK)  
- **Build:** EAS `production` profile → AAB for Play  

```bash
cd mobile
eas build --platform android --profile production
eas submit --platform android
```
