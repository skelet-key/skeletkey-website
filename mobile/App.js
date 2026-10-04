import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { activateKeepAwakeAsync } from 'expo-keep-awake';

const DASH = 'https://www.skeletkey.com/app/';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    activateKeepAwakeAsync('puca-dash').catch(() => {});
    (async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
      } catch (_e) {}
      setReady(true);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      {ready ? (
        <WebView
          source={{ uri: DASH }}
          style={styles.web}
          javaScriptEnabled
          domStorageEnabled
          geolocationEnabled
          setSupportMultipleWindows={false}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator color="#e8e8e8" />
              <Text style={styles.loadingText}>Opening Puca…</Text>
            </View>
          )}
          renderError={() => (
            <View style={styles.loading}>
              <Text style={styles.loadingText}>No connection. Open the app again on Wi-Fi.</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color="#e8e8e8" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0F19' },
  web: { flex: 1, backgroundColor: '#0B0F19' },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0F19',
    padding: 24,
  },
  loadingText: { color: '#e8e8e8', marginTop: 12, textAlign: 'center' },
});
