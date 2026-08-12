# ESP32 ↔ Votol EM150 CAN bridge

Streams live controller data to **[Puca Dash](https://skeletkey.com/app/)** over Bluetooth LE.

## What it does

1. Polls the Votol EM150 on **CAN @ 250 kbit/s** (`0x3FF` → `0x3FE`)
2. Decodes RPM, voltage, current, temps, gear, state
3. Notifies JSON over **Nordic UART BLE** as device **`Puca-Votol`**

## Hardware

| ESP32 | CAN transceiver (e.g. SN65HVD230) | Votol EM150 |
|-------|-----------------------------------|-------------|
| GPIO 5 (TX) | TXD | |
| GPIO 4 (RX) | RXD | |
| 3.3V | VCC | |
| GND | GND | GND (common) |
| | CANH | CAN-H |
| | CANL | CAN-L |

- Use a **3.3 V** transceiver (SN65HVD230 family). Do not feed 5 V CAN chips into ESP32 pins.
- Twisted pair for CAN-H / CAN-L.
- Add **120 Ω** termination if the bus is only the controller + bridge.

Default pins are set at the top of the sketch (`CAN_TX_PIN`, `CAN_RX_PIN`).

## Arduino IDE

1. Install **esp32** board package (Espressif)
2. Board: **ESP32 Dev Module**
3. Open `esp32-votol-bridge.ino` and upload
4. Serial monitor @ **115200** — you should see JSON lines when the controller is on

## Phone / Dash

1. Power the bike (controller on)
2. Open [skeletkey.com/app/](https://skeletkey.com/app/)
3. Tap **Connect CAN**
4. Select **Puca-Votol**
5. Allow Bluetooth

## Calibration

Set the same tire circumference in:

- Sketch: `TIRE_CIRC_MM` (default `1640`)
- App: `app/config.js` → `tireCircumferenceMm`

Compare GPS speed on a flat road and adjust until they match.

## Protocol reference

| ID | Direction | Notes |
|----|-----------|--------|
| `0x3FF` | Bridge → controller | Two poll frames |
| `0x3FE` | Controller → bridge | Three frames = 24-byte live packet |

SOC is not on the EM150 live frame; the dash estimates it from pack voltage (or from a BMS if you merge that later).

## Troubleshooting

| Symptom | Check |
|---------|--------|
| `[CAN] no 0x3FE response` | Ignition on, CAN-H/L not swapped, 250 kbit/s, termination |
| BLE device not listed | Chrome on Android; location permission sometimes required for BLE scan |
| Speed wrong | Calibrate `TIRE_CIRC_MM` |
| Garbled voltage/current | Confirm your EM150 is the **CAN** variant (EM150-2 / SP), not UART-only |

