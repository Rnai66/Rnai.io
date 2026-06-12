# Rnai.io Mobile App Design System
## iOS-style Native Design for React Native / SwiftUI

---

## 📱 Overview

**Platform:** iOS + Android (iOS-first design, Android Material Design translation provided)
**Framework Recommendation:** React Native or Flutter (both support iOS design patterns)
**Design Paradigm:** iOS 17+ Human Interface Guidelines
**Target Devices:** iPhone 12-16 Pro (base: 390px width)

---

## 🎨 Color System

### Brand Colors (Primary Scheme)
```
Primary Orange:      #D77757 (terra cotta)
Secondary Blue:      #5769F7 (vibrant blue)
Background:          #FFFFFF
Surface:            #F9F8F7
Text Primary:       #1A1A1A
Text Secondary:     #6B6B6B
Divider:           #E5E5E5 (0.15 opacity)
```

### Modern Alternative Palette (Optional)
```
Primary Blue:        #378ADD (iOS-like blue)
Secondary Green:     #639922 (success-like)
Accent Amber:        #BA7517 (warm accent)
Background:          #FFFFFF
Surface:            #F2F2F2
Text Primary:       #000000
Text Secondary:     #666666
Divider:           #DDDDDD
```

### Usage Guidelines
- **Primary Color (#D77757 or #378ADD):** Buttons, active states, key CTAs, accent elements
- **Secondary Color (#5769F7 or #639922):** Supporting elements, badges, secondary actions
- **Surfaces (#F9F8F7):** Cards, section backgrounds, secondary containers
- **Text:** Use --color-text-primary for labels, --color-text-secondary for hints/descriptions

---

## 📐 Typography

### Font Stack
```
System Font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
Backup: "Helvetica Neue", sans-serif
```

### Scale (iOS-style)
| Usage | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Large Title | 32px | 700 | 1.2 |
| Title 1 | 28px | 700 | 1.2 |
| Title 2 | 22px | 700 | 1.3 |
| Title 3 | 20px | 600 | 1.4 |
| Headline | 17px | 600 | 1.4 |
| Body | 17px | 400 | 1.5 |
| Callout | 16px | 500 | 1.5 |
| Subheadline | 15px | 400 | 1.4 |
| Footnote | 13px | 400 | 1.4 |
| Caption 1 | 12px | 400 | 1.4 |
| Caption 2 | 11px | 400 | 1.4 |

### Usage Rules
- **Headers:** Title 2 or Title 3 (22px-20px, weight 700/600)
- **Button Text:** Body (17px), weight 600
- **Card Titles:** Headline (17px), weight 600
- **Descriptions:** Subheadline (15px), weight 400
- **Labels:** Footnote (13px), weight 400
- **Hints:** Caption 1 (12px), weight 400

---

## 🏗️ Layout & Spacing

### Safe Areas (iOS Notch/Dynamic Island)
```
Top:    20px (status bar + notch)
Left:   16px (edge margin)
Right:  16px (edge margin)
Bottom: 34px (home indicator) + navigation bar
```

### Spacing Scale
```
8px   - Small gaps (internal component spacing)
12px  - Regular gaps (between elements)
16px  - Medium gaps (section spacing)
20px  - Large gaps (major section breaks)
24px  - Extra large (major divisions)
```

### Component Sizing
| Component | Height | Min Width |
|-----------|--------|-----------|
| Nav Item | 50px | 44px |
| Button | 44px | 100px |
| Text Input | 44px | 100% |
| Card | Variable | 100% (16px margin) |
| Section Header | 32px | - |
| List Item | 56px | - |

---

## 🧭 Navigation Structure

### Bottom Tab Navigation (iOS Standard)
```
Tab Bar Height: 64px (including safe area)
Tab Item Size: Equal width based on number of tabs

Tabs:
1. Home (ti-home)
   - Dashboard
   - Credits balance
   - Quick stats
   - Recent activity

2. Create (ti-wand or ti-sparkles)
   - Playground for AI skills
   - Image generation
   - Text manipulation
   - Audio processing
   - Website generation

3. Profile (ti-user)
   - User account info
   - Language settings
   - Billing/credits
   - Sign out
```

### Navigation Behavior
- **Tab persistence:** Current tab state persists when switching
- **Deep linking:** Direct navigation to feature from external links
- **Back gesture:** iOS swipe-back to previous screen
- **Modal presentations:** Settings, detail views open as modals/sheets

---

## 🎯 Screen Specifications

### 1. Home / Dashboard Screen

**Layout:**
```
Status Bar (20px)
├─ Title Section (16px padding)
│  └─ "Rnai.io" + date/time badge
├─ Stats Grid (2 columns)
│  ├─ This Month: Generations count
│  └─ Total Used: Credits count
├─ Primary CTA
│  └─ "Start Creating" button (full width, primary color)
├─ Quick Links Section
│  ├─ Image Generation
│  ├─ AI Skills
│  └─ View All
└─ Bottom Tab Navigation (64px safe area)
```

**Components:**
- **Stat Card (60x80px each)**
  - Label: Caption 1, secondary text
  - Value: Title 3 (20px), primary color
  - Icon: Optional (16x16px)
  - Background: Surface color
  - Corner radius: 12px
  - Border: 0.5px divider color

- **Primary Button**
  - Height: 44px
  - Radius: 12px
  - Text: Body, weight 600, white
  - Background: Primary color
  - Padding: 0 16px
  - Active state: 85% opacity

- **Quick Link Item**
  - Height: 56px
  - Flex layout: icon (24px) + label + chevron
  - Icon color: Primary
  - Gap: 12px

### 2. Create / Playground Screen

**Layout:**
```
Status Bar (20px)
├─ Section Header
│  └─ "Choose a Skill"
├─ Skill List (vertical stack)
│  ├─ Skill Card Item
│  │  ├─ Icon (24x24px)
│  │  ├─ Name (Headline, 17px)
│  │  ├─ Description (Footnote, 13px)
│  │  └─ Chevron (right)
│  └─ ... (repeat for each skill)
└─ Bottom Tab Navigation (64px safe area)
```

**Skill Card Item:**
- Height: 56px
- Layout: Horizontal flex
- Icon: 24x24px, primary color
- Text Area: Flex-grow
  - Title: Headline (17px, 600)
  - Desc: Subheadline (15px, 400, secondary text)
- Chevron: ti-chevron-right (18px, secondary text)
- Divider: 0.5px bottom border
- Touch target: Full height, min 44px
- Active: 95% opacity on tap

**Skills Included:**
1. **Image Generation** - Create images from text prompts
2. **Image Edit** - Modify and enhance images
3. **Remove Background** - Extract subjects from backgrounds
4. **Upscale** - Increase image resolution
5. **Stylize** - Apply artistic styles
6. **Text Generate** - Write and create text content
7. **Text Summarize** - Condense long text
8. **Text Translate** - Translate between languages
9. **Text Rewrite** - Rephrase content
10. **Audio TTS** - Convert text to speech

### 3. Profile / Settings Screen

**Layout:**
```
Status Bar (20px)
├─ User Avatar Section
│  ├─ Avatar (60x60px circle)
│  ├─ Name (Title 2, 22px)
│  └─ Email (Footnote, 13px, secondary)
├─ Account Settings Group
│  ├─ Credits Card
│  │  ├─ Icon + Label + Value + Chevron
│  │  └─ Divider
│  ├─ Language Card
│  │  └─ ...
│  └─ About App Card
├─ Danger Zone
│  └─ Sign Out Button (outline, red text)
└─ Bottom Tab Navigation (64px safe area)
```

**Settings Item:**
- Height: 52px
- Layout: icon (18px) + label + value + chevron
- Icon color: Primary
- Label: Subheadline (15px, 600)
- Value: Caption 1 (13px, secondary)
- Chevron: ti-chevron-right (18px)
- Divider: 0.5px bottom (last item: no divider)

**User Avatar:**
- Size: 60x60px
- Background: Secondary color
- Border: None
- Text: Initials (white, 22px, 600)
- Alternative: Profile photo with 4px border

**Sign Out Button:**
- Height: 44px
- Style: Outline
- Border: 1px red / #FF3B30
- Text: Red (#FF3B30), weight 600
- Background: Transparent
- Radius: 12px
- Tap feedback: Red tint at 20% opacity

---

## 🎨 Component Library

### 1. Cards

**Surface Card (for grouping)**
```
Background: var(--color-background-secondary) (#F9F8F7)
Border: 0.5px var(--color-border-tertiary)
Padding: 12px 14px
Radius: 12px
Shadow: None (flat design)
```

**Feature Card (with icon)**
```
Layout: Horizontal flex
├─ Icon (24x24px, primary color)
├─ Content (flex-grow)
│  ├─ Title (Headline)
│  └─ Description (Subheadline)
└─ Action (chevron or toggle)
Height: 52-56px
```

### 2. Buttons

**Primary Button**
```
Height: 44px
Padding: 0 16px
Background: var(--primary-color)
Text: white, 17px, weight 600
Radius: 12px
States:
  - Default: 100% opacity
  - Pressed: 0.8 opacity, scale(0.98)
  - Disabled: 0.5 opacity
Touch Target: Min 44x44px
```

**Secondary Button (Outline)**
```
Height: 44px
Padding: 0 16px
Background: transparent
Border: 0.5px var(--color-border-secondary)
Text: var(--color-text-primary), 17px, weight 600
Radius: 12px
States:
  - Default: transparent
  - Pressed: 0.1 opacity background
  - Disabled: 0.3 opacity
```

**Danger Button (Sign Out)**
```
Same as Secondary
Border: 1px #FF3B30
Text: #FF3B30
```

### 3. Form Elements

**Text Input**
```
Height: 44px
Padding: 12px 14px
Border: 0.5px var(--color-border-tertiary)
Radius: 12px
Background: var(--color-background-secondary)
Font: Body, 17px
Placeholder: Secondary text, 0.5 opacity
Focus:
  - Border: 0.5px var(--color-border-primary)
  - Background: 1px border color
Disabled:
  - Background: surface color
  - Text: secondary text (0.3 opacity)
```

**Segmented Control (Picker)**
```
Height: 32px
Background: Surface color
Selected item:
  - Background: Primary color
  - Text: white
  - Radius: 8px
Unselected:
  - Text: secondary text
  - No background
Gap: 4px between items
```

### 4. Cells & Lists

**List Item**
```
Height: 44px minimum (56px with subtitle)
Padding: 12px horizontal
Layout: Icon? (24px) + Content (flex) + Accessory (18px)
Divider: 0.5px bottom
Font: Headline (17px) + optional Subheadline (15px)
Tap animation: 95% opacity, slight scale
Accessory: Chevron, toggle, or value badge
```

**Divider**
```
Height: 0.5px
Color: var(--color-border-tertiary)
Full width (no indentation on lists)
Margin: 0 (integrates with spacing)
```

### 5. Badges & Pills

**Inline Badge**
```
Padding: 4px 8px
Border-radius: 4px
Font: Caption 1 (12px)
Background: Primary color at 15% opacity
Text: Primary color
Examples: "2 new", "Premium", "Available"
```

**Tag/Pill**
```
Padding: 6px 12px
Border-radius: 16px
Font: Footnote (13px)
Background: Primary color at 10% opacity
Text: Primary color
Used in: Skill categories, language tags
```

---

## 📱 Device-Specific Adaptations

### iPhone Safe Areas
```
iPhone 12/13/14/15 (standard):
- Top: 47px (notch area)
- Bottom: 34px (home indicator)
- Sides: 0px (full width)

iPhone 14/15 Pro (Dynamic Island):
- Top: 59px (varies based on content)
- Bottom: 34px
- Sides: 0px

Minimum safe margins: 16px left/right
```

### Gesture Support
```
Back Gesture: iOS swipe-back enabled on all screens
Tab Press: Tap twice to scroll to top
Long Press: Future: quick actions menu on cards
Swipe: Future: card swiping for actions
```

### Safe Area Insets
```
Use React Native SafeAreaView:
<SafeAreaView edges={["top", "bottom"]}>
  {/* Content automatically inset */}
</SafeAreaView>
```

---

## 🎯 Typography & Text Styles

### iOS-Style Text Specifications

**Display (Large Title)**
- Size: 32px | Weight: 700 | Line Height: 39px
- Usage: Full-screen titles, onboarding

**Headline (Prominent)**
- Size: 17px | Weight: 600 | Line Height: 22px
- Usage: Section headers, card titles, button text

**Body (Regular)**
- Size: 17px | Weight: 400 | Line Height: 22px
- Usage: Descriptive text, list content, longer copy

**Callout (Emphasis)**
- Size: 16px | Weight: 500 | Line Height: 21px
- Usage: Important content, labels in cells

**Subheadline (Secondary)**
- Size: 15px | Weight: 400 | Line Height: 20px
- Usage: Secondary titles, subtitles

**Caption 1 (Small)**
- Size: 13px | Weight: 400 | Line Height: 18px
- Usage: Labels, hints, metadata

**Caption 2 (Tiny)**
- Size: 11px | Weight: 400 | Line Height: 13px
- Usage: Very small text, timestamps

---

## 🔄 Interactions & Animations

### Standard Durations
```
Tap feedback: 100ms
Screen transition: 300ms
Sheet present: 350ms
Scroll momentum: Natural (iOS default)
```

### Feedback Patterns
```
Tap: 0.9 scale + 0.15 opacity reduction (50ms), snap back
Hold: Haptic feedback (medium, 30ms)
Swipe: Momentum-based with spring decay
Scroll: Deceleration curve (natural, iOS feel)
```

### Haptic Feedback Points
```
- Tab selection: Light impact
- Button press: Medium impact
- Dangerous action (sign out): Strong impact
- Success message: 2x Light taps
- Swipe back: Light pop
```

---

## ♿ Accessibility

### Minimum Touch Targets
- All interactive elements: 44x44px minimum
- Text: 16px minimum for body copy
- Color contrast: WCAG AA (4.5:1 text, 3:1 UI)
- Keyboard navigation: Full VoiceOver support

### VoiceOver Labels
```
<button
  accessibilityLabel="Create new image"
  accessibilityRole="button"
  onPress={() => navigate('create')}
>
  Start Creating
</button>
```

### Semantic Structure
- Use native components (ScrollView, FlatList)
- Logical navigation order
- Descriptive labels on all icons
- Alternative text for images

---

## 🛠️ Implementation Notes

### React Native Approach
```javascript
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { BottomTabNavigator } from '@react-navigation/bottom-tabs';

// Use native iOS components
// Implement SafeAreaView for notch handling
// Use native BottomTabNavigator for tab bar
```

### Recommended Libraries
```
Navigation: @react-navigation/native + @react-navigation/bottom-tabs
UI Components: React Native Paper or Tamagui
Icons: react-native-vector-icons (SFSymbols for iOS)
Styling: StyleSheet API or TailwindCSS
State: Redux or Zustand
```

### iOS-Specific Considerations
```
- Use System fonts (San Francisco)
- Implement native tab bar with UITabBar
- Support Dynamic Type for accessibility
- Handle Safe Areas automatically
- Use native gestures (swipe back)
- Deploy to TestFlight first
```

### Android Material Design 3 Translation
```
Changes for Android:
- Top navigation bar instead of bottom tabs
- Material You colors instead of custom palette
- Hamburger menu instead of tab bar
- Rounded corners: 12dp (consistent)
- Elevation/shadows: Material default
- Ripple feedback instead of iOS scale animation
```

---

## 📐 Responsive Breakpoints

| Device | Width | Note |
|--------|-------|------|
| iPhone SE | 375px | Min width, adjust spacing |
| iPhone 12-15 | 390px | Base target (6.1") |
| iPhone Pro Max | 430px | Max width, generous spacing |
| iPad (landscape) | 1024px | Split-view support (future) |

---

## 🎨 Visual Hierarchy

### Primary Focus Areas
1. **Top:** Action buttons (Create, Share)
2. **Middle:** Content cards (stats, features)
3. **Bottom:** Secondary actions, information

### Visual Weight
```
Highest: Primary buttons, stat numbers (large, bold)
High: Headers, icons (prominent placement, color)
Medium: Subheadings, descriptions (secondary text color)
Low: Dividers, hints (0.5px borders, faint gray)
```

---

## 📝 Spacing Grid

Use 4px baseline grid for consistency:

```
Micro: 4px (8px = 2 units)
Small: 12px (3 units)
Medium: 16px (4 units)
Large: 20px (5 units)
XL: 24px (6 units)
```

All component spacing aligns to this grid.

---

## ✅ Design Checklist

- [ ] All buttons are 44x44px minimum
- [ ] Tab bar height: 64px with safe area
- [ ] Primary color used consistently
- [ ] All text uses predefined sizes
- [ ] Dividers: 0.5px borders only
- [ ] Corner radius: 12px standard (8px for buttons, 16px for modals)
- [ ] Touch feedback on all interactive elements
- [ ] VoiceOver labels on all icons
- [ ] Safe area insets handled
- [ ] Both color schemes validated
- [ ] Dark mode support tested (future)
- [ ] iPad layout considered (future)

---

## 🚀 Next Steps

1. **Setup React Native project**
   ```bash
   npx create-expo-app rnai-mobile
   cd rnai-mobile
   npm install @react-navigation/native @react-navigation/bottom-tabs
   ```

2. **Create component library**
   - Button component
   - Card component
   - SettingsItem component
   - StatCard component

3. **Implement screens**
   - HomeScreen
   - PlaygroundScreen
   - ProfileScreen

4. **Setup navigation**
   - BottomTabNavigator
   - Screen transitions
   - Deep linking

5. **Connect API**
   - Use existing `/api/v1/*` endpoints
   - Implement image upload (Cloudinary)
   - Add authentication flow

6. **Test on devices**
   - iPhone 12 (baseline)
   - iPhone 14 Pro (Dynamic Island)
   - iPad (split-view, future)

---

**Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Ready for Implementation ✅
