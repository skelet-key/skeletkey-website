# TECHNICAL FACT SHEET: FOLDING ELECTRIC MOTORCYCLE CHASSIS & POWERTRAIN
## Document Reference: TFS-2026-V1
## Classification: Technical Appendix / Factory Briefing

---

**Measured hardware (current build):** Folding frame = **9.2 lb carbon steel**. Hub motor = **28.6 lb** (QS205 class). Update all mass and material claims from these measured values.

### 1. CORE CHASSIS STRUCTURAL METRICS
* **Material Specification**: Carbon steel folding frame (measured **9.2 lb** on current build).
* **Welding Protocol**: MIG/TIG welding with steel-appropriate filler (e.g. ER70S-series class for mild/carbon steel) to maintain joint strength at fold and dropout interfaces.
* **Post-Weld Process**: Stress-relief / inspection of heat-affected zones at hinge and dropout junctions as required by the fabricator’s procedure.
* **Folding Mechanism Tolerance**: High-precision hinge interfaces machined to a geometric tolerance of +/- 0.05mm to prevent axial play during high-torque loading.

### 2. ELECTRICAL POWERTRAIN SPECIFICATIONS
* **Battery Architecture**: 16S2P Configuration Layout utilizing advanced semi-solid NMC+ Lithium-Ion pouch cells.
* **Nominal Pack Voltage**: 60.8V Nominal (16S2P continuous operating architecture).
* **Module Weight**: 57 lb battery module.
* **Usable Energy**: Approximately 8.5 kWh.
* **Battery Management System (BMS)**: Integrated active-balancing BMS with **Bluetooth app control** for live SOC, cell health, fault codes, and charge/discharge limits; isolated CAN-bus communication infrastructure retained for vehicle systems.
* **Charge Power**: Up to **8,000 watts** supported charge rate (subject to pack thermal limits and BMS app settings).
* **Motor**: QS205 V3 (50H) Spoke Hub Motor (Bicycle/Moped axle)
  - Continuous power: 4,000–5,000W
  - Peak power: 12,000W
  - Weight: 13.0 kg (28.6 lbs)
  - High-efficiency BLDC outer-rotor design with integrated thermal sensors and high-resolution Hall sensor feedback arrays.
* **Current Draw Protection**: Firmware-locked electronic clipping at peak amp limits to protect cell health and prevent thermal runaway cascades.

### 3. MANDATORY MANUFACTURING QUALITY CRITERIA
* **Layer 1 (Structural Isolation)**: 100% Non-Destructive Testing (NDT) on primary chassis joins. Automated Ultrasonic Testing (UT) wave reflection thresholds calibrated to carbon steel frame join profiles.
* **Layer 2 (Powertrain Isolation)**: Automated dielectric isolation and high-voltage insulation tests on 100% of finished wiring harnesses and sealed battery trays before frame integration.
* **Layer 3 (End-of-Line Validation)**: Mandatory 10-minute automated dynamometer track simulation under load coupled with a high-pressure environmental water spray test to verify IP67 ingress ratings.

---
