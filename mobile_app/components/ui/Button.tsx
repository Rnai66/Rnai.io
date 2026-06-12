import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, TOUCH_TARGET_MIN } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.borders;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return colors.primary;
    }
    return colors.text.inverse;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      borderRadius: 8,
      minHeight: TOUCH_TARGET_MIN,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: variant === 'outline' ? 1.5 : 0,
      borderColor: variant === 'outline' ? colors.primary : 'transparent',
      opacity: disabled ? 0.5 : 1,
      ...getPadding(),
    },
    text: {
      color: getTextColor(),
      ...TYPOGRAPHY.callout,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
