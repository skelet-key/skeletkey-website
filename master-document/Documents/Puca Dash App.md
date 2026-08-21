# PUCA DASH APP
## Phone display for Puca — ignition, speed, range, in-app navigation
## Live: [https://www.skeletkey.com/app/](https://www.skeletkey.com/app/)
## Updated: 2026-08-21

The rider’s display is **their phone**, magnetically docked. Open **[www.skeletkey.com/app](https://www.skeletkey.com/app/)** (Chrome on Android for Bluetooth ignition). No Google Maps API — **OpenStreetMap** stays **in the same screen**.

---

## 1. Live embed

Open the real dash (same origin as this site). Full screen: **[https://www.skeletkey.com/app/](https://www.skeletkey.com/app/)**

---

## 2. How it behaves on the bike

### Ignition
- Starts **OFF** every load (never restores ON from storage).
- **IGN** button is a software interlock.
- **Connect relay** uses Web Bluetooth to an ESP32 (`PucaIgn`) that closes the **enable / contactor coil**.
- Keep a **physical key or e-stop** in series with pack power — the app is not the only cutout.
- Chrome / Edge on Android for BLE. iOS Safari does not run Web Bluetooth.

### Speed (mph)
- Primary number is **GPS speed** (not the FarDriver app).
- Toggle **mph / km/h**.
- Trip computer: trip distance, max, average, moving time, heading, altitude.
- Odometer persisted in the browser. Reset trip does not wipe odo.

### Range
- **Range est.** and **Battery %** are on-screen estimates (default ~105 mi / ~84% until live BMS is wired).
- Production path: Bluetooth BMS on the ~8.5 kWh / ~60 lb pack feeds SoC; range = SoC × pack kWh / Wh per mile (windscreen vs not).
- FarDriver ND72360 app remains the **tune / phase-current** tool; Puca dash is the **ride instruments**.

### In-app navigation
- Map pane is **Leaflet + OpenStreetMap** (no paid Maps key).
- Search box: type a destination (Photon geocoder); pick a result.
- **Navigate** draws an **OSRM** route **inside the map** — it must not open a new tab.
- **My location** / IP + GPS cascade to keep the rider centered while moving.
- Zoom controls sit on the **right** so they don’t cover search.

### Hardware pairing
| Piece | Role |
|-------|------|
| Magnetic phone mount | Dash; phone is the display |
| Puca app | Speed, trip, ignition UI, map |
| FarDriver app | Controller programming |
| BLE relay | Ignition coil |
| Pack BMS app | Cell-level SoC (range source) |

---

## 3. Assembler / rider note

Dock phone → open [https://www.skeletkey.com/app/](https://www.skeletkey.com/app/) → Connect relay → IGN ON → Navigate stays on this screen while you ride.
