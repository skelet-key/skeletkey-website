# CCS1 PUBLIC CHARGING ARCHITECTURE
## Document Reference: CCS1-2026-V1
## Classification: Internal · Engineering baseline
## Updated: 2026-08-21

---

## 1. PURPOSE

Define how the **~63 V / ~8.5 kWh / ~60 lb** modular semi-solid **NMC+** pack charges from **public CCS1 (Combo 1) DC fast stations** in North America at **6–8 kW**.

**Scope:** CCS1 **only** (not Level 2 J1772 AC as the primary public path).

**Inventory cross-ref:** **Parts Inventory Checklist.md** §5 lists remaining CCS1 purchases under this inlet.

---

## 2. HARDWARE ALREADY ON HAND (CCS1 inlet group)

| Item | Identification | Role |
|------|----------------|------|
| **Vehicle inlet** | **EV-T1GBIE12-1ACDC80A200A2-DM** (DESAYSV / Type‑1 CCS class) | CCS1 vehicle inlet |
| Ratings | **80 A 250 V AC** · **200 A 850 V DC** | Physical plug + HV leads |
| Cables / pinouts | **Included** with inlet assembly | Ready for EVCC harness mapping |
| **Lock / actuator** | **KÜSTER 03S** · **0188793** + multi-color signal harness | Plug lock / lid actuator |

The inlet and lock are the **plug and latch only**. They do **not** charge the pack by themselves. All other CCS1 stack items are **NEED** (EVCC, IMD, contactors, DC–DC, 12 V aux, fuses, sense).

---

## 3. CRITICAL CONSTRAINT (~63 V-CLASS PACK)

| CCS1 station | Puca pack |
|--------------|-----------|
| Typically **~200–1000 V DC** | Charge window **~60–72 V** (~63 V nominal class) |
| PLC session (DIN 70121 / ISO 15118) | BMS must request V/A limits |
| Isolation-monitored HV bus | **Never** land station DC+ / DC− on cells |

**Implication:** Inlet **DC+ / DC− must not** connect directly to the 8.5 kWh module. A full **CCS vehicle stack + HV→60–72 V DC–DC** is required.

Target charge power: **6,000–8,000 W** (subject to BMS, thermal limits, and DC–DC capability). At ~63 V that is on the order of **~95–130 A** into the pack.

---

## 4. SYSTEM BLOCK DIAGRAM

```
Public CCS1 station
        │
        ▼
┌───────────────────┐
│  CCS1 INLET       │  (Desay — on hand)
│  DC+  DC−  PE     │
│  CP   PP          │
│  + lock (Küster)  │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    │   EVCC    │  PLC on CP · lock · contactors · CAN ↔ BMS
    └─────┬─────┘
          │
   IMD monitors HV bus vs chassis
          │
    ┌─────▼─────┐
    │ PRECHARGE │  small contactor + resistor
    │ then MAIN │  2× HV contactors (DC+ and DC−)
    └─────┬─────┘
          │  Station bus (~200–500+ V DC typical)
          ▼
    ┌─────────────┐
    │  DC–DC      │  HV in → ~60–72 V out, current-limited
    └─────┬───────┘
          │
    ┌─────▼─────┐
    │ BMS charge│  enable / max V / max A
    └─────┬─────┘
          ▼
     8.5 kWh / ~60 lb NMC+ module
```

---

## 5. PARTS STILL REQUIRED

### 5.1 CCS vehicle charge controller (EVCC)

- DIN 70121 / ISO 15118 PLC on **CP**
- **PP** present / rating
- Lock actuator drive
- Contactor coil outputs
- **CAN** to BMS (and optional current sensor)

| Source | URL |
|--------|-----|
| Advantics EVCC | https://store.advantics.fr/charge-controllers/24-ev-charge-controller-ccs.html |
| EVcreate CCS solution | https://www.evcreate.com/ccs-fast-charging-solution/ |
| EVcreate performance kit | https://www.evcreate.com/shop/charging/ccs-fast-charging-kit-performance/ |
| Phoenix Contact CHARX vehicle | https://www.phoenixcontact.com/de-de/produkte/ladetechnik-fuer-die-elektromobilitaet/fahrzeug-ladesteuerungen |

**Note:** Confirm **CCS1** (not only CCS2) support with the vendor before order.

### 5.2 Isolation monitoring device (IMD)

| Source | URL |
|--------|-----|
| Bender iso175 / IR155 family | https://www.benderinc.com/products/ground-fault-monitoring-ungrounded/isometer-iso165c-iso165c-1/ |
| Bender IR155-4203 overview | https://www.bender-uk.com/products/insulation-monitoring/isometer-ir155-4203-ir155-4204/ |

### 5.3 HV contactors + precharge

| Source | URL |
|--------|-----|
| Gigavac GV200 series (Mouser) | https://www.mouser.com/new/sensata/gigavac-gv200-dc-contactors/ |
| Example GV200QA-1 | https://www.mouser.com/ProductDetail/GIGAVAC/GV200QA-1 |
| DigiKey GV series | https://www.digikey.com/en/product-highlight/s/sensata-gigavac/gv-series-sealed-contactors |
| TE HV / precharge relays | https://www.te.com/en/products/relays-and-contactors/electromechanical-relays/automotive-relays/high-voltage-automotive-relays.html |

