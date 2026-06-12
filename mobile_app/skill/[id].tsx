import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '@/constants/design';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SkillDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const skillMap: Record<string, { name: string; icon: string; description: string }> = {
    'image-gen': {
      name: 'Generate Image',
      icon: '🎨',
      description: 'Create unique images from text descriptions',
    },
    'image-edit': {
      name: 'Edit Image',
      icon: '✏️',
      description: 'Modify and enhance your images',
    },
    'text-gen': {
      name: 'Generate Text',
      icon: '📝',
      description: 'Write and create content',
    },
  };

  const skill = skillMap[id as string] || {
    name: 'AI Skill',
    icon: '⚡',
    description: 'Process with AI',
  };

  const handleExecute = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`Generated result from: "${input}"`);
    } catch (error) {
      setResult('Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: LAYOUT.screenPadding,
      borderBottomWidth: 1,
      borderBottomColor: colors.borders,
    },
    backButton: {
      padding: SPACING.md,
      marginLeft: -SPACING.md,
    },
    headerTitle: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginLeft: SPACING.lg,
      flex: 1,
    },
    scrollContent: {
      padding: LAYOUT.screenPadding,
      paddingTop: SPACING.xl,
    },
    skillIcon: {
      fontSize: 48,
      marginBottom: SPACING.lg,
      textAlign: 'center',
    },
    skillName: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    skillDescription: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.body,
      textAlign: 'center',
      marginBottom: SPACING.xl,
    },
    sectionLabel: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.md,
      marginTop: SPACING.xl,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.medium,
      borderWidth: 1,
      borderColor: colors.borders,
      padding: SPACING.lg,
      color: colors.text.primary,
      ...TYPOGRAPHY.body,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: SPACING.lg,
    },
    resultCard: {
      marginTop: SPACING.xl,
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    resultText: {
      color: colors.text.inverse,
      ...TYPOGRAPHY.body,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={{ fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{skill.name}</Text>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Text style={styles.skillIcon}>{skill.icon}</Text>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillDescription}>{skill.description}</Text>

        <Text style={styles.sectionLabel}>Input</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your request..."
          placeholderTextColor={colors.text.tertiary}
          value={input}
          onChangeText={setInput}
          editable={!loading}
          multiline
        />

        <Button
          title={loading ? 'Processing...' : 'Execute'}
          onPress={handleExecute}
          disabled={loading || !input.trim()}
          size="large"
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {result && (
          <Card style={styles.resultCard} backgroundColor={colors.primary} padding={SPACING.lg}>
            <Text style={styles.resultText}>{result}</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
