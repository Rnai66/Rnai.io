import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

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
      marginRight: SPACING.lg,
      width: 44,
      justifyContent: 'center',
      alignItems: 'center',
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
      <View style={styles.icon}>
        <Ionicons name={icon as any} size={32} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} style={{ marginLeft: SPACING.md }} />
    </TouchableOpacity>
  );
}
