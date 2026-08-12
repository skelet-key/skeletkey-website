import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  odo: 'sk_puca_odo_mi',
  trip: 'sk_puca_trip_mi',
};

export async function loadOdo() {
  try {
    const o = parseFloat(await AsyncStorage.getItem(KEYS.odo));
    const t = parseFloat(await AsyncStorage.getItem(KEYS.trip));
    return {
      odoMi: !isNaN(o) && o >= 0 ? o : 0,
      tripMi: !isNaN(t) && t >= 0 ? t : 0,
    };
  } catch {
    return { odoMi: 0, tripMi: 0 };
  }
}

export async function saveOdo(odoMi, tripMi) {
  try {
    await AsyncStorage.setItem(KEYS.odo, String(odoMi));
    await AsyncStorage.setItem(KEYS.trip, String(tripMi));
  } catch {
    /* ignore */
  }
}
