import { PUCA_CONFIG } from '../config';

const bleCfg = PUCA_CONFIG.ble;

let BleManager = null;
let manager = null;
let connectedDevice = null;
let rxChar = null;
let onStatus = null;

try {
  BleManager = require('react-native-ble-plx').BleManager;
} catch (_e) {
  BleManager = null;
}

function toBase64(str) {
  try {
    if (typeof global !== 'undefined' && global.btoa) return global.btoa(str);
  } catch (_e) {}
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let i = 0;
  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : Number.NaN;
    const c = i < str.length ? str.charCodeAt(i++) : Number.NaN;
    const bitmap = (a << 16) | ((Number.isNaN(b) ? 0 : b) << 8) | (Number.isNaN(c) ? 0 : c);
    output += chars.charAt((bitmap >> 18) & 63);
    output += chars.charAt((bitmap >> 12) & 63);
    output += Number.isNaN(b) ? '=' : chars.charAt((bitmap >> 6) & 63);
    output += Number.isNaN(c) ? '=' : chars.charAt(bitmap & 63);
  }
  return output;
}

function fromBase64(b64) {
  try {
    if (typeof global !== 'undefined' && global.atob) return global.atob(b64);
  } catch (_e) {}
  return '';
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
      bleError: 'BLE needs a dev build (react-native-ble-plx)',
    });
    return false;
  }

  if (!manager) manager = new BleManager();
  emit({ bleScanning: true, bleError: null });

  return new Promise((resolve) => {
    const hints = bleCfg.deviceNameHints || ['PucaIgn'];
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      try {
        manager.stopDeviceScan();
      } catch (_e) {}
      resolve(ok);
    };

    manager.startDeviceScan(null, { allowDuplicates: false }, async (error, device) => {
      if (error) {
        emit({ bleScanning: false, bleError: error.message });
        finish(false);
        return;
      }
      if (!device || !device.name) return;
      if (!hints.some((h) => device.name.indexOf(h) >= 0)) return;

      try {
        manager.stopDeviceScan();
        const dev = await device.connect();
        await dev.discoverAllServicesAndCharacteristics();
        connectedDevice = dev;
        const services = await dev.services();
        const svc = services.find(
          (s) => s.uuid.toLowerCase() === bleCfg.serviceUuid.toLowerCase()
        );
        if (!svc) throw new Error('NUS service not found');
        const charsList = await svc.characteristics();
        rxChar = charsList.find((c) => c.uuid.toLowerCase() === bleCfg.rxCharUuid.toLowerCase());
        const tx = charsList.find((c) => c.uuid.toLowerCase() === bleCfg.txCharUuid.toLowerCase());
        if (!rxChar) throw new Error('RX characteristic not found');

        if (tx) {
          tx.monitor((err, characteristic) => {
            if (err || !characteristic || !characteristic.value) return;
            const text = fromBase64(characteristic.value);
            String(text)
              .split(/\r?\n/)
              .forEach((line) => {
                const L = line.trim();
                if (L === 'IGN:1') emit({ ignition: true, fromBle: true });
                if (L === 'IGN:0') emit({ ignition: false, fromBle: true });
              });
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
        finish(true);
      } catch (e) {
        emit({
          bleConnected: false,
          bleScanning: false,
          bleError: e.message || String(e),
        });
        finish(false);
      }
    });

    setTimeout(() => {
      emit({ bleScanning: false });
      finish(false);
    }, 15000);
  });
}

export async function disconnectRelay() {
  try {
    await sendIgnition(false);
  } catch (_e) {}
  try {
    if (connectedDevice) await connectedDevice.cancelConnection();
  } catch (_e) {}
  connectedDevice = null;
  rxChar = null;
  emit({ bleConnected: false, bleName: null });
}

export async function sendIgnition(on) {
  if (!rxChar || !connectedDevice) return false;
  const payload = on ? 'IGN:1\n' : 'IGN:0\n';
  await rxChar.writeWithResponse(toBase64(payload));
  return true;
}
