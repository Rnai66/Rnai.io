import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, scheme } = useTheme();

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
      marginBottom: SPACING.xxl,
    },
    greeting: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.subheadline,
      marginBottom: SPACING.sm,
    },
    title: {
      color: colors.text.primary,
      ...TYPOGRAPHY.display,
    },
    creditsCard: {
      marginBottom: SPACING.xxl,
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    creditsValue: {
      color: colors.text.inverse,
      ...TYPOGRAPHY.display,
      marginBottom: SPACING.sm,
    },
    creditsLabel: {
      color: colors.text.inverse,
      ...TYPOGRAPHY.subheadline,
      opacity: 0.9,
    },
    statsContainer: {
      marginBottom: SPACING.xxl,
    },
    statsLabel: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.lg,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    statColumn: {
      flex: 1,
    },
    quickLinksLabel: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.lg,
    },
    quickLinksContainer: {
      gap: SPACING.md,
      marginBottom: SPACING.xxl,
    },
    quickLink: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.borders,
    },
    quickLinkIcon: {
      marginRight: SPACING.lg,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickLinkContent: {
      flex: 1,
    },
    quickLinkTitle: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
    },
    quickLinkDesc: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.caption,
      marginTop: SPACING.xs,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        {/* Credits Card */}
        <Card
          style={styles.creditsCard}
          padding={SPACING.xl}
          backgroundColor={colors.primary}
        >
          <Text style={styles.creditsValue}>450</Text>
          <Text style={styles.creditsLabel}>Credits Available</Text>
        </Card>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statColumn}>
              <StatCard label="Generations" value="12" />
            </View>
            <View style={styles.statColumn}>
              <StatCard label="Credits Used" value="2.3k" />
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View>
          <Text style={styles.quickLinksLabel}>Quick Access</Text>
          <View style={styles.quickLinksContainer}>
            <TouchableOpacity
              style={styles.quickLink}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Create')}
            >
              <View style={styles.quickLinkIcon}>
                <Ionicons name="color-palette-outline" size={28} color={colors.primary} />
              </View>
              <View style={styles.quickLinkContent}>
                <Text style={styles.quickLinkTitle}>Generate Image</Text>
                <Text style={styles.quickLinkDesc}>Create with AI</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLink}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Create')}
            >
              <View style={styles.quickLinkIcon}>
                <Ionicons name="apps-outline" size={28} color={colors.primary} />
              </View>
              <View style={styles.quickLinkContent}>
                <Text style={styles.quickLinkTitle}>View All Skills</Text>
                <Text style={styles.quickLinkDesc}>Explore 10+ tools</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Button
            title="Start Creating →"
            onPress={() => navigation.navigate('Create')}
            size="large"
          />
        </View>
      </ScrollView>
    </View>
  );
}
