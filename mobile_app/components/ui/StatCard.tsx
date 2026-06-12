import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.medium,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.borders,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },
    value: {
      color: colors.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.xs,
    },
    label: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.caption,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
