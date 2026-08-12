/**
 * BLE ignition relay service
 *
 * Expo Go does NOT include native BLE. For hardware ignition:
 *   1. npx expo install react-native-ble-plx
 *   2. npx expo prebuild
 *   3. Use a development build / EAS build (not Expo Go)
 *
 * This module provides a safe stub + optional native hook so the UI
 * always works; hardware commands run when BleManager is available.
 */

import { PUCA_CONFIG } from '../config';

const bleCfg = PUCA_CONFIG.ble;

let BleManager = null;
let manager = null;
let connectedDevice = null;
let rxChar = null;
let onStatus = null;

try {
  // Optional dependency — only present after prebuild + install
  // eslint-disable-next-line import/no-extraneous-dependencies
  BleManager = require('react-native-ble-plx').BleManager;
} catch {
  BleManager = null;
}

export function isBleNativeAvailable() {
  return !!BleManager;
}

export function setStatusCallback(cb) {
  onStatus = cb;
}

function emit(partial) {
  if (typeof onStatus === 'function') onStatus(partial);
}

export async function connectRelay() {
  if (!BleManager) {
    emit({
      bleConnected: false,
      bleName: null,
      bleError:
        'BLE needs a dev build. Run: npx expo install react-native-ble-plx && npx expo prebuild',
    });
    return false;
  }

  if (!manager) manager = new BleManager();

  emit({ bleScanning: true, bleError: null });

  return new Promise((resolve) => {
    const hints = bleCfg.deviceNameHints || ['PucaIgn'];
    const sub = manager.startDeviceScan(null, { allowDuplicates: false }, async (error, device) => {
      if (error) {
        emit({ bleScanning: false, bleError: error.message });
        resolve(false);
        return;
      }
      if (!device || !device.name) return;
      const match = hints.some((h) => device.name.indexOf(h) >= 0);
      if (!match) return;

      sub.remove();
      manager.stopDeviceScan();

      try {
        const dev = await device.connect();
        await dev.discoverAllServicesAndCharacteristics();
        connectedDevice = dev;
        const services = await dev.services();
        const svc = services.find(
          (s) => s.uuid.toLowerCase() === bleCfg.serviceUuid.toLowerCase()
        );
        if (!svc) throw new Error('NUS service not found');
        const chars = await svc.characteristics();
        rxChar = chars.find((c) => c.uuid.toLowerCase() === bleCfg.rxCharUuid.toLowerCase());
        const tx = chars.find((c) => c.uuid.toLowerCase() === bleCfg.txCharUuid.toLowerCase());
        if (!rxChar) throw new Error('RX characteristic not found');

        if (tx) {
          tx.monitor((err, characteristic) => {
            if (err || !characteristic?.value) return;
            try {
              const text = Buffer.from(characteristic.value, 'base64').toString('utf8');
              text.split(/\r?\n/).forEach((line) => {
                const L = line.trim();
                if (L === 'IGN:1') emit({ ignition: true, fromBle: true });
                if (L === 'IGN:0') emit({ ignition: false, fromBle: true });
              });
            } catch {
              /* ignore parse */
            }
          });
        }

        dev.onDisconnected(() => {
          connectedDevice = null;
          rxChar = null;
          emit({
            bleConnected: false,
            bleName: null,
            ignition: bleCfg.failSafeOffOnDisconnect !== false ? false : undefined,
            fromBle: true,
          });
        });

        emit({
          bleConnected: true,
          bleName: device.name,
          bleScanning: false,
          bleError: null,
        });
        await sendIgnition(false);
        resolve(true);
      } catch (e) {
        emit({
          bleConnected: false,
          bleScanning: false,
          bleError: e.message || String(e),
        });
        resolve(false);
      }
    });

    setTimeout(() => {
      try {
        manager.stopDeviceScan();
      } catch {
        /* ignore */
      }
      emit({ bleScanning: false });
    }, 15000);
  });
}

export async function disconnectRelay() {
  try {
    await sendIgnition(false);
  } catch {
    /* ignore */
  }
  try {
    if (connectedDevice) await connectedDevice.cancelConnection();
  } catch {
    /* ignore */
  }
  connectedDevice = null;
  rxChar = null;
  emit({ bleConnected: false, bleName: null });
}

export async function sendIgnition(on) {
  if (!rxChar || !connectedDevice) return false;
  const payload = on ? 'IGN:1\n' : 'IGN:0\n';
  const base64 =
    typeof btoa === 'function'
      ? btoa(payload)
      : Buffer.from(payload, 'utf8').toString('base64');
  await rxChar.writeWithResponse(base64);
  return true;
}
