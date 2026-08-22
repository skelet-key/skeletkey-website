# PARTS INVENTORY CHECKLIST
## Document Reference: PIC-2026-V1
## Classification: Internal · Shareable with cofounder
## Updated: 2026-08-22

Status key: **HAVE** = on hand · **ON THE WAY** = ordered / shipping · **NEED** = still to buy or fabricate

**Production model:** SkeletKey **sources frames and all major parts** and uses **contract assemblers** to reach **5,000 units/year**. This checklist is the prototype kit, then the scale BOM. See **Production and Sourcing Model.md**.

---

## 1. HAVE (on hand)

| # | Item | Specs / notes | Source / ID |
|---|------|----------------|-------------|
| 1 | **Hub motor** | **20×4.0 QS205 50H · 190 mm dropout · 3T** · received 2026-08-20 | QS205 V3 (50H) 3T |
| 2 | **Controller** | **FarDriver ND72360 with Bluetooth** · received | https://econiccycles.com/products/fardriver-sinewave-controller-nd72360-w-bluetooth?variant=46851442835698 |
| 3 | **CCS1 vehicle inlet** | **EV-T1GBIE12-1ACDC80A200A2-DM** (DESAYSV class) · **80 A 250 V AC / 200 A 850 V DC** · cables & pinouts included | On hand; see CCS1 architecture doc |
| 4 | **CCS lock / actuator** | **KÜSTER 03S · 0188793** + signal harness | On hand with inlet assembly |
| 5 | **Front fork** | **HIMALO** 20×4.0 · **135 mm** · 1-1/8″ straight · lockout (chosen / ordered) | https://www.amazon.com/HIMALO-Suspension-Travel-Straight-Lockout/dp/B0D6G83TFY |

---

## 2. IN TRANSIT / ON THE WAY

| # | Item | Specs / notes | Source |
|---|------|----------------|--------|
| 1 | **Folding frame** | Full-suspension **carbon steel** · **9.2 lb** · **190 mm rear dropout** · **44 mm** headset class · front **~135 mm** assumed · stay tabs for deck · **source 1 for 5k/year** | https://www.aliexpress.us/item/3256808448955861.html?spm=a2g0o.order_list.order_list_main.5.23811802Vm2a2e&gatewayAdapt=glo2usa |
| 1b | **Folding frame source 2** | Dual-source: same Kalosse foldable 20×4.0 / 190 mm family, **different listing**. Tape against source 1 before volume. Factory RFQ: Jinhua Epower (confirm fold + steel). Backup OEM: Hebei Xiaotianhang. | https://www.aliexpress.com/item/1005012630592144.html · https://www.alibaba.com/product-detail/KALOSSE-Electric-Mountain-Cyclocross-Snow-Bike_1601687149121.html · https://hbxiaotianhang.en.alibaba.com/ |
| 2 | **Battery pack** | **ON THE WAY** · **19–20″ × ~6.5″ × 4.5–5″** · **~60 lb** with enclosure/BMS/cables · **~8.5 kWh** · **~63 V** · 8 kW discharge · 6–8 kW charge · Bluetooth BMS · **two QS8** (bottom + side) · semi-solid NMC+ | Pack OEM inbound |

*On frame arrival: verify dropout, headset ID, mass, tabs. Pack is inbound — bike-side rails/contacts still NEED (see Action Item Tracker §7).*

---

## 3. NEED — Powertrain & rolling chassis

| # | Item | Spec / notes | Status |
|---|------|--------------|--------|
| 1 | M16 torque arms (pair) | QS205 axle anti-rotate | NEED |
| 2 | 6-bolt disc rotor | PCD **6×44 mm** · 180 or 203 mm | NEED |
| 3 | Rear disc caliper + lever | Left-side clearance with motor cables | NEED |
| 4 | Front wheel **20×4.0** | Match fork dropout (confirm **135 mm** QR when frame arrives) | NEED |
| 5 | Front fork + stem + headset | 1-1/8″ straight steerer · **ZS44** class if 44 mm head tube | NEED |
| 6 | Front brake | Lightweight disc preferred | NEED |
| 7 | Handlebars / grips | See TX/RX in §3.1 | NEED |
| 8 | Phase / Hall extensions | Waterproof; clear of left disc | NEED |
| 9 | Main pack fuse / precharge as required | Sized for **8 kW** class discharge | NEED |
| 10 | Statorade (optional thermal) | Sustained high speed on 3T @ ~63 V | NEED optional |

