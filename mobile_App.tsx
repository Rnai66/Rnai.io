import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { ThemeProvider } from './app/context/ThemeContext';
import { COLORS, SPACING } from './app/constants/design';
import { useTheme } from './app/context/ThemeContext';

import HomeScreen from './app/screens/home';
import CreateScreen from './app/screens/create';
import ProfileScreen from './app/screens/profile';
import SkillDetailScreen from './app/skill/[id]';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
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
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Skill"
        component={SkillDetailScreen}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
