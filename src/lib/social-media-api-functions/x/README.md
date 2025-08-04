# X (Twitter) API Integration

This directory contains the X (Twitter) API integration functions for the social media scheduling platform.

## Media Upload Implementation

### New Implementation (v2)

The media upload functionality has been reimplemented using:
- `axios` for HTTP requests
- `form-data` for multipart form data
- `mime-types` for MIME type handling
- Chunked buffer upload for large files

#### Key Features

1. **Unified Media Upload**: Single `uploadMedia()` function handles both images and videos
2. **Chunked Upload**: Large files are automatically split into 1MB chunks
3. **Processing Status Monitoring**: Automatically waits for media processing to complete
4. **Error Handling**: Comprehensive error handling with detailed logging

#### Usage

```typescript
import { uploadImage, uploadVideo } from './media-upload-v2';

// Upload an image
const imageBuffer = Buffer.from(imageData);
const mediaId = await uploadImage(imageBuffer, 'image/jpeg', accessToken);

// Upload a video
const videoBuffer = Buffer.from(videoData);
const mediaId = await uploadVideo(videoBuffer, 'video/mp4', accessToken);
```

#### Implementation Details

The new implementation follows the X API v2 media upload flow:

1. **Initialize**: Create a media upload session
2. **Append**: Upload media data in chunks using FormData
3. **Finalize**: Complete the upload
4. **Monitor**: Check processing status until complete

#### Files

- `media-upload-v2.ts` - New implementation using axios and form-data
- `chunk-buffer.ts` - Utility for chunking large buffers
- `post-image.ts` - Updated to use new media upload
- `post-video.ts` - Updated to use new media upload

### Legacy Implementation

The original implementation using fetch API is still available in `media-upload.ts` for reference.

## API Functions

- `postText()` - Post text-only tweets
- `postImage()` - Post tweets with images
- `postVideo()` - Post tweets with videos
- `deletePost()` - Delete tweets
- `fetchAccountInfoByAccessToken()` - Get account information
- `oauthPageUrl()` - Generate OAuth URL
- `consumeAuthorizationCode()` - Handle OAuth callback
- `refreshAccessTokenAndUpdateSocialMediaIntegration()` - Refresh access tokens
- `revokeTokens()` - Revoke access tokens

## Authentication

All API calls require a valid access token. The platform handles token refresh automatically through the `getValidAccessToken()` function.

## Rate Limiting

The implementation includes built-in delays between chunk uploads to respect X's rate limits, especially important for free tier accounts.