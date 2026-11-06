import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { MenuProvider } from './src/context/MenuContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <MenuProvider>
      <HomeScreen />
      <StatusBar style="light" />
    </MenuProvider>
  );
}
