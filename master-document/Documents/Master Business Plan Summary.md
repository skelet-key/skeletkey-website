# MASTER BUSINESS PLAN EXECUTIVE SUMMARY
## Project: Puca — folding electric motorcycle
## Target output: 5,000 units / year (run rate ~20 units/day)
## Model: Source frames & parts · contract assemblers only
## MSRP: $6,999
## Updated: 2026-08-21

**Canonical production story:** [Production and Sourcing Model.md](Production%20and%20Sourcing%20Model.md)

---

### 1. VENTURE ARCHITECTURE

SkeletKey is an **asset-light** mobility brand. We own design, BOM, software, and supplier relationships. We **do not** build frames in our own factory.

* **Sourcing:** Folding chassis, hub motors, controllers, battery modules, CCS hardware, wheels, and controls are **purchased**. Prototype frame is a sourced **9.2 lb carbon steel** folder (**190 mm** dropout). Motor on hand: **QS205 V3 50H 3T, 28.6 lb**. Controller on hand: **FarDriver ND72360 BT**.
* **Assembly:** Contract assemblers receive **consigned kits** and are paid for labor, line time, and QA — **not** a parts markup (target **~$500/unit**).
* **Scale:** 5,000 finished motorcycles per year is an **assembly + logistics** rate, not a mill/weld-shop rate.
* **Structure:** Folding **frame is sourced complete**. 6061 is used for **battery deck / slide rails / enclosure**, bolted to the steel frame.

### 2. QUALITY FIREWALL (ASSEMBLER + IQC)

* **Layer 1 — Incoming:** Inspect **sourced** frames (dropout width, headset, fold latch, cracks, mass) and all powertrain lots before they enter the line. We do not re-weld OEM frames as the production plan.
* **Layer 2 — Line:** Dielectric / hipot on HV, BMS/FarDriver flash, slide-in pack lock and polarity check, CCS interlock (when fitted).
* **Layer 3 — EOL:** Short dyno or roller test (speed/current/temp), lights/brakes/fold, water-spray on sealed joints. IP65 electrical target.

### 3. UNIT ECONOMICS (5,000 UNITS)

| Financial metric | Per unit | Annualized (5,000) | % of MSRP |
| :--- | :--- | :--- | :--- |
| **MSRP** | $6,999 | $34,995,000 | 100% |
| **Sourced BOM** | $2,942 | $14,710,000 | 42.0% |
| **Contract assembly & QA labor** | $500 | $2,500,000 | 7.1% |
| **All-in COGS** | **$3,442** | **$17,210,000** | **49.2%** |
| **Gross margin** | **$3,557** | **$17,785,000** | **50.8%** |

BOM is **bought parts**, not in-house extrusions.

### 4. NRE / FIXTURES (NOT FRAME DIES)

* CapEx is **assembly jigs, incoming gauges, hipot, short dyno, spray booth** — not $300k extrusion dies.
* Order-of-magnitude **~$160k** NRE amortized over Year 1 volume (~$32/unit), then drops off.
* Inventory lines collateralized on **parts and finished goods**, omitting personal guarantees.

### 5. PRODUCT (LOCKED DIRECTION)

| | |
|--|--|
| Name | Puca by SkeletKey |
| Frame | Sourced carbon steel folder · 9.2 lb measured |
| Motor | QS205 V3 50 3T · 28.6 lb · 5 kW / 12 kW peak · 70 mph class |
| Pack | ~8.5 kWh · 63 V nominal · ~60 lb · semi-solid NMC+ · slide-in · dual QS8 |
| Charge | CCS1 6–8 kW (inlet on hand) + home 120/240 V brick |
| Ride UI | Phone dash (Puca app) + FarDriver tune app |
