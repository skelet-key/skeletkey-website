import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

const DASH = 'https://www.skeletkey.com/app/';

class CrashGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Puca could not start on this phone.</Text>
          <Pressable onPress={() => Linking.openURL(DASH).catch(() => {})}>
            <Text style={styles.link}>Open in Chrome</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [webFailed, setWebFailed] = useState(false);

  useEffect(() => {
    try {
      const { activateKeepAwakeAsync } = require('expo-keep-awake');
      Promise.resolve(activateKeepAwakeAsync('puca-dash')).catch(() => {});
    } catch (_e) {}
    try {
      const Location = require('expo-location');
      Promise.resolve(Location.requestForegroundPermissionsAsync()).catch(() => {});
    } catch (_e) {}
  }, []);

  return (
    <CrashGuard>
      <View style={styles.safe}>
        <StatusBar style="light" />
        {webFailed ? (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>This phone’s browser engine could not open the dash.</Text>
            <Pressable onPress={() => Linking.openURL(DASH).catch(() => {})}>
              <Text style={styles.link}>Open in Chrome</Text>
            </Pressable>
          </View>
        ) : (
          <WebView
            source={{ uri: DASH }}
            style={styles.web}
            javaScriptEnabled
            domStorageEnabled
            geolocationEnabled
            mixedContentMode="compatibility"
            thirdPartyCookiesEnabled
            setSupportMultipleWindows={false}
            originWhitelist={['*']}
            startInLoadingState
            onError={() => setWebFailed(true)}
            onHttpError={() => setWebFailed(true)}
            renderLoading={() => (
              <View style={styles.loading}>
                <ActivityIndicator color="#e8e8e8" />
                <Text style={styles.loadingText}>Opening Puca…</Text>
              </View>
            )}
          />
        )}
      </View>
    </CrashGuard>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0F19' },
  web: { flex: 1, backgroundColor: '#0B0F19' },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0F19',
    padding: 24,
  },
  loadingText: { color: '#e8e8e8', marginTop: 12, textAlign: 'center', fontSize: 16 },
  link: { color: '#ff4d4d', marginTop: 16, fontSize: 16 },
});
