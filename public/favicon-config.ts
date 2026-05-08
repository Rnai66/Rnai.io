/**
 * Favicon and Icon Configuration for Rnai.io
 * Place these in your next.config.js or use in layout.tsx metadata
 */

export const iconConfig = {
  // For favicon
  favicon: '/icon.svg',

  // For apple-touch-icon (iOS home screen)
  appleIcon: '/apple-icon.png',

  // For Android Chrome
  androidIcon: '/android-icon.png',

  // Manifest for PWA
  manifest: '/manifest.json',
};

// For next.js 13+ metadata API
export const metadata = {
  title: 'Rnai.io - AI Skills Platform',
  description: 'Generate, edit, translate, and extract using the worlds best AI models',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};
