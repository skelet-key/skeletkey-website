# ESP32 BLE Ignition Relay — SkeletKey Puca

Controls a **relay / contactor enable** from the **SkeletKey Puca** web app over Bluetooth Low Energy.

## Safety

- Relay is **OFF on boot** and **OFF if the phone disconnects** (fail-safe).
- Use the ESP32 output only to drive a **logic-level relay module** or **contactor coil** circuit — **not** the pack main power path through a tiny relay.
- Keep a **physical key switch or e-stop** in series with high-current power.
- Mount the module away from the motor phase cables; add a flyback diode across inductive coils.

## Parts

| Item | Notes |
|------|--------|
| ESP32 DevKit (WROOM-32) | Same class as Micro Center / Amazon DevKit |
| Relay module (logic-level IN) | 5 V or 3.3 V compatible IN; contacts for **enable** line |
| Or MOSFET + automotive relay | If driving a 12 V coil from a DC-DC |
| Dupont wires | GPIO 26 → relay IN, GND shared |
| USB cable | Flash + optional 5 V power while testing |

## Protocol (Nordic UART)

| Direction | Payload |
|-----------|---------|
| App → ESP32 | `IGN:1\n` ON · `IGN:0\n` OFF · `PING\n` · `STATUS?\n` |
| ESP32 → App | `IGN:1\n` · `IGN:0\n` · `PONG\n` · `ERR:UNKNOWN\n` |

Device advertises as **`PucaIgn`**.

## Flash

1. Arduino IDE or PlatformIO — board **ESP32 Dev Module**
2. Open `esp32-ignition-relay.ino`
3. Select port, upload
4. Power ESP32 on the bike (USB power bank for bench test, or regulated 5 V)

## Wire example (enable line)

```
[Pack +] -- [Main fuse] -- [Contactor] -- [FarDriver B+]
                              ^
                              | coil
                         [Relay NO]
                              |
                         [12V or logic supply via key]
```

Puca app toggles the **relay** that energizes the **contactor coil** or FarDriver **key/enable** input.

## App

1. Open https://skeletkey.com/app/ on **Chrome Android** (Web Bluetooth)
2. Tap **Connect relay**
3. Select **PucaIgn**
4. Tap **IGN ON / OFF** — command is sent over BLE
