import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashScreen from './src/screens/DashScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <DashScreen />
    </SafeAreaProvider>
  );
}
