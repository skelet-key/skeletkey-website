# Warehouse Operations & Finished Vehicle Logistics Guide
**Target:** Support **5,000** assembled units/year (~100 bikes/week outbound)
**Updated:** 2026-08-21

Finished Puca units arrive from **contract assemblers** (consigned kits we already paid for as parts). The warehouse is **fulfillment + spare packs**, not a frame factory.

## 1. Receiving

* Inbound: crated complete bikes from the assembler after Layer 3 EOL.
* Buffer: ~40 crates (about two days at 20/day).
* Inspect: transit damage, fold latch, sourced **carbon steel** frame, pack enclosure, wireless BMS / FarDriver handshake.

## 2. Layout

```
[Inbound dock] → [Inspect & 50% SoC top-off] → [Staging racks] → [Outbound]
                                      ↘ [Class 9 spare-pack cage]
```

* **Zone A:** Unbox, visual, trickle to **50% SoC** for freight.
* **Zone B:** Crated bikes, stack per crate rating.
* **Zone C:** Spare **~60 lb / 8.5 kWh** modules — thermal camera, fire isolation, Class 9 rules.

## 3. Outbound

* ~200 certified units/week at rate.
* Pack may ship **separate** from folding chassis for air/travel SKUs.
* LTL + last mile; serials tied to Puca app / warranty.

## 4. Financing

WMS quantities are collateral for inventory lines. **No personal guarantees.**
