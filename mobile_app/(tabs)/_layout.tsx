import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants/design';
import { useTheme } from '@/context/ThemeContext';

import HomeScreen from '@/screens/home';
import CreateScreen from '@/screens/create';
import ProfileScreen from '@/screens/profile';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.borders,
      paddingBottom: 8,
      paddingTop: 8,
      height: 64,
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="create"
        component={CreateScreen}
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>✨</Text>,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// Import Text for emoji rendering
import { Text } from 'react-native';
