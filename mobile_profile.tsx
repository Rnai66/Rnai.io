import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

interface SettingItem {
  label: string;
  value?: string;
  onPress?: () => void;
  isDanger?: boolean;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme, toggleScheme } = useTheme();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: () => {
          // Handle sign out
          Alert.alert('Signed out', 'You have been signed out.');
        },
        style: 'destructive',
      },
    ]);
  };

  const settingItems: SettingItem[] = [
    { label: 'Credits', value: '450' },
    { label: 'Email', value: 'user@rnai.io' },
    { label: 'Language', value: 'English' },
    { label: 'Theme', value: scheme === 'brand' ? 'Brand' : 'Modern', onPress: toggleScheme },
    { label: 'About', value: 'v0.1.0' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom + LAYOUT.tabBarHeight,
    },
    scrollContent: {
      padding: LAYOUT.screenPadding,
      paddingTop: SPACING.xl,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    avatarText: {
      color: colors.text.inverse,
      fontSize: 32,
    },
    username: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.xs,
    },
    email: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.subheadline,
    },
    sectionLabel: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.lg,
      marginTop: SPACING.xl,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borders,
    },
    settingLabel: {
      color: colors.text.primary,
      ...TYPOGRAPHY.body,
    },
    settingValue: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.subheadline,
    },
    dangerButton: {
      marginTop: SPACING.xl,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.text.inverse} />
          </View>
          <Text style={styles.username}>Rnai User</Text>
          <Text style={styles.email}>user@rnai.io</Text>
        </View>

        {/* Account Settings */}
        <Text style={styles.sectionLabel}>Account</Text>
        <Card padding={0}>
          {settingItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              disabled={!item.onPress}
              activeOpacity={item.onPress ? 0.7 : 1}
              style={[
                styles.settingItem,
                index === settingItems.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingValue}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Help Section */}
        <Text style={styles.sectionLabel}>Help</Text>
        <Card padding={0}>
          <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Help', 'Visit rnai.io/help for support')}
          >
            <Text style={styles.settingLabel}>Get Help</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Privacy', 'Your data is protected')}
          >
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </Card>

        {/* Sign Out */}
        <View style={styles.dangerButton}>
          <Button
            title="Sign Out"
            variant="danger"
            size="large"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </View>
  );
}
