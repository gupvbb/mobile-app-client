import React from 'react';
import { View } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <DashboardScreen />
    </View>
  );
}