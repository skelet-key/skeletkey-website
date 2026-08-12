import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { PUCA_CONFIG } from '../config';
import { loadOdo, saveOdo } from '../services/storage';
import {
  connectRelay,
  disconnectRelay,
  sendIgnition,
  setStatusCallback,
  isBleNativeAvailable,
} from '../services/bleIgnition';

function headingCardinal(deg) {
  if (deg == null || Number.isNaN(deg)) return '—';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round(deg / 45) % 8;
  return `${dirs[i]} ${Math.round(deg)}°`;
}

export function usePucaRide() {
  const [ignition, setIgnitionState] = useState(false);
  const [speedMph, setSpeedMph] = useState(0);
  const [maxMph, setMaxMph] = useState(0);
  const [tripMi, setTripMi] = useState(0);
  const [odoMi, setOdoMi] = useState(0);
  const [tripMs, setTripMs] = useState(0);
  const [movingMs, setMovingMs] = useState(0);
  const [heading, setHeading] = useState(null);
  const [altitudeFt, setAltitudeFt] = useState(null);
  const [gpsOk, setGpsOk] = useState(false);
  const [accuracyM, setAccuracyM] = useState(null);
  const [coords, setCoords] = useState(null);
  const [units, setUnits] = useState(PUCA_CONFIG.unitsDefault || 'mph');
  const [soc] = useState(84);
  const [range] = useState(105);
  const [bleConnected, setBleConnected] = useState(false);
  const [bleName, setBleName] = useState(null);
  const [bleError, setBleError] = useState(null);
  const [bleScanning, setBleScanning] = useState(false);

  const lastFixTs = useRef(0);
  const ignitionRef = useRef(false);
  const tripMiRef = useRef(0);
  const odoMiRef = useRef(0);
  const maxMphRef = useRef(0);
  const movingMsRef = useRef(0);
  const tripMsRef = useRef(0);

  useEffect(() => {
    ignitionRef.current = ignition;
  }, [ignition]);

  useEffect(() => {
    (async () => {
      const { odoMi: o, tripMi: t } = await loadOdo();
      setOdoMi(o);
      setTripMi(t);
      odoMiRef.current = o;
      tripMiRef.current = t;
    })();
  }, []);

  useEffect(() => {
    setStatusCallback((partial) => {
      if (partial.bleConnected != null) setBleConnected(partial.bleConnected);
      if (partial.bleName !== undefined) setBleName(partial.bleName);
      if (partial.bleError !== undefined) setBleError(partial.bleError);
      if (partial.bleScanning != null) setBleScanning(partial.bleScanning);
      if (partial.ignition != null && partial.fromBle) {
        setIgnitionState(!!partial.ignition);
      }
    });
  }, []);

  useEffect(() => {
    let sub = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsOk(false);
        return;
      }
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 500,
          distanceInterval: 0,
        },
        (pos) => {
          const c = pos.coords;
          let mph = c.speed != null && !Number.isNaN(c.speed) ? c.speed * 2.236936 : 0;
          if (mph < 0) mph = 0;
          if (mph < 0.8) mph = 0;

          const now = Date.now();
          const dt = lastFixTs.current ? (now - lastFixTs.current) / 1000 : 0;
          lastFixTs.current = now;

          if (ignitionRef.current && dt > 0 && dt < 5) {
            tripMsRef.current += dt * 1000;
            setTripMs(tripMsRef.current);
            if (mph > 0.8) {
              movingMsRef.current += dt * 1000;
              setMovingMs(movingMsRef.current);
              const dMi = mph * (dt / 3600);
              tripMiRef.current += dMi;
              odoMiRef.current += dMi;
              setTripMi(tripMiRef.current);
              setOdoMi(odoMiRef.current);
              saveOdo(odoMiRef.current, tripMiRef.current);
            }
          }

          setSpeedMph(mph);
          if (ignitionRef.current && mph > maxMphRef.current) {
            maxMphRef.current = mph;
            setMaxMph(mph);
          }
          if (c.heading != null && !Number.isNaN(c.heading)) setHeading(c.heading);
          if (c.altitude != null && !Number.isNaN(c.altitude)) {
            setAltitudeFt(c.altitude * 3.28084);
          }
          setCoords({ latitude: c.latitude, longitude: c.longitude });
          setGpsOk(true);
          setAccuracyM(c.accuracy);
        }
      );
    })();

    return () => {
      if (sub) sub.remove();
    };
  }, []);

  const setIgnition = useCallback(async (on) => {
    setIgnitionState(!!on);
    if (bleConnected) {
      try {
        await sendIgnition(!!on);
      } catch (e) {
        setBleError(e.message || String(e));
      }
    }
  }, [bleConnected]);

  const toggleIgnition = useCallback(() => {
    setIgnition(!ignitionRef.current);
  }, [setIgnition]);

  const resetTrip = useCallback(() => {
    tripMiRef.current = 0;
    tripMsRef.current = 0;
    movingMsRef.current = 0;
    maxMphRef.current = 0;
    setTripMi(0);
    setTripMs(0);
    setMovingMs(0);
    setMaxMph(0);
    saveOdo(odoMiRef.current, 0);
  }, []);

  const toggleUnits = useCallback(() => {
    setUnits((u) => (u === 'mph' ? 'kmh' : 'mph'));
  }, []);

  const connectBle = useCallback(async () => {
    if (bleConnected) {
      await disconnectRelay();
      return;
    }
    await connectRelay();
  }, [bleConnected]);

  const avgMph = movingMs > 0 ? tripMi / (movingMs / 3600000) : 0;

  return {
    ignition,
    setIgnition,
    toggleIgnition,
    speedMph,
    maxMph,
    avgMph,
    tripMi,
    odoMi,
    tripMs,
    heading,
    headingLabel: headingCardinal(heading),
    altitudeFt,
    gpsOk,
    accuracyM,
    coords,
    units,
    toggleUnits,
    soc,
    range,
    resetTrip,
    bleConnected,
    bleName,
    bleError,
    bleScanning,
    connectBle,
    bleNativeAvailable: isBleNativeAvailable(),
    maxScale: PUCA_CONFIG.maxSpeedMph || 80,
  };
}
