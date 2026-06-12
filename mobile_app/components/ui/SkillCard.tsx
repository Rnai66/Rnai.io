import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';

interface SkillCardProps {
  icon: string;
  name: string;
  description: string;
  onPress: () => void;
}

export function SkillCard({ icon, name, description, onPress }: SkillCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.medium,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      alignItems: 'center',
      minHeight: TOUCH_TARGET_MIN,
      borderWidth: 1,
      borderColor: colors.borders,
    },
    icon: {
      fontSize: 32,
      marginRight: SPACING.lg,
      width: 44,
      textAlign: 'center',
    },
    content: {
      flex: 1,
    },
    name: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.xs,
    },
    description: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.caption,
    },
    arrow: {
      color: colors.text.tertiary,
      fontSize: 20,
      marginLeft: SPACING.md,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}
