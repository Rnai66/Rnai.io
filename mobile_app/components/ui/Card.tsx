import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  backgroundColor?: string;
}

export function Card({
  children,
  padding = SPACING.lg,
  backgroundColor,
  style,
  ...props
}: CardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: backgroundColor || colors.surface,
      borderRadius: BORDER_RADIUS.medium,
      padding,
      borderWidth: 1,
      borderColor: colors.borders,
    },
  });

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}
