# QA STRATEGY
## Document Reference: QA-2026-V2
## Supersedes: QA Strategy.pdf (frame-weld / 6061 chassis NDT as production plan withdrawn)
## Updated: 2026-08-21

Defects are cheaper to catch **on incoming sourced parts** than after a customer has a motorcycle.

### Layer 1 — Incoming (IQC)

| What | Check |
|------|--------|
| Sourced folding frame | 190 mm dropout, headset ID (~44 mm class), fold latch play, cracks, measured mass (~9.2 lb class), stay/tab geometry |
| QS205 | Dropout, Hall/phase pinout, disc side, 20×4.0 |
| FarDriver ND72360 | BT module present, voltage class 48–72 V |
| Pack | Envelope, mass ~60 lb, QS8 polarity, Bluetooth BMS, hipot |
| CCS inlet group | Pinout vs EV-T1GBIE12 / Küster lock |

We **do not** rely on ultrasonic inspection of *our own* robotic chassis welds — we do not run that factory. Batch CMM/laser on **vendor** frames is an IQC option if the OEM’s own certs are weak.

### Layer 2 — In-line

- Pack hipot and BMS balance before marriage.
- Blind-mate / QS8 polarity interlock: no enable if pack not seated.
- Controller flash + throttle/brake inhibit test.
- Fold test with deck + pack mock or real pack (clearance).

### Layer 3 — End of line

- Short loaded roll or dyno: current, speed, motor temp.
- Lights, horn, e-stop/ignition via Puca app path.
- Spray on electrical joints (IP65 target — not a claim of IP67 unless tested).

**Firewall:** assembler builds; a second person or station **signs off** Layer 3. No ship on assembler self-cert alone at rate.
