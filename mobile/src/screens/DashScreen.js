import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { usePucaRide } from '../hooks/usePucaRide';

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  let m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const sec = s % 60;
  m = m % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function unitSpeed(mph, units) {
  return units === 'kmh' ? mph * 1.60934 : mph;
}
function unitDist(mi, units) {
  return units === 'kmh' ? mi * 1.60934 : mi;
}

function Metric({ label, value, unit }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {value}
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

export default function DashScreen() {
  const r = usePucaRide();
  const speedLabel = r.units === 'kmh' ? 'km/h' : 'mph';
  const distUnit = r.units === 'kmh' ? ' km' : ' mi';
  const displaySpeed = Math.round(unitSpeed(r.speedMph, r.units));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <View style={styles.topbar}>
        <Text style={styles.brand}>
          Skelet<Text style={styles.brandAccent}>Key</Text>
          <Text style={styles.brandSub}>  Puca</Text>
        </Text>
        <Text style={styles.conn}>
          {r.gpsOk ? `GPS ±${Math.round(r.accuracyM || 0)}m` : 'GPS…'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={r.connectBle}>
          <Text style={styles.btnText}>
            {r.bleConnected ? 'Disconnect relay' : r.bleScanning ? 'Scanning…' : 'Connect relay'}
          </Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={r.resetTrip}>
          <Text style={styles.btnText}>Reset trip</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={r.toggleUnits}>
          <Text style={styles.btnText}>{speedLabel}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={styles.ignRow}>
          <Pressable
            onPress={r.toggleIgnition}
            style={[styles.ignBtn, r.ignition && styles.ignBtnOn]}
          >
            <Text style={[styles.ignText, r.ignition && styles.ignTextOn]}>
              {r.ignition ? 'IGN ON' : 'IGN OFF'}
            </Text>
          </Pressable>
          <View style={styles.ignStatus}>
            <Text style={styles.hint}>
              {r.bleConnected
                ? r.ignition
                  ? `Relay · ${r.bleName || 'PucaIgn'} · closed`
                  : `Relay · ${r.bleName || 'PucaIgn'} · open`
                : r.bleNativeAvailable
                  ? 'Connect relay for hardware ignition'
                  : 'UI ignition · BLE needs dev build'}
            </Text>
            {r.bleError ? <Text style={styles.err}>{r.bleError}</Text> : null}
          </View>
        </View>

        <View style={styles.speedBlock}>
          <Text style={[styles.speed, !r.ignition && styles.speedDim]}>{displaySpeed}</Text>
          <Text style={styles.speedUnit}>{speedLabel}</Text>
        </View>

        <View style={styles.grid}>
          <Metric label="Trip" value={unitDist(r.tripMi, r.units).toFixed(1)} unit={distUnit} />
          <Metric label="Max" value={String(Math.round(unitSpeed(r.maxMph, r.units)))} unit={` ${speedLabel}`} />
          <Metric label="Avg" value={String(Math.round(unitSpeed(r.avgMph, r.units)))} unit={` ${speedLabel}`} />
          <Metric label="Time" value={formatTime(r.tripMs)} />
          <Metric label="Heading" value={r.headingLabel} />
          <Metric
            label="Alt"
            value={r.altitudeFt == null ? '—' : String(Math.round(r.altitudeFt))}
            unit=" ft"
          />
          <Metric label="Range" value={String(Math.round(r.range))} unit=" mi" />
          <Metric label="Battery" value={String(Math.round(r.soc))} unit="%" />
          <Metric label="Odo" value={unitDist(r.odoMi, r.units).toFixed(1)} unit={distUnit} />
        </View>

        <View style={styles.mapWrap}>
          {r.coords ? (
            <MapView
              style={styles.map}
              userInterfaceStyle="dark"
              showsUserLocation
              followsUserLocation
              region={{
                latitude: r.coords.latitude,
                longitude: r.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={r.coords} title="Puca" />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.hint}>Waiting for GPS…</Text>
            </View>
          )}
        </View>

        <Text style={styles.legal}>
          FarDriver ND72360 · ESP32 PucaIgn BLE relay · {Platform.OS}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0F19' },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3142',
  },
  brand: { color: '#F8FAFC', fontWeight: '700', fontSize: 16 },
  brandAccent: { color: '#7A8494' },
  brandSub: { color: '#F8FAFC', fontWeight: '600', fontSize: 14 },
  conn: { color: '#A8B4C4', fontSize: 12 },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btn: {
    backgroundColor: '#1A1F2B',
    borderWidth: 1,
    borderColor: '#2A3142',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnText: { color: '#F8FAFC', fontSize: 12, fontWeight: '600' },
  scroll: { paddingBottom: 24 },
  ignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  ignBtn: {
    borderWidth: 2,
    borderColor: '#2A3142',
    backgroundColor: '#1A1F2B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ignBtnOn: {
    borderColor: '#3dd68c',
    backgroundColor: 'rgba(61,214,140,0.12)',
  },
  ignText: { color: '#A8B4C4', fontWeight: '800', letterSpacing: 1 },
  ignTextOn: { color: '#fff' },
  ignStatus: { flex: 1 },
  hint: { color: '#A8B4C4', fontSize: 12 },
  err: { color: '#ff6b7a', fontSize: 11, marginTop: 2 },
  speedBlock: { alignItems: 'center', paddingVertical: 12 },
  speed: {
    color: '#F8FAFC',
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -2,
  },
  speedDim: { opacity: 0.35 },
  speedUnit: {
    color: '#A8B4C4',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 8,
  },
  metric: {
    width: '31%',
    flexGrow: 1,
    backgroundColor: '#12161F',
    borderWidth: 1,
    borderColor: '#2A3142',
    borderRadius: 12,
    padding: 10,
    minWidth: 100,
  },
  metricLabel: {
    color: '#A8B4C4',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  metricUnit: { color: '#A8B4C4', fontSize: 12, fontWeight: '600' },
  mapWrap: {
    height: 220,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A3142',
  },
  map: { flex: 1 },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#12161F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legal: {
    color: '#A8B4C4',
    fontSize: 11,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
});
