# ASSEMBLY STRATEGY
## Document Reference: AS-2026-V2
## Supersedes: Assembly Strategy.pdf (6061-T6 in-house frame fab language withdrawn)
## Updated: 2026-08-21

### 1. Architecture

To deliver **10,000** folding electric motorcycles in a year, SkeletKey uses **sourced components + contract assembly**.

- SkeletKey buys **complete folding frames** (carbon steel prototype: **9.2 lb**, **190 mm** dropout) and all major parts.
- Assemblers **do not fabricate the chassis**. They kit, assemble, test, and crate.
- Cadence at rate: **~40 units/day** (250-day year) ≈ 2.5 units/hour on a two-shift line *or* split across two assembler sites.

### 2. Material flow (consigned)

```
Frame OEM ──┐
Motor OEM ──┤
Pack OEM  ──┼──►  SkeletKey kitting / 3PL  ──►  Assembler line  ──►  crate  ──►  warehouse
Controls  ──┤
CCS / other─┘
```

Assembler is paid **labor + overhead + QA**, target **$500/unit**. No 10–15% manufacturer parts markup.

### 3. Line stations (typical)

1. Incoming inspect sourced frame (dropout, headset, fold, tabs).
2. Press headset / fit fork / front 20×4.0 (once BOM frozen).
3. Fit QS205 + torque arms + left disc (clear cables).
4. Mount FarDriver ND72360, harness, throttle, lights.
5. Bolt 6061 deck + slide rails; install café seat isolators.
6. Slide-in ~60 lb pack; lock; QS8 / blind-mate check.
7. Flash FarDriver + confirm Puca app ignition path.
8. EOL: roll/dyno, brakes, fold clearance, spray on seals.
9. Crate at 50% SoC for freight.

### 4. What assemblers are *not* scoped to do

- Design or weld a proprietary SkeletKey tube chassis as the scale plan.
- Age 6061-T6 frames in an oven (the **folding frame is sourced steel**).
- Tool custom extrusion dies.

6061 work that *does* happen: **small** deck/rail/enclosure parts from laser/waterjet vendors, TIG as a sub-assembly, then **bolted** to steel.
