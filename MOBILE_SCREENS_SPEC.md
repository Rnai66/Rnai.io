# Rnai.io Mobile App - Detailed Screen Specifications
## Implementation Guide with Code Examples

---

## 📱 Screen 1: Home / Dashboard

### Purpose
Quick overview of credits, stats, and quick access to main features.

### Layout Map
```
┌─────────────────────────────────┐
│ Status Bar (20px)               │
├─────────────────────────────────┤
│ [Rnai.io]  📍 9:41  Today       │ (16px padding)
├─────────────────────────────────┤
│ ✨ 450 Credits available        │
│                                 │
│ ┌──────────┬──────────┐         │
│ │  This    │  Total   │         │
│ │ Month    │  Used    │         │
│ │   12     │  2,340   │         │
│ │  Gens    │ Credits  │         │
│ └──────────┴──────────┘         │
│                                 │
│ [    Start Creating    ]        │ (Primary button)
│                                 │
│ Quick Features                  │
│ ├─ 📷 Image Generation         │
│ │  Create from text             │
│ ├─ ✨ AI Skills               │
│ │  10+ tools available          │
│                                 │
├─────────────────────────────────┤
│ [Home] [Create] [Profile]       │ (Bottom tab)
└─────────────────────────────────┘
```

### Components

**Header**
```jsx
// Rnai.io | Time | Today badge
<View style={styles.headerContainer}>
  <Text style={styles.headerTitle}>Rnai.io</Text>
  <View style={styles.headerRight}>
    <Text style={styles.time}>9:41</Text>
    <Text style={styles.dateBadge}>Today</Text>
  </View>
</View>
```

**Credits Balance Card**
```jsx
<Card style={styles.creditCard}>
  <View style={styles.creditContent}>
    <Text style={styles.creditLabel}>✨ Credits Available</Text>
    <Text style={styles.creditValue}>450</Text>
    <TouchableOpacity>
      <Text style={styles.creditAction}>Buy More →</Text>
    </TouchableOpacity>
  </View>
</Card>
```

**Stats Grid** (2 columns)
```jsx
<View style={styles.statsGrid}>
  <StatCard
    label="This Month"
    value="12"
    subtitle="Generations"
    icon="📷"
  />
  <StatCard
    label="Total Used"
    value="2,340"
    subtitle="Credits"
    icon="⚡"
  />
</View>
```

**StatCard Component**
```jsx
export const StatCard = ({ label, value, subtitle, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statValueContainer}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: '#F9F8F7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#D77757',
    marginLeft: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
});
```

**Quick Links Section**
```jsx
<View style={styles.quickLinksSection}>
  <Text style={styles.sectionTitle}>Quick Features</Text>
  
  <FeatureLink
    icon="📷"
    title="Image Generation"
    description="Create from text"
    onPress={() => navigate('Create', { skill: 'image-generate' })}
  />
  
  <FeatureLink
    icon="✨"
    title="AI Skills"
    description="10+ tools available"
    onPress={() => navigate('Create')}
  />
</View>
```

**FeatureLink Component**
```jsx
export const FeatureLink = ({ icon, title, description, onPress }) => (
  <TouchableOpacity
    style={styles.featureLink}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.featureLinkContent}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
    <Text style={styles.featureChevron}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  featureLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  featureLinkContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  featureChevron: {
    fontSize: 18,
    color: '#6B6B6B',
  },
});
```

---

## 📱 Screen 2: Create / Playground

### Purpose
Browse and select AI skills, execute them, view results.

### Layout Map
```
┌─────────────────────────────────┐
│ Status Bar (20px)               │
├─────────────────────────────────┤
│ Choose a Skill                  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │📷 Image Generation      [›] │ │ ← Tap to open
│ │   Create images from text   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │✏️  Image Edit           [›] │ │
│ │   Modify existing images    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │🪄 Remove Background     [›] │ │
│ │   Clean extraction          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │⬆️  Upscale              [›] │ │
│ │   Increase resolution       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │🎨 Stylize              [›] │ │
│ │   Apply artistic styles     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │✍️  Text Generate        [›] │ │
│ │   Write & create content    │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [Home] [Create] [Profile]       │ (Bottom tab)
└─────────────────────────────────┘
```

