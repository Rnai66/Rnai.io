# API Keys Setup for Website Generation

The Website Generation feature requires API keys from third-party providers. Follow these steps to get them set up:

## 1. OpenRouter API Key

OpenRouter is the primary provider for text generation.

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Sign up or log in to your account
3. Go to Settings → API Keys
4. Copy your API key
5. Add to Vercel:
   - Go to your Vercel project settings
   - Click "Environment Variables"
   - Add new variable:
     - Name: `OPENROUTER_API_KEY`
     - Value: (paste your key)
   - Click "Save"
   - Redeploy your project

## 2. Together AI API Key (Optional Fallback)

Together AI is a fallback provider if OpenRouter fails.

1. Go to [https://www.together.ai](https://www.together.ai)
2. Sign up or log in
3. Go to your dashboard
4. Click "API Keys" in the left sidebar
5. Copy your API key
6. Add to Vercel:
   - Go to your Vercel project settings
   - Click "Environment Variables"
   - Add new variable:
     - Name: `TOGETHER_API_KEY`
     - Value: (paste your key)
   - Click "Save"
   - Redeploy your project

## 3. Verify Setup

After adding both keys, redeploy your project:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Redeploy" on the latest deployment, or push a new commit to trigger deployment

## 4. Test Website Generation

1. Go to your Playground: `http://localhost:3000/dashboard/playground` (or your Vercel deployment URL)
2. Select "Website Generate" from the skills dropdown
3. Fill in the form:
   - Website Name: e.g., "My Coffee Shop"
   - Website Type: e.g., "restaurant"
   - Template: e.g., "modern"
   - Description: A detailed description of your website
4. Click "Run Website Generate"

## Troubleshooting

If you still get 500 errors:
- Check Vercel logs: `vercel logs`
- Verify API keys are correctly set (no extra spaces)
- Ensure the API keys are valid (test with their respective web interfaces)
- Check that the provider APIs are accessible from Vercel's IP range

## Cost Considerations

- **OpenRouter**: Rates vary by model, typically $0.001-$0.01 per 1K tokens
- **Together AI**: Free tier available with rate limits, paid plans start at $0.00015 per 1M tokens

Both services offer free trials and generous free tiers for development.
