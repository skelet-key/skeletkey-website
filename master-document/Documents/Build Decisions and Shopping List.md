# BUILD DECISIONS & REMAINING SHOPPING LIST
## Document Reference: BD-2026-V1
## Classification: Internal · Current build baseline
## Updated: 2026-08-22

---

## 0. PRODUCTION MODEL (LOCKED)

SkeletKey **sources frames and parts** and uses **contract assemblers** for **5,000 units/year**. We do not operate a frame factory or buy extrusion dies as the scale plan. Canonical write-up: **Production and Sourcing Model.md**.

---

## 1. LOCKED DECISIONS

| Area | Decision |
|------|----------|
| **Frame** | Carbon steel folding full-suspension, **9.2 lb** measured, **190 mm** rear dropout |
| **Motor** | **QS205 50H**, 190 mm dropout, **3T**, 20×4.0, **28.6 lb** measured |
| **Controller** | **FarDriver ND72360 with Bluetooth** (not Votol EM150 CAN) |
| **Dash / phone UI** | **SkeletKey Puca app** at `/app/` — GPS speedometer (GPS Speedometer Premium–style) + **software ignition** + trip computer + optional Maps |
| **Companion apps** | FarDriver official app for tuning; Puca app for ride instruments |
| **Battery** | Modular semi-solid **NMC+**, **~60 lb**, ~**19–20″ × 6.5″ × 4.5–5″**, ~**8.5 kWh**, **63 V nominal**, Bluetooth BMS, **6–8 kW** charge / **8 kW** discharge, dual **QS8** |
| **Seat** | **No seatpost seat** — rear **battery deck** + **café-racer solo seat on top** |
| **Rack** | Custom **6061 aluminum** deck bolted to steel stay tabs (not light tourist rack) |
| **CAN / ESP32 bridge** | **Not required** for FarDriver path (optional later) |

---

## 2. POWERTRAIN NOTES

### FarDriver ND72360 BT
- Operating voltage: **48–72 V** (matches **63 V nominal** pack)
- ~190 A battery / ~360 A phase class
- Wireless programming + live telemetry via **FarDriver app**
- Product reference: https://econiccycles.com/products/fardriver-sinewave-controller-nd72360-w-bluetooth

### QS205 V3 50 3T @ ~63 V
- 3T winding can reach **~70 mph** under ideal conditions on suitable tire diameter
- Requires adequate continuous current and low voltage sag (quality cells / BMS)
- Thermal: consider **Statorade** + hubsinks for sustained high speed  
  Product info: https://ebikes.ca/product-info/grin-products/statorade.html

### SkeletKey Puca app (`/app/`)
- GPS-based speed, trip, max, avg, time, heading, altitude
- **Ignition ON/OFF** software interlock (use with bike key/e-lock)
- Odometer persisted in browser storage
- In-app **OpenStreetMap** navigation (no Google Maps API required)
- mph / km/h toggle

---

## 3. REAR BATTERY + CAFÉ SEAT ARCHITECTURE

```
  [café-racer solo seat]
           |
  [seat rails + rubber isolators]
           |
  [~60 lb pack 19–20″ × 6.5″ × 4.5–5″]
           |
  [6061 deck ~20″ × 8″]
           |
  [tube legs → bolt to blue seat stays + lower tabs]
           |
  [QS205 190 mm · disc LEFT · torque arms]
```

### Aluminum cut list (6061-T6)
| Qty | Part | Size |
|-----|------|------|
| 1 | Deck | 20″ × 8″ × ⅛″ |
| 2 | Side walls (optional) | 20″ × 3″ × ⅛″ |
| 2 | Seat rail plates | 18″ × 1.5″ × ⅛″ |
| 4 | Gussets | 3″ × 3″ × ⅛″ triangles |
| — | Legs / mounts | 1″ × 1″ × 0.125″ tube (measure stays) |

- **TIG** aluminum sub-assembly; **bolt only** to steel frame  
- Filler: **ER4043** (general) or **ER5356** (strength / anodize)  
- Plate sources: https://sendcutsend.com · https://www.onlinemetals.com · https://www.metalsupermarkets.com

---

## 4. REMAINING PARTS TO BUY (WITH LINKS)

