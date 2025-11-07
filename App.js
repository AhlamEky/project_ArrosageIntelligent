// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AppProvider, { useApp } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ControlsScreen from './screens/ControlsScreen';
import AlertsScreen from './screens/AlertsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReclamationsScreen from './screens/ReclamationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { signout } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#071033' },
        tabBarActiveTintColor: '#7dd3fc',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'Dashboard') iconName = 'bar-chart';
          if (route.name === 'Controls') iconName = 'toggle';
          if (route.name === 'Alerts') iconName = 'warning';
          if (route.name === 'Settings') iconName = 'settings';
          if (route.name === 'Reclamations') iconName = 'chatbubble-ellipses';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Statistiques' }} />
      <Tab.Screen name="Controls" component={ControlsScreen} options={{ title: 'Contrôle' }} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Seuils' }} />
      <Tab.Screen name="Reclamations" component={ReclamationsScreen} options={{ title: 'Réclamations' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, authLoading, theme } = useApp();
  // choose navigation theme
  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  if (authLoading) {
    // small loading placeholder
    return null;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AppProvider>
  );
}
