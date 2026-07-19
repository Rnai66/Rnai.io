# Rnai Brand Guidelines
*Updated: July 2026 — brand v2 (r-mark)*

## Logo Overview

The Rnai logo is a geometric lowercase **"r"** with an **orange spark dot**, set on a deep teal rounded square. The "r" stands for Rnai; the orange dot represents the spark of AI intelligence — the moment an idea lights up. The design is minimal, modern, and instantly recognizable at any size.

### Design Concept

- **The "r" glyph**: Clean geometric strokes with rounded terminals — friendly and approachable
- **The spark dot**: Single orange accent (#D77757) — the AI moment, also reads as the period in "Rnai."
- **Teal field**: Deep gradient (#11505F → #0B3945) — calm, trustworthy, technical
- **Minimal by default**: One glyph, one accent, generous whitespace

## Logo Variations

### 1. Primary Wordmark
- **File**: `logo.svg` (400×100)
- **Layout**: Mark + "Rnai" (bold, near-black #171717) + orange dot + "io" (regular, gray #737373)
- **Use**: Website headers, presentations, documents

### 2. App Icon (Full Color)
- **File**: `icon.svg` (512×512, rounded 116px)
- **Use**: Favicons, app icons, avatars, social profiles
- **Note**: For iOS, export full-bleed square (the OS applies its own corner mask)

### 3. White (for dark backgrounds)
- **File**: `icon-white.svg` — white glyph + orange dot, transparent background
- **Use**: Dark UI surfaces, splash screens, teal/black backgrounds

### 4. Monochrome
- **Files**: `icon-monochrome-blue.svg` (teal #0B3945), `icon-monochrome-orange.svg` (#D77757)
- **Use**: Single-color print, engraving, watermarks

## Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary (accent) | Orange | `#D77757` |
| Brand field | Deep Teal | `#0B3945` |
| Brand field (light stop) | Teal | `#11505F` |
| Ink (text on light) | Near-black | `#171717` |
| Secondary text | Gray | `#737373` |
| Hairlines / borders | Light gray | `#E5E5E5` |
| Surface | White | `#FFFFFF` |

Legacy secondary blue `#5769F7` is **retired** in brand v2. Use teal + orange only.

## Typography

- **UI / Web**: system stack — `-apple-system, 'Inter', 'Segoe UI', sans-serif`
- **Thai**: `Sarabun` (Google Fonts) pairs with the brand across print and app
- **Wordmark weight**: Bold (700), letter-spacing −2% for "Rnai"; Regular (400) for "io"

## Usage Rules

**Do**
- Keep clear space around the mark ≥ 25% of its height
- Use `icon-white.svg` on teal/dark surfaces
- Keep the orange dot — it is part of the mark, not decoration

**Don't**
- Recolor the glyph or dot outside the palette
- Add shadows, outlines, or gradients to the glyph
- Stretch, rotate, or place the full-color icon on busy imagery
- Use the legacy node-network logo (pre-2026) in new material

## Cross-product Consistency

The same mark is used across the ecosystem:
- **rnai.io web** — favicon + header (`/public`)
- **Rnai Mobile** — app icon, adaptive icon, splash (`rnai-mobile/assets`)
- **Rnai-CLI Web UI** — navbar + favicon (`Rnai-CLI/assets`)
