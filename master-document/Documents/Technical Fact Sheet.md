# TECHNICAL FACT SHEET: FOLDING ELECTRIC MOTORCYCLE CHASSIS & POWERTRAIN
## Document Reference: TFS-2026-V1
## Classification: Technical Appendix / Factory Briefing

---

**Measured hardware (current build):** Folding frame = **9.2 lb carbon steel**. Hub motor = **28.6 lb** (QS205 class). Update all mass and material claims from these measured values.

### 1. CORE CHASSIS STRUCTURAL METRICS
* **Material Specification**: Carbon steel folding frame (measured **9.2 lb** on current build).
* **Rear dropout**: **190 mm** (matches QS205 190 mm motor).
* **Welding Protocol**: MIG/TIG welding with steel-appropriate filler (e.g. ER70S-series class for mild/carbon steel) to maintain joint strength at fold and dropout interfaces.
* **Post-Weld Process**: Stress-relief / inspection of heat-affected zones at hinge and dropout junctions as required by the fabricator’s procedure.
* **Folding Mechanism Tolerance**: High-precision hinge interfaces machined to a geometric tolerance of +/- 0.05mm to prevent axial play during high-torque loading.
* **Rear pack / seat**: Modular **57 lb** battery on custom **6061 aluminum deck** bolted to stay tabs; **café-racer seat** mounted above the pack (no primary seatpost seat).

### 2. ELECTRICAL POWERTRAIN SPECIFICATIONS
* **Battery Architecture**: 16S2P Configuration Layout utilizing advanced semi-solid NMC+ Lithium-Ion pouch cells.
* **Nominal Pack Voltage**: 60.8V Nominal (16S2P continuous operating architecture).
* **Module Weight**: 57 lb battery module (~19″ × 6″ × 5″ envelope).
* **Usable Energy**: Approximately 8.5 kWh.
* **Battery Management System (BMS)**: Integrated active-balancing BMS with **Bluetooth app control** for live SOC, cell health, fault codes, and charge/discharge limits.
* **Charge Power**: Up to **8,000 watts** supported charge rate (subject to pack thermal limits and BMS app settings).
* **Motor**: QS205 V3 (50H) Spoke Hub Motor, **190 mm dropout**, **3T** winding
  - Continuous power: 4,000–5,000W
  - Peak power: ~10,000–12,000W class
  - Weight: **28.6 lb** (measured)
  - Disc brake, PCD 6×44 mm; dual Hall + KTY83 thermal probe; IP65
* **Controller**: **FarDriver ND72360 with Bluetooth** (48–72 V). Official FarDriver app for tuning and controller telemetry.
* **Dash**: **SkeletKey Puca app** (`/app/`) — GPS speedometer, trip computer, software ignition interlock, optional Maps.
* **Current Draw Protection**: Controller and BMS current limits; high-discharge cells required for sustained high speed on 60 V-class packs.

### 3. MANDATORY MANUFACTURING QUALITY CRITERIA
* **Layer 1 (Structural Isolation)**: 100% Non-Destructive Testing (NDT) on primary chassis joins. Automated Ultrasonic Testing (UT) wave reflection thresholds calibrated to carbon steel frame join profiles.
* **Layer 2 (Powertrain Isolation)**: Automated dielectric isolation and high-voltage insulation tests on 100% of finished wiring harnesses and sealed battery trays before frame integration.
* **Layer 3 (End-of-Line Validation)**: Mandatory 10-minute automated dynamometer track simulation under load coupled with a high-pressure environmental water spray test to verify IP67 ingress ratings.

---
