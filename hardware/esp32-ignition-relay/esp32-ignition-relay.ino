/**
 * SkeletKey Puca — BLE Ignition Relay (ESP32)
 *
 * Advertises Nordic UART Service. Phone app writes:
 *   IGN:1\n  → close relay (ignition ON)
 *   IGN:0\n  → open relay (ignition OFF)
 *   PING\n   → PONG\n
 *   STATUS?\n → IGN:0|1\n
 *
 * Fail-safe: relay OPEN on boot, BLE disconnect, and brown-out.
 *
 * Wiring (example):
 *   GPIO 26 → NPN/MOSFET or relay module IN
 *   Relay COM/NO in series with FarDriver key/enable or main contactor coil
 *   Use a relay rated for the control circuit (typically 12 V coil or logic-level module)
 *   NEVER put pack high-current through a small signal relay — drive a contactor.
 *
 * Board: ESP32 DevKit (WROOM-32)
 * Library: ESP32 BLE Arduino (built-in with ESP32 board package)
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ---- Hardware ----
#define RELAY_PIN           26      // Active HIGH = ignition ON
#define RELAY_ACTIVE_HIGH   true
#define STATUS_LED_PIN      2       // onboard LED on many DevKits
#define DEVICE_NAME         "PucaIgn"

// Nordic UART Service UUIDs (match app/config.js)
#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHAR_UUID_RX        "6e400002-b5a3-f393-e0a9-e50e24dcca9e"  // write from phone
#define CHAR_UUID_TX        "6e400003-b5a3-f393-e0a9-e50e24dcca9e"  // notify to phone

BLEServer *pServer = nullptr;
BLECharacteristic *pTxChar = nullptr;
bool deviceConnected = false;
bool wasConnected = false;
bool ignitionOn = false;

void setRelay(bool on) {
  ignitionOn = on;
  bool level = RELAY_ACTIVE_HIGH ? on : !on;
  digitalWrite(RELAY_PIN, level ? HIGH : LOW);
  digitalWrite(STATUS_LED_PIN, on ? HIGH : LOW);
}

void notifyStatus() {
  if (!pTxChar) return;
  String msg = ignitionOn ? "IGN:1\n" : "IGN:0\n";
  pTxChar->setValue(msg.c_str());
  pTxChar->notify();
}

void notifyText(const char *text) {
  if (!pTxChar || !deviceConnected) return;
  pTxChar->setValue(text);
  pTxChar->notify();
}

void handleCommand(const String &raw) {
  String cmd = raw;
  cmd.trim();
  cmd.toUpperCase();

  if (cmd == "IGN:1" || cmd == "IGN ON" || cmd == "1") {
    setRelay(true);
    notifyStatus();
  } else if (cmd == "IGN:0" || cmd == "IGN OFF" || cmd == "0") {
    setRelay(false);
    notifyStatus();
  } else if (cmd == "PING") {
    notifyText("PONG\n");
  } else if (cmd == "STATUS?" || cmd == "STATUS") {
    notifyStatus();
  } else if (cmd.length() > 0) {
    notifyText("ERR:UNKNOWN\n");
  }
}

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *s) {
    deviceConnected = true;
  }
  void onDisconnect(BLEServer *s) {
    deviceConnected = false;
    // Fail-safe: kill ignition when phone disconnects
    setRelay(false);
  }
};

class RxCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *c) {
    std::string v = c->getValue();
    if (v.length() == 0) return;
    String s = String(v.c_str());
    // Support multiple commands separated by newline
    int start = 0;
    while (start < (int)s.length()) {
      int nl = s.indexOf('\n', start);
      if (nl < 0) nl = s.length();
      handleCommand(s.substring(start, nl));
      start = nl + 1;
    }
  }
};

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  setRelay(false);

  Serial.begin(115200);
  Serial.println("SkeletKey PucaIgn BLE relay");

  BLEDevice::init(DEVICE_NAME);
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *svc = pServer->createService(SERVICE_UUID);

  pTxChar = svc->createCharacteristic(
    CHAR_UUID_TX,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pTxChar->addDescriptor(new BLE2902());

  BLECharacteristic *pRxChar = svc->createCharacteristic(
    CHAR_UUID_RX,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR
  );
  pRxChar->setCallbacks(new RxCallbacks());

  svc->start();

  BLEAdvertising *adv = BLEDevice::getAdvertising();
  adv->addServiceUUID(SERVICE_UUID);
  adv->setScanResponse(true);
  adv->setMinPreferred(0x06);
  adv->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("Advertising as " DEVICE_NAME);
}

void loop() {
  if (!deviceConnected && wasConnected) {
    delay(300);
    pServer->startAdvertising();
    Serial.println("Re-advertising");
    wasConnected = false;
  }
  if (deviceConnected && !wasConnected) {
    wasConnected = true;
    Serial.println("Phone connected");
    notifyStatus();
  }
  delay(50);
}
