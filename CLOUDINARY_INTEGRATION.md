# Cloudinary Integration Documentation

## Overview
This document describes the Cloudinary integration implemented to replace Firebase Storage for image and media uploads across the Rnai.io platform.

## Configuration

### Environment Variables (in `.env.local`)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="duxwa4io4"
CLOUDINARY_API_KEY="463534311187134"
CLOUDINARY_API_SECRET="OkWnDcql6iNE6QsQ1wlCkXbRtLg"
```

## Files Created/Modified

### New Files

#### 1. `src/lib/cloudinary.ts`
- Core Cloudinary integration module
- **Functions:**
  - `uploadToCloudinary(imageData, fileName?, folder?)` - Upload image to Cloudinary
  - `getCloudinaryUrl(publicId, options?)` - Generate image URLs with optional transformations
  - `deleteFromCloudinary(publicId)` - Delete images from Cloudinary
- **Returns:** Cloudinary response with secure_url, public_id, and metadata

### Modified Files

#### 2. `src/lib/storage.ts`
- Updated to use Cloudinary as primary storage with Firebase fallback
- **New Functions:**
  - `uploadToCloudinaryStorage()` - Cloudinary-specific upload handler
  - `uploadToFirebaseStorage()` - Firebase-specific upload handler (fallback)
- **Updated Function:**
  - `uploadToStorage()` - Now tries Cloudinary first, falls back to Firebase, then data URLs
- **Upload Path:** `rnai-io/generations/<refId>.png`

## Integration Points

### API Endpoints (Automatic via `uploadToStorage`)

All image generation endpoints automatically use Cloudinary:

1. **`/api/v1/generate`** - Image generation from text prompt
   - Uses: `uploadToStorage(buf, refId, "png")`
   - Example: `/api/v1/generate` POST with prompt

2. **`/api/playground/run`** - Playground skill execution
   - Supports:
     - `image/generate` - Text to image
     - `image/edit` - Image editing
     - `image/remove-background` - Background removal
     - `image/upscale` - Image upscaling
     - `image/stylize` - Image stylization
     - `audio/tts` - Text to speech (MP3)
   - All use: `uploadToStorage(buf, refId, format)`

3. **`/api/v1/website/generate`** - Website generation
   - Uses: `uploadToStorage()` for generated assets
   - Example: `/api/v1/website/generate` POST with website specs

4. **Other image endpoints:**
   - `/api/v1/edit`
   - `/api/v1/remove-background`
   - `/api/v1/upscale`
   - `/api/v1/stylize`

## Upload Priority

1. **Primary:** Cloudinary (if `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_API_KEY` are set)
2. **Fallback 1:** Firebase Storage (if configured)
3. **Fallback 2:** Data URLs (local development only)

## Features

### Automatic Organization
- All uploads stored in `rnai-io/generations/` folder
- Files tagged with `rnai-io` and `generated-image` for easy filtering
- Timestamped for validation

### URL Generation
- Returns `secure_url` from Cloudinary (HTTPS)
- URLs are permanent and publicly accessible
- Optional transformation support (width, height, quality, format)

### Error Handling
- Graceful fallback chain if Cloudinary fails
- Detailed error messages for debugging
- Data URL fallback for local development

## Usage Examples

### Direct Cloudinary Upload (if needed)
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

// Upload from buffer
const response = await uploadToCloudinary(
  imageBuffer,
  'my-image.png',
  'rnai-io/custom-folder'
);
console.log(response.secure_url); // HTTPS URL
```

### Storage Utility (recommended)
```typescript
import { uploadToStorage } from '@/lib/storage';

// Automatic Cloudinary → Firebase → Data URL fallback
const url = await uploadToStorage(imageBuffer, 'ref123', 'png');
```

### Get Transformed URL
```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Generate scaled thumbnail
const thumbUrl = getCloudinaryUrl('rnai-io/generations/ref123', {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
});
```

## Testing Checklist

- [ ] Image generation (`/api/v1/generate`) returns Cloudinary URL
- [ ] Playground image generation returns Cloudinary URL
- [ ] Generated images accessible via returned URLs
- [ ] Multiple concurrent uploads work correctly
- [ ] Error handling gracefully falls back to Firebase if Cloudinary fails
- [ ] Development mode data URLs work if credentials missing
- [ ] Images properly tagged in Cloudinary dashboard
- [ ] Firestore usage logs record correct `outputUrl`

## Migration Notes

- Existing Firebase Storage images continue to work
- New uploads go to Cloudinary
- No data loss - Firebase bucket still available as fallback
- Seamless transition: old and new images can coexist

## Benefits

1. **Reliability:** Cloudinary's dedicated CDN and uptime guarantees
2. **Cost:** Free tier supports significant usage
3. **Performance:** Global CDN distribution
4. **Features:** Built-in image transformations, optimization
5. **Simplicity:** No Firebase bucket configuration needed
6. **Scalability:** Automatic scaling, no quota limits

## Troubleshooting

### Images not uploading
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Verify `CLOUDINARY_API_KEY` is correct
- Check Cloudinary dashboard for upload errors

### Wrong URLs returned
- Ensure `secure_url` is being used (not `url`)
- Verify folder path `rnai-io/generations/` exists
- Check Cloudinary security settings allow unsigned uploads

### Performance issues
- Use `getCloudinaryUrl()` with transformations for thumbnails
- Add `quality: 'auto'` for automatic optimization
- Cache URLs in database to avoid repeated fetches

## Future Enhancements

- [ ] Signed uploads for enhanced security
- [ ] Custom transformation presets (thumbnails, responsive images)
- [ ] Analytics integration (track most-used images)
- [ ] Automatic cleanup of old generated images
- [ ] Webhooks for image processing completion
