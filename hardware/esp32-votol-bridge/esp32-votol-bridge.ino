/**
 * Puca / SkeletKey — ESP32 CAN↔BLE bridge for Votol EM150
 *
 * Polls Votol live data on CAN @ 250 kbit/s and streams JSON over BLE
 * (Nordic UART) to the Puca Dash web app at skeletkey.com/app/
 *
 * Wiring (ESP32 TWAI / built-in CAN — use a 3.3V CAN transceiver e.g. SN65HVD230):
 *   ESP32 GPIO 5  → CAN TX  (to transceiver TXD)
 *   ESP32 GPIO 4  → CAN RX  (from transceiver RXD)
 *   Transceiver   → CAN-H / CAN-L on Votol EM150 (twist pair, 120Ω if bus needs it)
 *   Common GND between ESP32, transceiver, and controller
 *
 * BLE:
 *   Device name: "Puca-Votol"
 *   Service:     6E400001-B5A3-F393-E0A9-E50E24DCCA9E  (Nordic UART)
 *   RX char:     6E400002-...  (phone → ESP32, optional)
 *   TX char:     6E400003-...  (ESP32 → phone, notify)
 *
 * Arduino IDE:
 *   Board: ESP32 Dev Module
 *   Libraries: none beyond ESP32 core (TWAI + BLE)
 *
 * Puca Dash: open /app/ → Connect CAN → pick "Puca-Votol"
 */

#include "driver/twai.h"
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ---- Pins (change if your board differs) ----
static const gpio_num_t CAN_TX_PIN = GPIO_NUM_5;
static const gpio_num_t CAN_RX_PIN = GPIO_NUM_4;

// ---- Votol protocol ----
static const uint32_t CAN_BITRATE = 250000;
static const uint32_t POLL_ID = 0x3FF;
static const uint32_t DATA_ID = 0x3FE;
static const uint8_t POLL_A[8] = { 0x09, 0x55, 0xAA, 0xAA, 0x00, 0xAA, 0x00, 0x00 };
static const uint8_t POLL_B[8] = { 0x00, 0x18, 0xAA, 0x05, 0xD2, 0x00, 0x20, 0x33 };

// Tire circumference mm — match app/config.js (calibrate with GPS)
static const float TIRE_CIRC_MM = 1640.0f;

// Nordic UART UUIDs
#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

BLECharacteristic *pTxCharacteristic = nullptr;
bool bleConnected = false;

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) override {
    bleConnected = true;
    Serial.println("[BLE] connected");
  }
  void onDisconnect(BLEServer *pServer) override {
    bleConnected = false;
    Serial.println("[BLE] disconnected — advertising");
    pServer->startAdvertising();
  }
};

// ---- CAN helpers ----
bool canInit() {
  twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(CAN_TX_PIN, CAN_RX_PIN, TWAI_MODE_NORMAL);
  twai_timing_config_t t_config = TWAI_TIMING_CONFIG_250KBITS();
  twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();

  if (twai_driver_install(&g_config, &t_config, &f_config) != ESP_OK) {
    Serial.println("[CAN] driver install failed");
    return false;
  }
  if (twai_start() != ESP_OK) {
    Serial.println("[CAN] start failed");
    return false;
  }
  Serial.println("[CAN] TWAI 250 kbit/s ready");
  return true;
}

bool canSend(uint32_t id, const uint8_t data[8]) {
  twai_message_t msg = {};
  msg.identifier = id;
  msg.extd = 0;
  msg.rtr = 0;
  msg.data_length_code = 8;
  memcpy(msg.data, data, 8);
  return twai_transmit(&msg, pdMS_TO_TICKS(50)) == ESP_OK;
}

bool canRecv(twai_message_t *msg, uint32_t timeoutMs) {
  return twai_receive(msg, pdMS_TO_TICKS(timeoutMs)) == ESP_OK;
}

void pollVotol() {
  canSend(POLL_ID, POLL_A);
  delay(2);
  canSend(POLL_ID, POLL_B);
}

