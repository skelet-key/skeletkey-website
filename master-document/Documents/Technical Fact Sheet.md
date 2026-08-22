# TECHNICAL FACT SHEET: PUCA CHASSIS & POWERTRAIN
## Document Reference: TFS-2026-V2
## Classification: Technical appendix / assembler briefing
## Updated: 2026-08-21

SkeletKey **sources** the folding frame and powertrain. This sheet is for **incoming spec + assembly**, not for operating a frame mill.

---

### 1. CHASSIS (SOURCED)

* **Frame:** Purchased carbon steel folding chassis. Measured **9.2 lb** on current build.
* **Rear dropout:** **190 mm** (QS205).
* **Headset:** **44 mm** class (confirm on inbound frame).
* **We do not weld production frames.** IQC only (dropout, latch, cracks, mass, tabs).
* **Rear pack / seat:** Modular **~60 lb** battery on custom **6061** deck **bolted** to stay tabs; café-racer seat above pack (**no seatpost seat**). TIG the aluminum sub-assembly separately — never weld Al to the steel frame.

### 2. POWERTRAIN

* **Pack:** Semi-solid **NMC+** · **~8.5 kWh** · **63 V nominal** · **~60 lb** with enclosure/BMS/cables · Bluetooth BMS · **6–8 kW** charge · **8 kW** discharge · **two QS8** (bottom + side) · slide-in lock with ± contacts.
* **Motor:** **QS205 V3 (50H) 3T** spoke hub · 20×4.0 · **28.6 lb** measured · 4–5 kW continuous / ~10–12 kW peak · disc, PCD 6×44 · dual Hall + KTY83 · IP65 · **HAVE**.
* **Controller:** **FarDriver ND72360 Bluetooth** (48–72 V) · **HAVE**.
* **Dash:** SkeletKey Puca app (`/app/`) — GPS speedo, trip, software ignition. FarDriver app for tuning.
* **Public charge:** **CCS1** only as the DC path; inlet **EV-T1GBIE12-1ACDC80A200A2-DM** + Küster lock **HAVE**. HV from station **must** go through EVCC + contactors + DC–DC; never onto cells.

### 3. ASSEMBLY QA (NOT FRAME FAB)

* **Layer 1:** IQC sourced frame and lots (see QA Strategy.md).
* **Layer 2:** Hipot, pack lock/polarity, controller flash.
* **Layer 3:** Short dyno/roll, fold clearance, spray on electrical seals (IP65 target).

### 4. RATE

Assemblers, not a SkeletKey factory, deliver **5,000 units/year** from consigned kits. See **Production and Sourcing Model.md**.
