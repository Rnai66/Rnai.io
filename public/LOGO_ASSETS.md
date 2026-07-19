# Rnai Logo Assets Inventory
*Brand v2 (r-mark) — July 2026*

All brand files live in `/public` and are ready to use. Everything is SVG (infinitely scalable).

---

## Primary Assets

### Wordmark
- **File**: `logo.svg` — 400×100
- **Content**: teal mark + "Rnai" + orange dot + "io"
- **Best for**: headers, docs, presentations

### App Icon (Full Color)
- **File**: `icon.svg` — 512×512, rounded corners (rx 116)
- **Content**: teal gradient square, white "r", orange spark
- **Best for**: favicon, PWA icon (`manifest.json`), avatars
- **Referenced by**: `src/app/layout.tsx` (`icon: "/icon.svg"`), `manifest.json`

### Favicon
- **File**: `favicon.svg` — flat teal version (no gradient) for tiny sizes

---

## Variations

| File | Style | Use on |
|---|---|---|
| `icon-white.svg` | White glyph + orange dot, transparent | Dark/teal backgrounds, splash |
| `icon-monochrome-blue.svg` | All-teal glyph (#0B3945), transparent | Light backgrounds, print |
| `icon-monochrome-orange.svg` | All-orange glyph (#D77757), transparent | Accent contexts, stickers |

---

## Sibling Asset Sets (same mark)

- **Mobile app** (`rnai-mobile/assets/`): `icon.png` 1024 (full-bleed for iOS), `adaptive-icon.png` 1024 (safe-zone foreground for Android), `splash.png` 1284×2778 (mark + wordmark + Thai tagline)
- **CLI / Web UI** (`Rnai-CLI/assets/`): `icon.svg`, `logo.svg`, `icon-{512,256,128,64,32}.png`

## Regenerating PNGs

From any SVG here:

```bash
pip install cairosvg
python3 -c "import cairosvg; cairosvg.svg2png(url='public/icon.svg', write_to='icon-512.png', output_width=512)"
```

## Legacy

The pre-2026 node-network logo (orange hub + blue nodes, `#5769F7`) is retired. Do not use in new material.
