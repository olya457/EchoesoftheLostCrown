import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MenuScreen from '../screens/MenuScreen';
import MapScreen from '../screens/MapScreen';
import LocationsListScreen from '../screens/LocationsListScreen';
import PlaceDescriptionOpenedFavoriteConfirmNotTappedScreen from '../screens/PlaceDescriptionOpenedFavoriteConfirmNotTappedScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import TrackingScreen from '../screens/TrackingScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import SettingsScreen from '../screens/SettingsScreen';

enableScreens(); 

export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  Menu: undefined;

  Map: undefined;
  LocationsList: undefined;
  PlaceDescriptionOpenedFavoriteConfirmNotTapped: {
    placeId?: string;
  };

  Favorite: undefined;
  Tracking: undefined;
  Achievements: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loader"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Loader" component={LoaderScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />

        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="LocationsList" component={LocationsListScreen} />
        <Stack.Screen
          name="PlaceDescriptionOpenedFavoriteConfirmNotTapped"
          component={PlaceDescriptionOpenedFavoriteConfirmNotTappedScreen}
        />

        <Stack.Screen name="Favorite" component={FavoriteScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
