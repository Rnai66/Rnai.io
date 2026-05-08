# Rnai.io Brand Guidelines

## Logo Overview

The Rnai.io logo represents an AI intelligence hub with neural network connections. It combines warmth, innovation, and accessibility—reflecting the platform's mission to democratize AI capabilities.

### Design Concept

- **Central Hub**: Orange node representing the core AI intelligence
- **Connected Nodes**: Blue nodes symbolizing distributed intelligence and connectivity
- **Neural Lines**: Representing data flow and AI processing
- **Modern Simplicity**: Clean, scalable design that works at any size

## Logo Variations

### 1. Primary Logo (Full Color)
- **Use**: Website headers, presentations, marketing materials, large formats
- **File**: `logo.svg`
- **Dimensions**: 400×100px (recommended width)
- **Colors**: 
  - Primary Orange: #D77757
  - Secondary Blue: #5769F7
  - Text: #050505

### 2. Icon Only
- **Use**: Favicons, app icons, navigation, social media, avatars
- **File**: `icon.svg`
- **Dimensions**: Flexible (vectorized)
- **Colors**: Full color with orange primary and blue secondary

### 3. Monochrome (Orange)
- **Use**: Single-color applications, embroidery, engraving, printing
- **Color**: #D77757
- **Files**: Available upon request

### 4. Monochrome (Blue)
- **Use**: Alternative branding contexts
- **Color**: #5769F7
- **Files**: Available upon request

### 5. Inverted (White on Dark)
- **Use**: Dark backgrounds, footer areas, dark mode
- **Colors**: White nodes with orange ring
- **Files**: Available upon request

## Brand Colors

### Primary Colors
| Color | Hex | RGB | Use |
|-------|-----|-----|-----|
| Primary Orange | #D77757 | 215, 119, 87 | Logo, buttons, highlights |
| Secondary Blue | #5769F7 | 87, 105, 247 | Accent elements, nodes |

### Supporting Colors
| Color | Hex | RGB | Use |
|-------|-----|-----|-----|
| Dark Background | #050505 | 5, 5, 5 | Primary background |
| White | #FFFFFF | 255, 255, 255 | Text, clean spaces |

## Logo Usage Guidelines

### ✅ DO

- **Maintain proportions**: Never distort or skew the logo
- **Preserve color values**: Always use exact hex codes provided
- **Provide adequate spacing**: Maintain minimum 20px clear space around logo
- **Scale proportionally**: Resize maintaining width-to-height ratio
- **Use high-quality formats**: SVG for web, PNG for raster graphics
- **Test readability**: Ensure logo is legible at intended size
- **Match brand voice**: Use logo to reinforce warmth and innovation

### ❌ DON'T

- **Don't rotate the logo** unless in specific design compositions
- **Don't change colors** beyond approved variations
- **Don't outline or stroke** the text portion
- **Don't add effects** like shadows, glows, or gradients
- **Don't remove elements** from the icon
- **Don't place on busy backgrounds** that reduce contrast
- **Don't resize elements** individually

## Logo Sizes

### Web Usage
| Purpose | Width | Format | Notes |
|---------|-------|--------|-------|
| Favicon | 32-64px | SVG/PNG | Icon only |
| Navigation Header | 40-60px | SVG/PNG | Icon preferred |
| Website Header | 200-400px | SVG | Full logo recommended |
| Social Media | 200×200px | PNG | Square, icon only |
| App Icon | 192×192px | PNG | Rounded corners acceptable |

### Print Usage
| Purpose | Dimensions | Format | DPI |
|---------|-----------|--------|-----|
| Business Card | 20×20mm | Vector | 300dpi minimum |
| Letterhead | 40×40mm | Vector | 300dpi minimum |
| Poster | Proportional | Vector | 300dpi minimum |
| Presentation Slide | 100-200px width | Vector | Screen resolution |

## File Formats

### SVG (Preferred for Web)
- **Scalable**: Perfect for all sizes
- **File**: `icon.svg`, `logo.svg`
- **Use Case**: Web, digital media, responsive design

### PNG (Raster)
- **Background**: Transparent
- **Sizes Available**: 32px, 64px, 128px, 192px, 256px, 512px
- **Use Case**: Fallback for older browsers, fixed-size displays

### Favicon
- **File**: `icon.svg` (modern) or favicon.ico (legacy)
- **Size**: 16×16px minimum
- **Use Case**: Browser tab, bookmarks

## Application in Design

### Logo Placement
- **Top-left**: Standard position for website headers
- **Centered**: For symmetrical layouts, landing pages
- **Bottom-right**: Footer contexts
- **Navigation**: As app logo for menu and navigation

### Color Combinations
- **Orange on white/light**: Good contrast, professional
- **Orange on dark**: High contrast, energetic
- **Blue on white**: Good contrast, tech-forward
- **White on orange**: Highest contrast, premium

## PWA & App Integration

### Web App Manifest
The `manifest.json` file includes:
- App name and short name
- Theme color: #D77757
- Background color: #FFFFFF
- Multiple icon sizes for different contexts
- App shortcuts for common actions

### iOS Integration
- Apple touch icon: `apple-icon.png` (180×180px)
- Web app capable: Yes
- Status bar style: Default

### Android Integration
- Android icons: Multiple sizes (192×192, 512×512)
- Maskable icons for adaptive display
- App shortcuts support

## Icon Design System

The logo uses a **modular circle-and-node system**:
- **Central circle**: 16px radius (primary)
- **Node circles**: 10px radius (secondary, variable opacity)
- **Connection lines**: 3px stroke width
- **Ring**: 2px stroke, #D77757
- **Outer spacing**: 116px radius for breathing room

This system scales perfectly from favicon (32px) to billboard sizes.

## Brand Voice Integration

The Rnai.io logo represents:
- **Innovation**: Neural network symbolism
- **Warmth**: Orange primary color
- **Connectivity**: Distributed node network
- **Simplicity**: Clean, modern design
- **Accessibility**: Approachable aesthetic

When using the logo, reinforce these qualities in accompanying copy and design.

## Technical Implementation

### Next.js Configuration
```tsx
// In layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};
```

### HTML Meta Tags
```html
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-icon.png">
<link rel="manifest" href="/manifest.json">
```

## Support & Questions

For logo usage questions, design implementations, or custom variations:
- Reference these guidelines
- Maintain brand consistency
- Test at multiple sizes
- Ensure adequate contrast

---

**Version**: 1.0  
**Last Updated**: May 2026  
**Brand Owner**: Rnai.io  