### Main List Component
```jsx
import { FlatList } from 'react-native';

const skills = [
  {
    id: 'image-generate',
    icon: '📷',
    name: 'Image Generation',
    description: 'Create images from text',
    category: 'image',
  },
  {
    id: 'image-edit',
    icon: '✏️',
    name: 'Image Edit',
    description: 'Modify existing images',
    category: 'image',
  },
  // ... more skills
];

export const PlaygroundScreen = ({ navigation }) => (
  <FlatList
    data={skills}
    renderItem={({ item }) => (
      <SkillListItem
        skill={item}
        onPress={() => navigation.navigate('SkillDetail', { skillId: item.id })}
      />
    )}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.listContent}
    scrollEnabled={true}
  />
);

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
});
```

**SkillListItem Component**
```jsx
export const SkillListItem = ({ skill, onPress }) => (
  <TouchableOpacity
    style={styles.skillItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.skillContent}>
      <Text style={styles.skillIcon}>{skill.icon}</Text>
      <View style={styles.skillTextContainer}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillDescription}>{skill.description}</Text>
      </View>
    </View>
    <Text style={styles.skillChevron}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#F9F8F7',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  skillContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillIcon: {
    fontSize: 24,
  },
  skillName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  skillDescription: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  skillChevron: {
    fontSize: 18,
    color: '#6B6B6B',
    marginLeft: 8,
  },
});
```

---

## 📱 Screen 3: Skill Detail / Execution

### Purpose
Execute the selected skill with input parameters.

### Layout: Image Generation (Example)
```
┌─────────────────────────────────┐
│ < Image Generation              │
├─────────────────────────────────┤
│ Enter your prompt               │ (Section header)
│                                 │
│ ┌─────────────────────────────┐ │
│ │ A beautiful sunset over...  │ │ (Placeholder)
│ │ ☐                           │ │ (Multiline input)
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│ 0 / 2000 characters            │ (Char count)
│                                 │
│ Advanced Options ▼              │ (Expandable)
│                                 │
│ [    Generate Image    ]        │ (Primary button)
│                                 │
│ ═══════════════════════════════ │ (Or result if generating)
│ ⏳ Generating... (3s elapsed)   │
│ [Cancel]                        │
│ ═══════════════════════════════ │
│                                 │
└─────────────────────────────────┘
```

**Prompt Input**
```jsx
<TextInput
  style={styles.promptInput}
  placeholder="A beautiful sunset over..."
  placeholderTextColor="#999"
  multiline={true}
  numberOfLines={4}
  maxLength={2000}
  value={prompt}
  onChangeText={setPrompt}
  textAlignVertical="top"
/>

<Text style={styles.charCount}>
  {prompt.length} / 2000 characters
</Text>
```

**Generation Status**
```jsx
{isGenerating && (
  <View style={styles.generatingContainer}>
    <ActivityIndicator size="large" color="#D77757" />
    <Text style={styles.generatingText}>
      Generating... ({elapsedSeconds}s)
    </Text>
    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => cancelGeneration()}
    >
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}

{result && (
  <View style={styles.resultContainer}>
    <Image
      source={{ uri: result.url }}
      style={styles.resultImage}
      resizeMode="contain"
    />
    <View style={styles.resultActions}>
      <Button title="Save" onPress={() => saveImage(result.url)} />
      <Button title="Share" onPress={() => shareImage(result.url)} />
      <Button
        title="Regenerate"
        onPress={() => generateAgain()}
        variant="outline"
      />
    </View>
  </View>
)}
```

**Submit Button**
```jsx
<TouchableOpacity
  style={[
    styles.submitButton,
    !isValid && styles.submitButtonDisabled,
  ]}
  onPress={handleGenerate}
  disabled={!isValid || isGenerating}
>
  <Text style={styles.submitButtonText}>
    {isGenerating ? 'Generating...' : 'Generate Image'}
  </Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  submitButton: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#D77757',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
});
```

---

## 📱 Screen 4: Profile / Settings

### Purpose
User account info, preferences, billing, and sign out.

### Layout Map
```
┌─────────────────────────────────┐
│ Status Bar (20px)               │
├─────────────────────────────────┤
│            [👤]                 │
│          John Dev               │
│        john@example.com         │
│                                 │
│ ┌─────────────────────────────┐ │
│ │💳 Credits           450 [›] │ │
│ ├─────────────────────────────┤ │
│ │🌐 Language        English [›]│ │
│ ├─────────────────────────────┤ │
│ │ℹ️  About App        v1.0 [›] │ │
│ └─────────────────────────────┘ │
│                                 │
│ [   Sign Out   ]                │ (Danger style)
│                                 │
├─────────────────────────────────┤
│ [Home] [Create] [Profile]       │ (Bottom tab)
└─────────────────────────────────┘
```

