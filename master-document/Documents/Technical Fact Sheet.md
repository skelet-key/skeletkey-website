# TECHNICAL FACT SHEET: FOLDING ELECTRIC MOTORCYCLE CHASSIS & POWERTRAIN
## Document Reference: TFS-2026-V1
## Classification: Technical Appendix / Factory Briefing

---

### 1. CORE CHASSIS STRUCTURAL METRICS
* **Material Specification**: Heat-treated 6061-T6 Structural Aluminum Alloy (Extruded and Formed Profiles).
* **Welding Protocol**: Gas Tungsten Arc Welding (GTAW / TIG) or Gas Metal Arc Welding (GMAW / MIG) using ER5356 filler wire to maintain optimal post-weld joint strength.
* **Post-Weld Heat Treatment (PWHT)**: Artificial aging required if structural thermal stress exceeds threshold. Standard processing to verify T6 temper state across heat-affected zones (HAZ).
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
  - Weight: 13.5 kg (29.7 lbs)
  - High-efficiency BLDC outer-rotor design with integrated thermal sensors and high-resolution Hall sensor feedback arrays.
* **Current Draw Protection**: Firmware-locked electronic clipping at peak amp limits to protect cell health and prevent thermal runaway cascades.

### 3. MANDATORY MANUFACTURING QUALITY CRITERIA
* **Layer 1 (Structural Isolation)**: 100% Non-Destructive Testing (NDT) on primary chassis joins. Automated Ultrasonic Testing (UT) wave reflection thresholds calibrated precisely to 6061-T6 material density profiles.
* **Layer 2 (Powertrain Isolation)**: Automated dielectric isolation and high-voltage insulation tests on 100% of finished wiring harnesses and sealed battery trays before frame integration.
* **Layer 3 (End-of-Line Validation)**: Mandatory 10-minute automated dynamometer track simulation under load coupled with a high-pressure environmental water spray test to verify IP67 ingress ratings.

---