### 3.1 NEED — FarDriver fold radio (TX / RX)

Controller **HAVE**. Buy the waterproof transmitter/receiver pair. Full pin map: **Action Item Tracker.md §6**.

| # | Item | Compatible with ND72360 because | Buy |
|---|------|--------------------------------|-----|
| 1 | **eletechsup RTTXA08 + RTRXB08 with shell** | Enclosed 8DI TX + 8-relay RX. Order **both**. Not a keyfob. | https://eletechsup.com/products/8ch-433m-dc-12v-lora-bidirectional-remote-io-controller-led-feedback-indicator-npn-in-relay-out-swicth-module-board · https://www.aliexpress.com/item/1005006919833785.html |
| 1b | 4CH LoRa I/O ×2 if cheaper | Same idea, 4+4, shelled | https://www.aliexpress.com/item/1005005219805622.html |
| 2 | **Falcon PEV wireless throttle** (hall TX + RX) | RX plugs into FarDriver throttle 3-pin (red +5 / black GND / green signal). Not a digital relay. | https://www.falconpev.com.sg/products/wireless-throttle-for-e-scooter-e-bike |
| 3 | Numbered **GX16 8-pin** pigtails + IP67 boxes | Same pin numbers on TX and RX | https://www.amazon.com/s?k=GX16+8+pin+aviation+connector+pair · https://www.amazon.com/s?k=IP67+project+box+waterproof+electronics |
| 4 | Battery level | **Not a fold-radio channel.** FarDriver BT (V/A/temp) + pack Bluetooth BMS (SOC). | FarDriver app · BMS vendor app · Puca `/app/` |

---

## 4. ON THE WAY — Battery module (pack inbound; bike-side still NEED)

### 4.1 Pack specification (production target)

| Parameter | Target |
|-----------|--------|
| Envelope | **19″–20″ L × ~6.5″ W × 4.5″–5″ H** |
| Mass | **~60 lb** including enclosure, BMS, and cables |
| Energy | **~8.5 kWh** |
| Voltage | **~63 V** nominal class (align BMS / FarDriver 48–72 V) |
| Discharge | Up to **8,000 W** |
| Charge | **6,000–8,000 W** |
| Discharge connectors | **Two QS8** — one on **bottom**, one on **side** |
| Architecture | Modular slide-in / lock-in; removable for travel & apartment storage |

### 4.2 Enclosure + slide-in ± contact system (NEED — materials & parts)

Goal: pack slides between thin structural rails (e.g. aluminum between seat and rear carriage); **positive and negative** make up automatically on full insertion; mechanical lock prevents pull-out under load.

| Category | Recommended parts / materials / specs |
|----------|--------------------------------------|
| **Enclosure shell** | 6061-T6 or equivalent aluminum (or FR-rated composite); target thickness to hit **~60 lb** total with cells/BMS; internal cell tray + foam/epoxy isolation; IP65 path (gaskets, sealed lids) |
| **Slide rails (vehicle side)** | Two thin **6061-T6** guide plates / channels fixed to rear deck or stays; length ≥ pack length; lead-in chamfer; dielectric barriers so only intended contacts mate |
| **Slide features (pack side)** | Matching UHMW / nylon wear strips or aluminum runners; stop face at full insertion |
| **Power contacts (+ / −)** | High-current **blind-mate** or spring-finger bus contacts rated **≥150 A continuous** (prefer **200 A+** margin for 8 kW @ ~63 V); silver- or nickel-plated copper; wipe action on insertion |
| **Contact mounting** | Fixed contacts on vehicle harness side; floating or compliant contacts on pack (or reverse); float **±1–2 mm** for tolerance |
| **QS8 outlets on pack** | **Two QS8** discharge ports — **bottom** + **side** — for deck vs side harness routing; caps when unused |
| **Interlock / sense** | Pilot/sense pins or microswitch “fully seated” so controller/BMS enable only when locked |
| **Mechanical lock** | Cam latch, over-center latch, or pin lock; tool-free for travel; secondary strap optional |
| **BMS & wiring space** | Compartment for Bluetooth BMS, contactors/fuse if onboard, balance leads protected from vibration |
| **Thermal** | Vent or heat-spreader path; no blocked QS8 or slide contacts |
| **Labels** | Voltage, polarity, max A, QS8 pinout, “remove for air travel / ship separately” if applicable |

