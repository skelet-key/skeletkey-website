# PRODUCTION & SOURCING MODEL
## Document Reference: PSM-2026-V1
## Classification: Canonical · Supersedes factory / die / Tier-2 weld language in older PDFs
## Updated: 2026-08-21

**SkeletKey does not run a frame factory.** We **source** folding frames and all other parts from vendors. We **contract assemblers** to kit, marry, test, and crate finished Puca motorcycles to a **10,000 units/year** run rate (~40 units/day on a 250-day calendar).

---

## 1. WHO DOES WHAT

| Role | Owner |
|------|--------|
| Product design, BOM, brand, app, firmware/spec, supplier contracts | **SkeletKey** |
| Folding frames | **Sourced** (OEM / contract frame vendors). Prototype: carbon steel folding, **9.2 lb** measured, **190 mm** rear dropout, **44 mm** headset class |
| Hub motor, controller, pack, CCS inlet, wheels, brakes, controls | **Sourced** turnkey or consigned to the assembler |
| Battery enclosure + slide-in contacts | Specified by SkeletKey; built by pack/enclosure vendor |
| Rear deck, café seat, rails | Specified; cut/fab by metal vendors (6061 deck **bolted** to steel frame — no Al→steel weld) |
| Final assembly, flash, EOL test, crate | **Contract assembler(s)** — labor + overhead only, **no parts markup** |
| IQC of incoming frames/parts | Assembler + SkeletKey spec (inspect, don’t remanufacture the frame) |
| 3PL / last-mile | Warehouse / fulfillment partner |

---

## 2. WHY THIS MODEL

- Matches how the prototype is actually being built: buy the folding frame, buy the QS205, buy the FarDriver, buy the pack, assemble.
- Avoids $120k–$300k **extrusion dies and hinge stamps** as a condition of scale.
- 10,000/year is an **assembly throughput** problem, not a mill/weld-shop problem.
- Gross-margin math stays: sourced BOM + **~$500/unit** assembler labor & QA.

---

## 3. CURRENT HARDWARE BASELINE (prototype → production spec)

| Area | Locked / measured |
|------|-------------------|
| Frame | Sourced carbon steel folding · **9.2 lb** · **190 mm** dropout · IN TRANSIT (AliExpress-class OEM) |
| Motor | **QS205 V3 (50H) 3T** · 20×4.0 · **28.6 lb** · **HAVE** |
| Controller | **FarDriver ND72360 BT** · **HAVE** |
| Pack | Modular semi-solid **NMC+** · **~8.5 kWh** · **~63 V** · **~60 lb** with enclosure/BMS · dual **QS8** · slide-in lock |
| Charge | **CCS1** public DC 6–8 kW via HV→pack DC–DC; inlet **HAVE** (EV-T1GBIE12-1ACDC80A200A2-DM + Küster lock) |
| Dash | SkeletKey Puca app (`/app/`) + FarDriver app for tune |
| Seat | Café-racer on aluminum deck over pack — **no seatpost seat** |
| MSRP | **$6,999** |

See **Parts Inventory Checklist.md** and **Build Decisions and Shopping List.md**.

---

## 4. SCALE PATH TO 10,000 / YEAR

1. Freeze BOM and incoming inspection criteria on the **sourced frame** (dropout, headset, fold latch, stay tabs).
2. Dual-source frames if a single OEM cannot hold rate or quality.
3. Award **one or two assemblers** a consigned-kit contract: we ship parts, they output crated bikes.
4. Assembler capacity: 40 units/day peak = 10,000/year. LRIP first (pilot 50–200), then ramp.
5. SkeletKey keeps: drawings, serials, app, BMS limits, CCS stack spec, warranty.

---

## 5. WHAT WE DO *NOT* DO AT SCALE

- Own or operate a tube mill, extrusion press, or robotic frame-weld cell as the production plan.
- Amortize **custom carbon-steel extrusion dies / hinge stamps** as a $300k CapEx gate.
- Ask assemblers to **fabricate frames** (they assemble sourced frames).
- Mix 6061-T6 “we weld the chassis” language with the carbon-steel sourced frame (6061 is for **deck/rails/pack enclosure**, not the folding chassis).

---

## 6. NRE THAT *IS* STILL REQUIRED

Assembly and test — not frame dies:

| Item | Role | Order-of-magnitude |
|------|------|--------------------|
| Fold / dropout / deck fixtures | Repeatable marriage | Assembly jigs |
| Incoming gauges | Frame dropout, headset, fold play | IQC |
| Hipot / insulation / BMS test | Pack + harness | Line 2 |
| Short dyno / roll test | Motor + controller + brake | EOL |
| Spray / IP check | Electrical seals | EOL |

See **Tooling Amortization Schedule.md** (rewritten for this model).

---

## 7. SUPERSEDED DOCUMENTS

Treat these **PDFs** as archive copies. Use the Markdown with the same title (or this document) as source of truth:

- Assembly Strategy.pdf → **Assembly Strategy.md**
- QA Strategy.pdf → **QA Strategy.md**
- Financial Reality Check.pdf → **Financial Reality Check.md**

Older text about Tier-2 frame welding, T6 oven aging, and $120k extrusion dies is **withdrawn**.
