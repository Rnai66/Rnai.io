# RNAi Platform

AI Image API platform built with Next.js, Firebase, and Hugging Face.

## Features

- 🔐 User authentication with Firebase
- 🔑 API key management
- 🎨 AI image generation (FLUX.1-schnell)
- ✏️ AI image editing with masks
- 🖼️ Background removal (RMBG-1.4)
- 📱 Modern web interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Hugging Face Inference API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Hugging Face account with API token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rnai-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:
- Firebase configuration from Firebase Console
- Firebase Admin SDK credentials (service account key)
- Hugging Face API token

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore
3. Create a service account and download the JSON key
4. Copy the values to your `.env.local` file

### Hugging Face Setup

1. Sign up at https://huggingface.co/
2. Get your API token from https://huggingface.co/settings/tokens
3. Add it to `HUGGINGFACE_API_TOKEN` in your `.env.local`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm run start
```

## API Endpoints

### Authentication Required
- `GET /api/keys` - List user's API keys
- `POST /api/keys` - Create new API key
- `DELETE /api/keys/[id]` - Deactivate API key

### API Key Required
- `POST /api/v1/generate` - Generate image from prompt
- `POST /api/v1/edit` - Edit image with mask
- `POST /api/v1/remove-background` - Remove image background

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run start
```

## Environment Variables

See `.env.example` for all required environment variables.

## Known Issues

- **Linting**: ESLint 9 compatibility issues with Next.js config. Build succeeds but `npm run lint` may fail. Use `npx eslint src` directly if needed.