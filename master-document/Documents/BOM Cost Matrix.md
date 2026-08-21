# Bill of Materials (BOM) Cost Tracking Matrix
## Target: **5,000 / year** · parts **$2,889** · assembly **$500** · **all-in $3,389**
## Frame **$375** (rear shock included) · Pack **$1,200** · FarDriver **$150** (factory lot) · MSRP $6,999
## Updated: 2026-08-21

Kalosse **includes the rear shock** — not a separate line. **$500 contract assembly is inside all-in COGS**, not a footnote. Parts are **5,000-unit lots** (OEM / FOB) except the pack, which stays at the realistic **$1,200** you set.

Research used: QS Motor factory ND72360 **$137.89–$158.50** → lot **$150** (you paid $199 1-off). QS205 50H 3T Alibaba **~$339**/set → **$255** at 5k. BNEF NMC pack avg **~$128/kWh**; 8.5 kWh custom semi-solid + enclosure held at **$1,200**. Chinese 6–8 kW isolated DC–DC and EVCC lots below US 1-off.

---

## 1. All-in unit cost

| Line | Per unit | Annual 5k | % MSRP |
|------|----------|-----------|--------|
| Sourced parts (below) | **$2,889** | $14,445,000 | 41.3% |
| Contract assembly & QA | **$500** | $2,500,000 | 7.1% |
| **All-in COGS** | **$3,389** | **$16,945,000** | **48.4%** |
| MSRP | $6,999 | $34,995,000 | 100% |
| **Gross margin** | **$3,610** | **$18,050,000** | **51.6%** |

---

## 2. Parts roll-up @ 5,000

| Category | Spec | Unit $ | Annual $ |
| :--- | :--- | ---: | ---: |
| Folding frame | Kalosse carbon steel · 9.2 lb · 190 mm · **rear shock in** | **375** | 1,875,000 |
| Battery module | ~8.5 kWh · ~63 V · ~60 lb · NMC+ · BT BMS · dual QS8 | **1,200** | 6,000,000 |
| Hub motor | QS205 V3 50H 3T · 20×4.0 · 190 mm | 255 | 1,275,000 |
| Controller | FarDriver ND72360 BT · factory lot | **150** | 750,000 |
| Front end | HIMALO 135 mm, ZS44, stem, 20×4.0 wheel, tire, disc | 150 | 750,000 |
| Rear hub install | Tire, 6×44 rotor, left caliper, M16 arms, phase/Hall | 70 | 350,000 |
| Deck / seat / hardware | 6061 deck+rails+legs, café pan, Grade 8, straps | 108 | 540,000 |
| HV pack interface | Dock, interlock, cam lock, 200 A fuse, precharge, QS8 | 62 | 310,000 |
| CCS1 stack | Inlet+Küster, EVCC, IMD, contactors, 6–8 kW DC–DC, 12 V | 430 | 2,150,000 |
| Controls / wireless / dash | Signals, brake, headlamp, BLE IGN, throttle, mount, screen | 64 | 320,000 |
| Crate / pack-out | Export crate, foam, labels | 25 | 125,000 |
| **Parts subtotal** | | **2,889** | **14,445,000** |
| **Assembly** | Consigned-kit labor + in-line QA | **500** | **2,500,000** |
| **All-in** | | **3,389** | **16,945,000** |

---

## 3. Line items

### A. Chassis (shock included)
| # | Part | Lot $ |
|---|------|------:|
| A1 | Kalosse folder, 9.2 lb, 190 mm, 44 mm HT, **rear shock in the frame kit** | **375** |

### B. Energy
| # | Part | Lot $ |
|---|------|------:|
| B1 | Semi-solid NMC+ ~8.5 kWh / ~63 V / ~60 lb, enclosure, BT BMS, two QS8 | **1,200** |

### C. Powertrain
| # | Part | Lot $ |
|---|------|------:|
| C1 | QS205 V3 50H 3T 20×4.0 190 mm (Alibaba ~$339 1-set → 5k) | 255 |
| C2 | FarDriver ND72360 BT — factory **$138–$158**; 5k modeled **$150** (1-off paid $199) | **150** |

### D. Front end
| # | Part | Lot $ |
|---|------|------:|
| D1 | HIMALO 20×4.0, 135 mm, 1-1/8″ | 42 |
| D2 | ZS44/28.6 headset + race + star nut + cap + spacers | 16 |
| D3 | Stem 28.6 → 31.8 | 5 |
| D4 | Bars + grips | 8 |
| D5 | Front wheel 20×4.0, 9×135, 6-bolt | 40 |
| D6 | Front 20×4.0 tire + tube | 16 |
| D7 | Front disc + caliper | 23 |
| | **Front** | **150** |

### E. Rear hub
| # | Part | Lot $ |
|---|------|------:|
| E1 | Rear 20×4.0 tire + tube | 14 |
| E2 | 6×44 rotor + left caliper/lever | 32 |
| E3 | M16 torque arms pair | 12 |
| E4 | Phase / Hall IP65 | 12 |
| | **Rear** | **70** |

### F. Deck / seat
| # | Part | Lot $ |
|---|------|------:|
| F1 | 6061 deck, rails, 1×1 legs, gussets | 60 |
| F2 | Stay clamps + Grade 8 | 14 |
| F3 | Café pan + isolators | 26 |
| F4 | Straps, mat, P-clamps | 8 |
| | **Deck** | **108** |

### G. HV interface
| # | Part | Lot $ |
|---|------|------:|
| G1 | Blind-mate / SB175 dock ≥150 A | 16 |
| G2 | D4N fully-seated interlock | 6 |
| G3 | Over-center lock | 8 |
| G4 | 200 A fuse + 50 W precharge + relay | 18 |
| G5 | QS8 leads to FarDriver | 14 |
| | **HV** | **62** |

### H. CCS1
| # | Part | Lot $ |
|---|------|------:|
| H1 | Inlet EV-T1GBIE12 class + Küster 03S | 45 |
| H2 | EVCC DIN 70121 / ISO 15118 (China lot) | 65 |
| H3 | IMD | 25 |
| H4 | HV contactors ×2 | 50 |
| H5 | IVT / current sensor | 20 |
| H6 | Isolated DC–DC HV → ~63 V, 6–8 kW | 200 |
| H7 | 12 V aux DC–DC | 12 |
| H8 | HV cable, PE | 13 |
| | **CCS** | **430** |

### I. Controls
| # | Part | Lot $ |
|---|------|------:|
| I1 | Wireless turn signals IP65 | 14 |
| I2 | Wireless brake lamp | 8 |
| I3 | Headlamp | 12 |
| I4 | ESP32 BLE ignition relay | 6 |
| I5 | Hall throttle + kill | 12 |
| I6 | Magnetic phone mount + ring | 5 |
| I7 | Detachable windscreen | 7 |
| | **Controls** | **64** |

### J. Pack-out
| # | Part | Lot $ |
|---|------|------:|
| J1 | Export crate | 25 |

**Parts $2,889 + assembly $500 = all-in $3,389.**

---

## 4. Still out of this number

Kickstand · Statorade/hubsinks · SN65HVD230 · home CCS1 / 63 V brick · Tesla adapter · phone/app · horn/mirrors/plate.

Rear shock is **in A1**. Dual-source frames if $375 does not hold at 5k. Pack is the swing line at **$1,200**.
