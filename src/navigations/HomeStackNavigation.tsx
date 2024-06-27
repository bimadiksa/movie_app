// File: HomeStackNavigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';
import Favorite from '../screens/Favorite';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigation(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='MovieDetail' component={MovieDetail} />
      <Stack.Screen name='Favorite' component={Favorite} />
    </Stack.Navigator>
  );
}
