import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function SkillDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const id = (route.params as any)?.id;
  const { colors } = useTheme();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

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
      icon: 'document-text-outline',
      description: 'Write and create content',
    },
    'website-gen': {
      name: 'Generate Website',
      icon: 'laptop-outline',
      description: 'Build a beautiful website using AI',
    },
  };

  const skill = skillMap[id as string] || {
    name: 'AI Skill',
    icon: '⚡',
    description: 'Process with AI',
  };

  const handleExecute = async () => {
    if (!input.trim() && !image) return;

    setLoading(true);
    setResult(null);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.48:3000';
      const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

      if (!API_KEY) {
        throw new Error('Please set EXPO_PUBLIC_API_KEY in your .env file');
      }

      let endpoint = '';
      let payload: any = {};

      if (id === 'image-gen') {
        endpoint = `${API_URL}/api/v1/generate`;
        payload = { prompt: input };
      } else if (id === 'text-gen') {
        endpoint = `${API_URL}/api/v1/text/generate`;
        payload = { prompt: input };
      } else if (id === 'image-edit') {
        endpoint = `${API_URL}/api/v1/edit`;
        payload = { image: image, mask: image, prompt: input };
      } else if (id === 'remove-bg') {
        endpoint = `${API_URL}/api/v1/remove-background`;
        payload = { image: image };
      } else if (id === 'upscale') {
        endpoint = `${API_URL}/api/v1/upscale`;
        payload = { image: image };
      } else if (id === 'website-gen') {
        endpoint = `${API_URL}/api/v1/website/generate`;
        payload = { 
           websiteName: "My Website", 
           websiteType: "portfolio", 
           template: "modern", 
           description: input,
           websiteCustomPrompt: input,
           websiteImage: image || undefined,
           websiteImageUsage: "design-reference"
        };
      } else {
        throw new Error('Skill API endpoint not configured in app yet');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute skill');
      }

      if (data.url) {
        setResult(data.url);
      } else if (data.html) {
        setResult("✅ เว็บไซต์สร้างสำเร็จแล้ว! (โค้ด HTML ความยาว " + data.html.length + " ตัวอักษร) เนื่องจากเป็นแอปมือถือ กรุณานำโค้ดหรือ API ไปดูพรีวิวบนแพลตฟอร์มเว็บหลักครับ");
      } else if (data.text) {
        setResult(data.text);
      } else {
        setResult('Success: ' + JSON.stringify(data));
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
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
    inputWrapper: {
      position: 'relative',
      marginBottom: SPACING.lg,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.medium,
      borderWidth: 1,
      borderColor: colors.borders,
      padding: SPACING.lg,
      color: colors.text.primary,
      ...TYPOGRAPHY.body,
      minHeight: 120,
      textAlignVertical: 'top',
      paddingBottom: 50,
    },
    imagePickerButton: {
      position: 'absolute',
      bottom: SPACING.md,
      right: SPACING.md,
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.borders,
    },
    imagePreviewContainer: {
      position: 'relative',
      marginBottom: SPACING.lg,
      alignSelf: 'flex-start',
    },
    imagePreview: {
      width: 120,
      height: 120,
      borderRadius: BORDER_RADIUS.medium,
      borderWidth: 1,
      borderColor: colors.borders,
    },
    removeImageButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: colors.background,
      borderRadius: 12,
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
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
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your request..."
            placeholderTextColor={colors.text.tertiary}
            value={input}
            onChangeText={setInput}
            editable={!loading}
            multiline
          />
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={loading}>
            <Ionicons name="image-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)} disabled={loading}>
              <Ionicons name="close-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        <Button
          title={loading ? 'Processing...' : 'Execute'}
          onPress={handleExecute}
          disabled={loading || (!input.trim() && !image)}
          size="large"
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={36} color={colors.primary} />
          </View>
        )}

        {result && (
          <Card style={styles.resultCard} backgroundColor={colors.primary} padding={SPACING.lg}>
            {result.startsWith('http') || result.startsWith('data:image') ? (
              <Image source={{ uri: result }} style={{ width: '100%', height: 300, borderRadius: BORDER_RADIUS.medium }} resizeMode="contain" />
            ) : (
              <Text style={styles.resultText}>{result}</Text>
            )}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