// Collect three 0x3FE frames into 24 bytes
bool collectLive24(uint8_t out[24], uint32_t overallTimeoutMs) {
  int got = 0;
  uint32_t start = millis();
  while (got < 3 && (millis() - start) < overallTimeoutMs) {
    twai_message_t msg;
    if (!canRecv(&msg, 40)) continue;
    if (msg.extd) continue;
    if ((msg.identifier & 0x7FF) != DATA_ID) continue;
    if (msg.data_length_code < 8) continue;
    memcpy(out + got * 8, msg.data, 8);
    got++;
  }
  return got == 3;
}

static inline uint16_t u16be(const uint8_t *b, int i) {
  return (uint16_t)((b[i] << 8) | b[i + 1]);
}
static inline int16_t i16be(const uint8_t *b, int i) {
  uint16_t v = u16be(b, i);
  return (int16_t)v;
}

float rpmToMph(float rpm) {
  // mph = rpm * 60 * circ_mm / 1_609_344
  return (rpm * 60.0f * TIRE_CIRC_MM) / 1609344.0f;
}

void decodeAndNotify(const uint8_t b[24]) {
  float voltage = u16be(b, 7) / 10.0f;
  float current = i16be(b, 9) / 10.0f;
  uint16_t rpm = u16be(b, 16);
  int ctrlTemp = (int)b[18] - 50;
  int motorTemp = (int)b[19] - 50;
  uint8_t flags = b[22];
  uint8_t stateCode = b[23];

  const char *gear = "L";
  switch (flags & 0x03) {
    case 1: gear = "M"; break;
    case 2: gear = "H"; break;
    case 3: gear = "S"; break;
    default: gear = "L"; break;
  }

  const char *state = "IDLE";
  switch (stateCode) {
    case 1: state = "INIT"; break;
    case 2: state = "START"; break;
    case 3: state = "RUN"; break;
    case 4: state = "STOP"; break;
    case 5: state = "BRAKE"; break;
    case 6: state = "WAIT"; break;
    case 7: state = "FAULT"; break;
    default: state = "IDLE"; break;
  }

  float speed = rpmToMph((float)rpm);

  // JSON line for Puca Dash (parsePayload accepts this)
  char json[256];
  snprintf(json, sizeof(json),
           "{\"rpm\":%u,\"speed\":%.1f,\"voltage\":%.1f,\"current\":%.1f,"
           "\"motorTemp\":%d,\"ctrlTemp\":%d,\"gear\":\"%s\",\"state\":\"%s\","
           "\"brake\":%s,\"regen\":%s}\n",
           (unsigned)rpm, speed, voltage, current, motorTemp, ctrlTemp, gear, state,
           (flags & 0x10) ? "true" : "false",
           (flags & 0x80) ? "true" : "false");

  Serial.print(json);

  if (bleConnected && pTxCharacteristic) {
    pTxCharacteristic->setValue((uint8_t *)json, strlen(json));
    pTxCharacteristic->notify();
  }
}

void setupBle() {
  BLEDevice::init("Puca-Votol");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pTxCharacteristic = pService->createCharacteristic(
      CHARACTERISTIC_UUID_TX,
      BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_READ);
  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic *pRx = pService->createCharacteristic(
      CHARACTERISTIC_UUID_RX,
      BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);
  // RX unused for now — reserved for future commands from the app

  pService->start();

  BLEAdvertising *pAdv = BLEDevice::getAdvertising();
  pAdv->addServiceUUID(SERVICE_UUID);
  pAdv->setScanResponse(true);
  pAdv->setMinPreferred(0x06);
  BLEDevice::startAdvertising();
  Serial.println("[BLE] advertising as Puca-Votol");
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("\n=== Puca Votol EM150 CAN↔BLE bridge ===");

  if (!canInit()) {
    Serial.println("HALT: CAN init failed — check transceiver wiring");
    while (true) delay(1000);
  }
  setupBle();
}

void loop() {
  pollVotol();

  uint8_t live[24];
  if (collectLive24(live, 120)) {
    decodeAndNotify(live);
  } else {
    Serial.println("[CAN] no 0x3FE response (controller off or wiring)");
  }

  // ~5 Hz telemetry
  delay(200);
}
