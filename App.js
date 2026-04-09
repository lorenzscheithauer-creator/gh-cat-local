import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import Top10Screen from './src/screens/Top10Screen';
import SearchScreen from './src/screens/SearchScreen';
import MoreScreen from './src/screens/MoreScreen';
import DetailScreen from './src/screens/DetailScreen';
import KategorieDetailScreen from './src/screens/KategorieDetailScreen';
import VeranstalterDetailScreen from './src/screens/VeranstalterDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#031733',
    card: '#081a3a',
    text: '#ffffff',
    border: 'rgba(255,255,255,0.08)',
    primary: '#21c8f6',
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator detachInactiveScreens={true}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.68)',
        lazy: true,
        freezeOnBlur: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 78,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 0,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: '#081a3a',
          elevation: 0,
          shadowOpacity: 0.16,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarIcon: ({ color, size, focused }) => {
          let icon = 'circle-outline';

          if (route.name === 'Start') icon = focused ? 'home' : 'home-outline';
          if (route.name === 'Kategorien') icon = focused ? 'view-grid' : 'view-grid-outline';
          if (route.name === 'Top 10') icon = focused ? 'trophy' : 'trophy-outline';
          if (route.name === 'Suche') icon = focused ? 'magnify' : 'magnify';
          if (route.name === 'Veranstalter') icon = focused ? 'office-building' : 'office-building-outline';

          return <MaterialCommunityIcons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Start" component={HomeScreen} />
      <Tab.Screen name="Kategorien" component={CategoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Top 10" component={Top10Screen} />
      <Tab.Screen name="Suche" component={SearchScreen} />
      <Tab.Screen name="Veranstalter" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
        sceneContainerStyle: { backgroundColor: '#031733' },
        contentStyle: { backgroundColor: '#031733' },
          headerStyle: { backgroundColor: '#031733', backgroundColor: '#031733' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '900' },
          contentStyle: { backgroundColor: '#031733' },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Gewinnspiel' }}
        />
        <Stack.Screen
          name="KategorieDetail"
          component={KategorieDetailScreen}
          options={{ title: 'Kategorie' }}
        />
        <Stack.Screen
          name="VeranstalterDetail"
          component={VeranstalterDetailScreen}
          options={{ title: 'Veranstalter' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