**Fabrication notes:** Keep contact faces clean and dry; design so +/− cannot reverse-mate; PE/chassis bond separate from power; service access to BMS without destroying enclosure.

---

## 5. NEED — CCS1 public charging stack  
*(under inlet **EV-T1GBIE12-1ACDC80A200A2-DM** — already HAVE)*

Inlet + cables + Küster lock are **on hand**. Remaining stack for **6–8 kW** into the **~63 V** pack:

| # | Item | Role | Buy / reference links |
|---|------|------|------------------------|
| 1 | **EVCC** (vehicle CCS controller) | DIN 70121 / ISO 15118 PLC on CP; PP; lock; contactor drive; CAN to BMS | https://store.advantics.fr/charge-controllers/24-ev-charge-controller-ccs.html · https://www.evcreate.com/ccs-fast-charging-solution/ |
| 2 | **IMD** (isolation monitor) | Ground-fault watch on HV bus before contactors close | https://www.benderinc.com/products/ground-fault-monitoring-ungrounded/isometer-iso165c-iso165c-1/ |
| 3 | **HV main contactors ×2** | DC+ and DC− isolation from inlet | https://www.mouser.com/new/sensata/gigavac-gv200-dc-contactors/ · https://www.mouser.com/ProductDetail/GIGAVAC/GV200QA-1 |
| 4 | **Precharge contactor + resistor** | Soft-start HV bus into DC–DC input capacitance | TE / Gigavac small HV relay + power resistor |
| 5 | **HV fuses** | Both poles, DC-rated | Match contactor/DC–DC current |
| 6 | **IVT-S or equiv. current/voltage sensor** | CAN feedback for EVCC / BMS | https://www.digikey.com/en/product-highlight/i/isabellenhuette/ivt-s-current-voltage-and-temperature-sensors |
| 7 | **Isolated DC–DC** | **CCS HV in (~200–500+ V) → ~60–72 V out**, **6–8 kW** class, current-limited by BMS | Bring-up: https://www.powerstream.com/high-voltage-input-48V-and-72V--battery-chargers.htm · Production: custom ~8 kW quote |
| 8 | **12 V aux DC–DC** | EVCC, lock, contactor coils | https://www.powerstream.com/pbcd-7212-charger.htm |
| 9 | HV cable, PE bond, strain relief, interlock wiring | Vehicle harness from inlet → contactors → DC–DC → BMS charge input | NEED fab |

**Hard rule:** Never land inlet **DC+ / DC−** on the cells. Path is always:

`CCS1 inlet → fuses → precharge/main contactors → DC–DC → BMS charge port → pack`

Full wiring map: **CCS1 Public Charging Architecture.md**

---

## 6. NEED — Battery deck / seat / structure

| # | Item | Notes | Status |
|---|------|--------|--------|
| 1 | 6061 deck ~20″ × 8″ | Bolt to stay tabs; supports **~60 lb** pack | NEED |
| 2 | Slide rails / thin aluminum guides | Mate to pack enclosure contacts | NEED |
| 3 | Café-racer solo seat + isolators | Above pack; not seatpost | NEED |
| 4 | Cam straps / non-slip / P-clamps | Hold-down and cable management | NEED |
| 5 | Grade 8 hardware | Deck to steel frame — bolt only, no weld Al→steel | NEED |

---

## 7. SUMMARY COUNTS

| Status | Count (line items) |
|--------|---------------------|
| **HAVE** | Motor, FarDriver, CCS inlet, Küster lock, HIMALO fork (chosen) |
| **ON THE WAY** | Folding frame (AliExpress) + **~60 lb pack** |
| **NEED** | Headset/stem/front wheel, rear torque/disc, **load-bearing rack + supports**, café seat, **8CH TX/RX + analog throttle radio**, pack slide contacts, CCS electronics |

---

## 8. RELATED DOCUMENTS

| Doc | Use |
|-----|-----|
| **Action Item Tracker.md** | Categorized buy list with links |
| **Build Decisions and Shopping List.md** | Locked architecture |
| **CCS1 Public Charging Architecture.md** | Detailed CCS1 wiring & safety |
| **Technical Fact Sheet.md** | Spec summary for partners |
| **Puca Schematics and Design Plan.md.txt** | Engineering blueprint |

---

*Update this checklist when the frame arrives (measure dropouts, headset, mass) and when pack enclosure drawings are frozen.*
