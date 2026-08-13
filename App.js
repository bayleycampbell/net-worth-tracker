import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import AssetsScreen from './screens/AssetsScreen';
import LiabilitiesScreen from './screens/LiabilitiesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          tabBarActiveTintColor: '#007AFF',
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={HomeScreen}
          options={{ tabBarLabel: 'Dashboard', tabBarIcon: () => null }}
        />
        <Tab.Screen
          name="Assets"
          component={AssetsScreen}
          options={{ tabBarLabel: 'Assets', tabBarIcon: () => null }}
        />
        <Tab.Screen
          name="Liabilities"
          component={LiabilitiesScreen}
          options={{ tabBarLabel: 'Liabilities', tabBarIcon: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import AssetsScreen from './screens/AssetsScreen';
import LiabilitiesScreen from './screens/LiabilitiesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={HomeScreen} />
        <Tab.Screen name="Assets" component={AssetsScreen} />
        <Tab.Screen name="Liabilities" component={LiabilitiesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