### Motor install
| Item | Links |
|------|--------|
| **M16 torque arms** (pair) | https://www.ebay.com/sch/i.html?_nkw=M16+torque+arm+electric+bike · https://www.aliexpress.com/w/wholesale-M16-torque-arm-electric-bike.html · https://www.amazon.com/s?k=M16+torque+arm+electric+bike |
| **6-bolt rotor 44 mm PCD** (180 or 203 mm) | https://www.amazon.com/Corki-Cycles-180mm-Brake-Mountain/dp/B0CSCN9V27 · https://www.ebay.com/sch/i.html?_nkw=180mm+6+bolt+disc+rotor+44mm |
| **Rear disc caliper + lever** | https://www.amazon.com/s?k=Shimano+MT200+hydraulic+disc+brake · https://www.amazon.com/s?k=Tektro+HD-M275 |

### Rack / seat / pack hold-down
| Item | Links |
|------|--------|
| **Café solo seat** | https://www.lowbrowcustoms.com/collections/seats · https://www.tcbroschoppers.com/collections/seats · https://www.ebay.com/sch/i.html?_nkw=cafe+racer+solo+seat |
| **Heavy rack / plate** | https://www.aliexpress.com/w/wholesale-electric-bike-rear-rack-steel.html · https://www.ebay.com/sch/i.html?_nkw=heavy+duty+steel+electric+bike+rear+rack |
| **Cam straps 1″** | https://www.ebay.com/sch/i.html?_nkw=1+inch+cam+buckle+strap · https://www.amazon.com/s?k=1+inch+cam+buckle+strap |
| **Non-slip mat** | https://www.amazon.com/s?k=tool+box+liner+non+slip |
| **P-clamps (rubber-lined)** | https://www.aliexpress.com/w/wholesale-rubber-lined-P-clamp.html · https://www.mcmaster.com/ |
| **Grade 8 bolts / nylocks** | https://www.fastenal.com/ · https://www.amazon.com/s?k=Grade+8+hex+bolt+assortment+M6+M8 |

### Controls (FarDriver ND72360 fold radio)

Waterproof **TX at the bars / RX at the rear**, numbered 1–8. Separate analog radio for throttle. Battery SOC is Bluetooth, not RF. Pin map: **Action Item Tracker.md §6**.

| Item | Compatible because | Buy |
|------|--------------------|-----|
| **eletechsup RTTXA08 + RTRXB08 with shell** | Enclosed 8DI TX + 8-relay RX. ~$50 pair. Not a fob. | https://eletechsup.com/products/8ch-433m-dc-12v-lora-bidirectional-remote-io-controller-led-feedback-indicator-npn-in-relay-out-swicth-module-board · https://www.aliexpress.com/item/1005006919833785.html |
| **0–5 V analog RF pair** (throttle) | Hall in → 0–5 V out at FarDriver. Digital 8CH cannot do this. | https://www.aliexpress.com/item/1005006843832014.html · https://www.falconpev.com.sg/products/wireless-throttle-for-e-scooter-e-bike |
| **Falcon PEV wireless throttle** (hall TX + RX) | RX → FarDriver throttle red / black / green. Fail-to-zero on RF loss. | https://www.falconpev.com.sg/products/wireless-throttle-for-e-scooter-e-bike |
| Numbered **GX16** pigtails + IP67 boxes | Same pin numbers on both boards | https://www.amazon.com/s?k=GX16+8+pin+aviation+connector+pair · https://www.amazon.com/s?k=IP67+project+box+waterproof+electronics |
| Battery level | FarDriver BT + pack Bluetooth BMS — **not** a 433 MHz channel | FarDriver app · BMS app · https://skeletkey.com/app/ |
| Main fuse / contactor | Pack continuous current | See Action Item Tracker §7 |
| Phase / Hall extensions | Waterproof, left-side, clear of disc | https://www.amazon.com/s?k=QS+hub+motor+phase+hall+extension+waterproof |

### Optional
| Item | Link / note |
|------|-------------|
| Statorade | https://ebikes.ca/product-info/grin-products/statorade.html |
| ESP32 + SN65HVD230 | **Skip** unless returning to CAN bridge experiments |

---

## 5. CLEARANCE RULES (RACK + QS205)

- **Left dropout:** disc rotor, caliper, motor cable exit — keep rack open  
- **Deck height:** clear 20×4.0 tire at **full suspension compression** + safety gap  
- **Fold:** rack must not hit front half when folded  
- **Torque arms** required on M16 axle flats before high-power rides  

---

## 6. APP URLS

| App | URL |
|-----|-----|
| SkeletKey Puca (GPS + ignition) | https://skeletkey.com/app/ |
| Master document (password) | https://skeletkey.com/master-document/ |
| FarDriver mobile app | Official store / FarDriver site APK for Android |

---

*This document supersedes earlier Votol-CAN-first dash assumptions for the production build path.*
