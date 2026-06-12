import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { SkillCard } from '../components/ui/SkillCard';

interface Skill {
  id: string;
  icon: string;
  name: string;
  description: string;
}

const SKILLS: Skill[] = [
  {
    id: 'image-gen',
    icon: 'color-palette-outline',
    name: 'Generate Image',
    description: 'Create unique images from text',
  },
  {
    id: 'image-edit',
    icon: 'pencil-outline',
    name: 'Edit Image',
    description: 'Modify and enhance images',
  },
  {
    id: 'remove-bg',
    icon: 'crop-outline',
    name: 'Remove Background',
    description: 'Clean background removal',
  },
  {
    id: 'upscale',
    icon: 'expand-outline',
    name: 'Upscale Image',
    description: 'Enhance resolution quality',
  },
  {
    id: 'stylize',
    icon: 'color-wand-outline',
    name: 'Stylize Image',
    description: 'Apply artistic styles',
  },
  {
    id: 'text-gen',
    icon: 'document-text-outline',
    name: 'Generate Text',
    description: 'Write and create content',
  },
  {
    id: 'text-sum',
    icon: 'list-outline',
    name: 'Summarize Text',
    description: 'Condense lengthy content',
  },
  {
    id: 'text-trans',
    icon: 'globe-outline',
    name: 'Translate Text',
    description: 'Multi-language translation',
  },
  {
    id: 'text-rewrite',
    icon: 'refresh-outline',
    name: 'Rewrite Text',
    description: 'Rephrase your content',
  },
  {
    id: 'website-gen',
    icon: 'laptop-outline',
    name: 'Generate Website',
    description: 'Build a website using AI',
  },
  {
    id: 'audio-tts',
    icon: 'volume-high-outline',
    name: 'Text to Speech',
    description: 'Convert text to audio',
  },
];

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');

  const filteredSkills = SKILLS.filter(skill =>
    skill.name.toLowerCase().includes(searchText.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchText.toLowerCase())
  );

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
      marginBottom: SPACING.xl,
    },
    title: {
      color: colors.text.primary,
      ...TYPOGRAPHY.display,
    },
    subtitle: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.subheadline,
      marginTop: SPACING.sm,
    },
    searchContainer: {
      marginBottom: SPACING.xl,
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.medium,
      borderWidth: 1,
      borderColor: colors.borders,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      color: colors.text.primary,
      ...TYPOGRAPHY.body,
      minHeight: 44,
    },
    skillsLabel: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.lg,
    },
    skillsList: {
      marginBottom: SPACING.xxl,
    },
    emptyText: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.body,
      textAlign: 'center',
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
        <View style={styles.header}>
          <Text style={styles.title}>Playground</Text>
          <Text style={styles.subtitle}>Select a skill to get started</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills..."
            placeholderTextColor={colors.text.tertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Skills List */}
        {filteredSkills.length > 0 ? (
          <View style={styles.skillsList}>
            <Text style={styles.skillsLabel}>Available Skills</Text>
            {filteredSkills.map(skill => (
              <SkillCard
                key={skill.id}
                icon={skill.icon}
                name={skill.name}
                description={skill.description}
                onPress={() => (navigation as any).navigate('Skill', { id: skill.id })}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No skills found</Text>
        )}
      </ScrollView>
    </View>
  );
}
