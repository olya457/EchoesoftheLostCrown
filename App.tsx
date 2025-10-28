import React from 'react';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { FavoritesProvider } from './src/store/favoritesStore';
import { ConfirmProvider } from './src/store/confirmStore';
import { MusicProvider } from './src/context/MusicContext';

export default function App() {
  return (
    <FavoritesProvider>
      <ConfirmProvider>
        <MusicProvider>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
        </MusicProvider>
      </ConfirmProvider>
    </FavoritesProvider>
  );
}