Buy **2× main** contactors (DC+ and DC−) + **1× precharge** contactor + power **precharge resistor** sized to DC–DC input capacitance.

### 5.4 Current / voltage sense

| Source | URL |
|--------|-----|
| Isabellenhütte IVT-S (DigiKey) | https://www.digikey.com/en/product-highlight/i/isabellenhuette/ivt-s-current-voltage-and-temperature-sensors |
| IVT-S kits with harness | https://www.digikey.com/en/product-highlight/i/isabellenhuette/current-sensor-kits |

### 5.5 HV → pack DC stage (mandatory for 60 V)

| Approach | URL | Notes |
|----------|-----|--------|
| PowerStream HV-input → 72 V | https://www.powerstream.com/high-voltage-input-48V-and-72V--battery-chargers.htm | Off-the-shelf; typically **~1–1.5 kW** class |
| DWE 400 V → 72 V 800 W | https://www.dwe-oss.eu/product/400v-to-72v-dc-dc-converter-800w/ | Lower-power block |
| Custom ~8 kW isolated DC–DC | Quote OEM (e.g. Dilong-class / EV power vendors) | Required for full **8 kW** production goal |

### 5.6 12 V control power

| Source | URL |
|--------|-----|
| Pack → 12 V aux DC–DC (example) | https://www.powerstream.com/pbcd-7212-charger.htm |

Powers EVCC, Küster lock, contactor coils, status.

---

## 6. WIRING MAP (ONE PAGE)

### 6.1 Inlet pins

| Inlet | Destination |
|-------|-------------|
| **DC+** | Fuse → main contactor → DC–DC **HV+** |
| **DC−** | Fuse → main contactor → DC–DC **HV−** |
| **PE** | Chassis ground (continuous, solid) |
| **CP** | EVCC CP (PLC + PWM) |
| **PP** | EVCC PP |
| Lock motor | EVCC lock outputs (12 V domain) |
| Temp (if present) | EVCC / ECU |

### 6.2 Power path detail

```
Inlet DC+ ──► [HV FUSE] ──► [MAIN+] ──┬──► DC–DC HV+
                                       │
Inlet DC− ──► [HV FUSE] ──► [MAIN−] ──┴──► DC–DC HV−

Precharge (typical):
  DC+ ── [PRECHARGE CONTACTOR] ── [RESISTOR] ──► DC–DC HV+
```

DC–DC **output** → BMS **charge input only** → cells.

### 6.3 Safety interlock chain (all required before main close)

1. PP = plug present  
2. CP session OK (EVCC)  
3. **IMD OK**  
4. Lock closed / feedback OK  
5. BMS charge enable  
6. Precharge complete  
7. Close **main** contactors  

### 6.4 12 V domain

```
Pack ── (small isolated DC–DC) ──► 12 V bus
  ├── EVCC
  ├── Küster lock
  ├── Contactor coils
  └── Fans / LEDs
```

### 6.5 Wire rules

- HV: marked cable, correct gauge for current, short runs, strain relief at inlet  
- PE: bonded inlet PE to frame; do not rely on signal ground alone  
- CAN: twisted pair, 120 Ω termination  
- CP/PP: separated from HV where practical  

---

## 7. BRING-UP SEQUENCE

1. **12 V only** — EVCC boots, lock cycles, no HV  
2. **IMD** self-test on isolated bus  
3. Contactor click test (no station)  
4. DC–DC on bench supply into dummy load / BMS  
5. Full chain on a **known** CCS1 tester or controlled station at **low current**  
6. Raise power toward **~6–8 kW** only after thermal and BMS limits verified  

---

## 8. WHAT NOT TO DO

- Connect inlet **DC+ / DC−** straight to the battery module  
- Expect every public CCS stall to negotiate **~60 V** without a DC–DC  
- Skip IMD or contactor interlocks  
- Exceed BMS max charge current or voltage  

---

## 9. RELATIONSHIP TO OTHER MASTER DOCS

| Document | Relationship |
|----------|----------------|
| **Technical Fact Sheet** | Pack **8 kW** charge rating; 60.8 V nominal |
| **Build Decisions and Shopping List** | Locked battery decision; this doc owns CCS1 BOM links |
| **Puca Schematics and Design Plan** | Powertrain envelope; CCS1 is additive public-charge path |

---

## 10. OPEN ITEMS

- [ ] Confirm BMS charge connector pinout and max charge A/V  
- [ ] Confirm Desay inlet pinout vs EVCC harness (CCS1)  
- [ ] Select EVCC with explicit **CCS1** support  
- [ ] Quote **~8 kW** isolated HV→60–72 V DC–DC (or staged 1.5 kW bring-up + scale)  
- [ ] Size precharge resistor from chosen DC–DC input capacitance  
- [ ] Station compatibility test list (Electrify America, EVgo, etc.)  

---

*Document owner: SkeletKey engineering. Update when EVCC / DC–DC are purchased and pinouts verified.*
