# Bill of Materials (BOM) Cost Tracking Matrix
## Target volume: **5,000 units/year** · sourced-kit target **$3,139**
## Frame: **$375** · Pack: **$1,200** · FarDriver: **$199** (price paid for one) · MSRP $6,999
## Updated: 2026-08-21

Prices are **5,000-unit lots** except where a real 1-off is known. **FarDriver ND72360 BT = $199** (actual unit paid — no invented volume cut until they quote). **Pack = $1,200** (realistic 8.5 kWh / ~60 lb NMC+ with enclosure/BMS). Frame **$375**. Assembly labor **$500 is not in this kit**.

---

## 1. Roll-up (bulk @ 5,000)

| Category | Spec | Unit $ | Annual 5k $ |
| :--- | :--- | ---: | ---: |
| Folding frame | Kalosse carbon steel folder · 9.2 lb · 190 mm | **375** | 1,875,000 |
| Battery module | ~8.5 kWh · ~63 V · ~60 lb · NMC+ · BT BMS · dual QS8 | **1,200** | 6,000,000 |
| Hub motor | QS205 V3 50H 3T · 20×4.0 · 28.6 lb | 285 | 1,425,000 |
| Controller | FarDriver ND72360 BT (**$199** 1-off, used as lot price) | **199** | 995,000 |
| Front end | HIMALO 135 mm fork, ZS44, stem, 20×4.0 wheel, tire, disc | 175 | 875,000 |
| Rear hub install | Tire, 6×44 rotor, left caliper, M16 torque arms, phase/Hall | 80 | 400,000 |
| Deck / seat / hardware | 6061 deck+rails+legs, café pan, Grade 8, straps | 120 | 600,000 |
| HV pack interface | Blind-mate/QS8 dock, interlock, cam lock, 200 A fuse, precharge | 70 | 350,000 |
| CCS1 stack | Inlet+Küster, EVCC, IMD, contactors, 6–8 kW DC–DC, 12 V aux | 530 | 2,650,000 |
| Controls / wireless / dash | Signals, brake lamp, headlamp, BLE ignition, throttle, mount, screen | 75 | 375,000 |
| Crate / pack-out | Export crate, foam, labels | 30 | 150,000 |
| **Total sourced BOM** | | **3,139** | **15,695,000** |

Kit vs MSRP: **44.8%**. Gross after $500 assembly: **$3,360 / 48.0%**.

---

## 2. Line items (bulk)