**User Header Section**
```jsx
<View style={styles.userHeader}>
  <View style={styles.avatarContainer}>
    <Text style={styles.avatarText}>
      {getInitials(user.name)}
    </Text>
  </View>
  <Text style={styles.userName}>{user.name}</Text>
  <Text style={styles.userEmail}>{user.email}</Text>
</View>

const styles = StyleSheet.create({
  userHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5769F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B6B6B',
  },
});
```

**Settings Group**
```jsx
<Card style={styles.settingsCard}>
  <SettingItem
    icon="💳"
    label="Credits"
    value="450 available"
    onPress={() => navigate('Billing')}
  />
  <Divider />
  
  <SettingItem
    icon="🌐"
    label="Language"
    value="English"
    onPress={() => openLanguagePicker()}
  />
  <Divider />
  
  <SettingItem
    icon="ℹ️"
    label="About App"
    value="v1.0.0"
    onPress={() => navigate('About')}
  />
</Card>
```

**SettingItem Component**
```jsx
export const SettingItem = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingItemContent}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingValue}>{value}</Text>
      </View>
    </View>
    <Text style={styles.settingChevron}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  settingItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  settingChevron: {
    fontSize: 18,
    color: '#6B6B6B',
  },
});
```

**Sign Out Button**
```jsx
<TouchableOpacity
  style={styles.signOutButton}
  onPress={handleSignOut}
>
  <Text style={styles.signOutText}>Sign Out</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  signOutButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signOutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
```

---

## 🧩 Shared Components

### Button Component
```jsx
export const Button = ({ title, onPress, variant = 'primary', disabled = false, icon }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'outline' && styles.buttonOutline,
      disabled && styles.buttonDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
  >
    {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
    <Text style={[
      styles.buttonText,
      variant === 'outline' && styles.buttonOutlineText,
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#D77757',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  buttonOutlineText: {
    color: '#1A1A1A',
  },
  buttonIcon: {
    fontSize: 16,
  },
});
```

### Card Component
```jsx
export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    paddingHorizontal: 14,
    paddingVertical: 0,
    overflow: 'hidden',
  },
});
```

### Divider Component
```jsx
export const Divider = () => (
  <View style={styles.divider} />
);

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: '#E5E5E5',
  },
});
```

---

## 🔌 API Integration

### Image Generation API Call
```jsx
async function generateImage(prompt) {
  try {
    const response = await fetch('https://rnai-io.vercel.app/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data.url; // Cloudinary URL
  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
}
```

### Playground Run Endpoint
```jsx
async function runSkill(skillId, inputs) {
  const response = await fetch('https://rnai-io.vercel.app/api/playground/run', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      skill: skillId,
      ...inputs,
    }),
  });

  return response.json();
}
```

---

## 📦 Project Structure

```
rnai-mobile/
├── app/
│   ├── _layout.tsx              (Root navigator)
│   ├── (tabs)/
│   │   ├── home.tsx             (Home screen)
│   │   ├── create.tsx           (Playground screen)
│   │   ├── profile.tsx          (Profile screen)
│   │   └── _layout.tsx          (Tab navigator)
│   ├── skill/
│   │   └── [skillId].tsx        (Skill detail screen)
│   └── +not-found.tsx           (404 fallback)
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── StatCard.tsx
│   ├── SkillListItem.tsx
│   ├── SettingItem.tsx
│   └── Divider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useAPI.ts
│   └── useCredits.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── storage.ts
├── styles/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── utils/
│   ├── validation.ts
│   └── formatters.ts
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Setup React Native/Expo project
- [ ] Create component library
- [ ] Setup navigation structure
- [ ] Implement Home screen
- [ ] Style system and colors

### Phase 2: Features (Week 3-4)
- [ ] Playground screen with skill list
- [ ] Skill detail screens (first 3 skills)
- [ ] Image generation with API
- [ ] Profile screen

### Phase 3: Polish (Week 5-6)
- [ ] All 10+ skills integrated
- [ ] Error handling and validation
- [ ] Loading states and animations
- [ ] Image caching and optimization

### Phase 4: Platform (Week 7-8)
- [ ] TestFlight builds (iOS)
- [ ] Beta testing
- [ ] Performance optimization
- [ ] App Store submission

---

**Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Ready for Development ✅
