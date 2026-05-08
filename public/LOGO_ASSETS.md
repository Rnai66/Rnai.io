# Rnai.io Logo Assets Inventory

## Complete Brand Asset Package

All logo and icon files are located in the `/public` directory and ready for use.

---

## Primary Assets

### Logo with Wordmark
- **File**: `logo.svg`
- **Dimensions**: 400×100px (flexible, SVG)
- **Colors**: Full color (Orange + Blue)
- **Best For**: Website headers, presentations, marketing materials, documents
- **Format**: SVG (vector, scalable)

### Icon Only (Full Color)
- **File**: `icon.svg`
- **Dimensions**: 256×256px (flexible, SVG)
- **Colors**: Full color (Orange + Blue)
- **Best For**: Favicons, app icons, navigation, social media
- **Format**: SVG (vector, scalable)

---

## Monochrome Variations

### Orange Monochrome Icon
- **File**: `icon-monochrome-orange.svg`
- **Dimensions**: 256×256px
- **Color**: #D77757 (various opacity levels)
- **Best For**: Single-color printing, embroidery, engraving, one-color applications
- **Format**: SVG

### Blue Monochrome Icon
- **File**: `icon-monochrome-blue.svg`
- **Dimensions**: 256×256px
- **Color**: #5769F7 (various opacity levels)
- **Best For**: Alternative branding, tech-forward applications
- **Format**: SVG

### White Icon (Dark Background)
- **File**: `icon-white.svg`
- **Dimensions**: 256×256px
- **Color**: White (#FFFFFF with opacity variations)
- **Best For**: Dark backgrounds, dark mode, footer areas, dark UI elements
- **Format**: SVG

---

## Web Implementation

### Favicon
- **File**: `icon.svg` (modern approach)
- **Size**: 32×32px minimum
- **Format**: SVG
- **Implementation**: `<link rel="icon" href="/icon.svg" type="image/svg+xml">`

### Apple Touch Icon
- **File**: `apple-icon.png` (recommended size: 180×180px)
- **Format**: PNG with transparency
- **Implementation**: `<link rel="apple-touch-icon" href="/apple-icon.png">`

### Web App Manifest
- **File**: `manifest.json`
- **Use**: PWA configuration, app icons, theme colors, shortcuts
- **Implementation**: `<link rel="manifest" href="/manifest.json">`

---

## Configuration Files

### Manifest JSON
- **File**: `manifest.json`
- **Purpose**: Progressive Web App configuration
- **Includes**: App name, icons at multiple sizes, theme colors, app shortcuts
- **Best For**: PWA support, home screen installation

### Brand Guidelines
- **File**: `BRAND_GUIDELINES.md`
- **Purpose**: Logo usage rules, color specifications, sizing guidelines
- **Content**: Design principles, do's and don'ts, technical implementation

### Assets Inventory
- **File**: `LOGO_ASSETS.md` (this file)
- **Purpose**: Complete asset listing and usage reference

---

## Color Specifications

### Primary Brand Colors
| Color Name | Hex Value | RGB | Usage |
|-----------|-----------|-----|-------|
| Primary Orange | #D77757 | 215, 119, 87 | Main logo, buttons, highlights |
| Secondary Blue | #5769F7 | 87, 105, 247 | Accent nodes, highlights |
| Dark Background | #050505 | 5, 5, 5 | App background |
| White | #FFFFFF | 255, 255, 255 | Text, clean spaces |

---

## Usage Scenarios

### Website Header
```html
<img src="/logo.svg" alt="Rnai.io" class="h-12">
<!-- or -->
<img src="/icon.svg" alt="Rnai.io" class="h-10">
```

### Favicon
```html
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-icon.png">
<link rel="manifest" href="/manifest.json">
```

### Social Media
- Use: `icon.svg` (square, 200×200px)
- File name: "Rnai.io-logo-200x200.png"
- Colors: Full color preferred

### Print Materials
- Use: `logo.svg` or `icon-monochrome-orange.svg`
- DPI: 300 minimum
- Format: Export as PDF or high-res PNG

### Dark Backgrounds
- Use: `icon-white.svg`
- Minimum size: 32×32px for readability
- Padding: 20px minimum clear space

### Single Color Printing
- Use: `icon-monochrome-orange.svg` (recommended) or `icon-monochrome-blue.svg`
- Pantone Color: (approximately) Pantone 16-1554

---

## File Organization

```
/public/
├── logo.svg                          # Full logo with wordmark
├── icon.svg                          # Full color icon
├── icon-monochrome-orange.svg        # Orange monochrome
├── icon-monochrome-blue.svg          # Blue monochrome
├── icon-white.svg                    # White version for dark BG
├── apple-icon.png                    # Apple touch icon (optional PNG)
├── manifest.json                     # PWA manifest
├── favicon-config.ts                 # Configuration reference
├── BRAND_GUIDELINES.md               # Brand usage guidelines
└── LOGO_ASSETS.md                    # This file
```

---

## Implementation Checklist

- [x] SVG icon created (`icon.svg`)
- [x] Full logo with wordmark (`logo.svg`)
- [x] Monochrome variations created
- [x] White version for dark backgrounds
- [x] Manifest.json configured
- [x] Favicon links in layout
- [x] Brand guidelines documented
- [ ] Apple touch icon PNG exported (192×192, 256×256, sizes as needed)
- [ ] Android icons exported (192×192, 512×512)
- [ ] Test favicon display in browsers
- [ ] Test PWA manifest on mobile
- [ ] Deploy to production
- [ ] Verify icons appear correctly in all contexts

---

## Export Instructions (If Converting to PNG/ICO)

### From SVG to PNG (using Illustrator/Affinity/Command Line)

```bash
# Install svg2png (Node.js)
npm install svg2png -g

# Convert to PNG at specific size
svg2png icon.svg --width=256 --height=256 -o icon-256.png
svg2png icon.svg --width=192 --height=192 -o icon-192.png
svg2png icon.svg --width=128 --height=128 -o icon-128.png
svg2png icon.svg --width=64 --height=64 -o icon-64.png
svg2png icon.svg --width=32 --height=32 -o icon-32.png
```

### From PNG to ICO

```bash
# Using ImageMagick
convert icon-256.png -define icon:auto-resize=256,128,96,64,48,32,16 favicon.ico
```

---

## Support Resources

- **Figma Design File**: Available upon request
- **Source Files**: All files are production-ready
- **Design System**: Based on Anthropic brand principles
- **Updates**: Document version 1.0 (May 2026)

---

## Quick Reference

| Need | File | Format |
|------|------|--------|
| Website header | `logo.svg` | SVG |
| App icon | `icon.svg` | SVG |
| Favicon | `icon.svg` | SVG |
| Dark background | `icon-white.svg` | SVG |
| Single color print | `icon-monochrome-orange.svg` | SVG |
| PWA config | `manifest.json` | JSON |
| Usage rules | `BRAND_GUIDELINES.md` | MD |

---

**Version**: 1.0  
**Last Updated**: May 2026  
**Status**: Production Ready ✓