### A. Chassis
| # | Part | Bulk $ |
|---|------|--------:|
| A1 | Folding frame — carbon steel, 9.2 lb, 190 mm dropout, 44 mm HT ([source 1](https://www.aliexpress.us/item/3256808448955861.html?spm=a2g0o.order_list.order_list_main.5.23811802Vm2a2e&gatewayAdapt=glo2usa) / [source 2](https://www.aliexpress.com/item/1005012630592144.html)) | **375** |

### B. Energy
| # | Part | Bulk $ |
|---|------|--------:|
| B1 | Semi-solid NMC+ module ~8.5 kWh / ~63 V / ~60 lb, enclosure, Bluetooth BMS, two QS8 | **1,200** |

### C. Powertrain
| # | Part | Bulk $ |
|---|------|--------:|
| C1 | QS205 V3 (50H) 3T 20×4.0 190 mm | 285 |
| C2 | FarDriver ND72360 BT — **$199 paid for one**; lot price held at $199 until a volume quote | **199** |

### D. Front end (HIMALO through 44 mm)
| # | Part | Bulk $ |
|---|------|--------:|
| D1 | HIMALO 20×4.0 fork, 135 mm, 1-1/8″ straight | 50 |
| D2 | ZS44/28.6 headset + crown race + star nut + top cap + spacers | 20 |
| D3 | Stem 28.6 → 31.8, 60–90 mm | 6 |
| D4 | Bars + grips | 10 |
| D5 | Front wheel 20×4.0, 9×135 mm, 6-bolt | 48 |
| D6 | Front 20×4.0 tire + tube | 18 |
| D7 | Front disc 160–180 mm + caliper | 23 |
| | **Front subtotal** | **175** |

### E. Rear hub
| # | Part | Bulk $ |
|---|------|--------:|
| E1 | Rear 20×4.0 tire + tube (rim on motor) | 18 |
| E2 | 6-bolt rotor 6×44 + left caliper/lever | 38 |
| E3 | M16 torque arms (pair) | 14 |
| E4 | Phase / Hall extensions, IP65 | 10 |
| | **Rear subtotal** | **80** |

### F. Deck, seat, hold-down
| # | Part | Bulk $ |
|---|------|--------:|
| F1 | 6061 deck ~20×8, slide rails, 1×1 legs, gussets (lot-cut) | 68 |
| F2 | Stay clamps + Grade 8 / nylocks | 16 |
| F3 | Café pan + rubber isolators | 28 |
| F4 | Cam straps, non-slip, P-clamps | 8 |
| | **Deck subtotal** | **120** |

### G. HV pack interface (bike side)
| # | Part | Bulk $ |
|---|------|--------:|
| G1 | Blind-mate ± or Anderson SB175 dock (≥150 A) | 18 |
| G2 | Fully-seated interlock (Omron D4N class) | 8 |
| G3 | Southco-class over-center lock | 10 |
| G4 | ANL/MEGA 200 A + 50 W precharge + small relay | 20 |
| G5 | QS8 leads/caps to FarDriver (6 AWG) | 14 |
| | **Interface subtotal** | **70** |

### H. CCS1 public charge
| # | Part | Bulk $ |
|---|------|--------:|
| H1 | CCS1 inlet EV-T1GBIE12 class + Küster 03S | 50 |
| H2 | EVCC (DIN 70121 / ISO 15118) | 85 |
| H3 | IMD | 35 |
| H4 | HV contactors ×2 (GV200 class) | 65 |
| H5 | IVT / current-voltage sensor | 25 |
| H6 | Isolated DC–DC HV → ~63 V, 6–8 kW | 250 |
| H7 | 12 V aux DC–DC | 15 |
| H8 | HV cable, PE, strain | 5 |
| | **CCS subtotal** | **530** |

### I. Wireless, ignition, dash
| # | Part | Bulk $ |
|---|------|--------:|
| I1 | Wireless turn-signal kit IP65 | 18 |
| I2 | Wireless / remote brake lamp | 10 |
| I3 | Headlamp | 16 |
| I4 | ESP32 BLE ignition relay | 8 |
| I5 | Hall throttle + kill / e-stop | 14 |
| I6 | Magnetic phone mount | 6 |
| I7 | Detachable windscreen | 3 |
| | **Controls subtotal** | **75** |

### J. Pack-out
| # | Part | Bulk $ |
|---|------|--------:|
| J1 | Export crate, foam, UN labels as required | 30 |

**Grand total $3,139.**

---

## 3. Unit economics at bulk

| Metric | Per unit | Annual (5,000) | % MSRP |
|--------|----------|----------------|--------|
| MSRP | $6,999 | $34,995,000 | 100% |
| **Sourced BOM (this sheet)** | **$3,139** | **$15,695,000** | **44.8%** |
| Contract assembly & QA | $500 | $2,500,000 | 7.1% |
| **Gross margin** | **$3,360** | **$16,800,000** | **48.0%** |

FarDriver stays **$199** until they quote 5k. Pack modeled at **$1,200** (8.5 kWh / ~60 lb) — that is the swing line. Dual-source frames if one listing cannot hold **$375** at 5k.

Optional (not in kit): Statorade ~$8 bulk; hubsinks.

Do **not** mix 6061 chassis-mill quotes into A1; 6061 is deck/rails only.
