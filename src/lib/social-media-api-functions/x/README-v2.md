# X API Media Upload Implementation v2

This is an improved implementation of the X API media upload functionality that uses the latest v2 API endpoints and best practices.

## Key Improvements

### 1. **Latest API Endpoints**
- Uses the current X API v2 endpoints: `/2/media/upload/initialize`, `/2/media/upload/{media_id}/append`, `/2/media/upload/{media_id}/finalize`
- Follows the official X API documentation structure

### 2. **Better Error Handling**
- Comprehensive error handling with detailed error messages
- Proper HTTP status code handling
- Graceful fallbacks for network issues

### 3. **File Validation**
- Built-in file size validation (5MB for images, 512MB for videos)
- MIME type validation using the `mime-types` library
- Automatic file type detection

### 4. **Improved Chunking**
- Automatic chunking for large files (videos)
- Configurable chunk sizes
- Rate limiting protection with delays between chunks

### 5. **Status Monitoring**
- Exponential backoff for status checking
- Proper handling of processing states (pending, in_progress, succeeded, failed)
- Timeout protection

## Comparison with Provided Example

### Original Example:
```javascript
const axios = require('axios');
const FormData = require('form-data');
const mime = require('mime-types');

async function uploadMedia(buffer, mediaType, bearer) {
  const totalBytes = buffer.length;
  const isVideo = mediaType.startsWith('video');
  const category = isVideo ? 'tweet_video' : 'tweet_image';

  const init = await axios.post(
    'https://api.x.com/2/media/upload/initialize',
    { media_type: mediaType, media_category: category, total_bytes: totalBytes },
    { headers: { Authorization: `Bearer ${bearer}` } }
  );
  const mediaId = init.data.data.id;

  const chunks = chunkBuffer(buffer);
  for (let i = 0; i < chunks.length; i++) {
    const fd = new FormData();
    fd.append('media', chunks[i], { filename: 'chunk' });
    fd.append('segment_index', i.toString());

    await axios.post(
      `https://api.x.com/2/media/upload/${mediaId}/append`,
      fd,
      { headers: { Authorization: `Bearer ${bearer}`, ...fd.getHeaders() } }
    );
  }

  const fin = await axios.post(
    `https://api.x.com/2/media/upload/${mediaId}/finalize`,
    null,
    { headers: { Authorization: `Bearer ${bearer}` } }
  );

  if (fin.data.data.processing_info) {
    let info = fin.data.data.processing_info;
    while (['pending', 'in_progress'].includes(info.state)) {
      await new Promise(r => setTimeout(r, info.check_after_secs * 1000));
      const status = await axios.get(
        'https://api.x.com/2/media/upload',
        { params: { media_id: mediaId }, headers: { Authorization: `Bearer ${bearer}` } }
      );
      info = status.data.data.processing_info;
      if (info.state === 'failed') throw new Error('Media processing failed');
    }
  }

  return mediaId;
}
```

### New Implementation:
```typescript
import { uploadMedia, validateMediaFile } from "./media-upload-v2";

async function uploadMediaToX(buffer: ArrayBuffer, mediaType: string, bearer: string): Promise<string> {
  // Validate file before upload
  validateMediaFile(buffer, mediaType);
  
  // Single function handles everything: initialization, chunking, finalization, status checking
  const mediaId = await uploadMedia(buffer, mediaType, bearer);
  
  return mediaId;
}
```

## Key Differences

| Aspect | Original Example | New Implementation |
|--------|------------------|-------------------|
| **Dependencies** | axios, form-data, mime-types | Uses existing mime-types, native fetch |
| **Error Handling** | Basic try-catch | Comprehensive error handling with detailed messages |
| **File Validation** | None | Built-in size and type validation |
| **Status Checking** | Basic polling | Exponential backoff with proper state handling |
| **Chunking** | Manual implementation | Automatic with configurable chunk sizes |
| **Rate Limiting** | No protection | Built-in delays between chunks |
| **TypeScript** | JavaScript | Full TypeScript support with proper types |

## Usage Examples

### Upload Image
```typescript
import { uploadMedia, validateMediaFile } from "./media-upload-v2";

const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());
validateMediaFile(imageBuffer, "image/jpeg");
const mediaId = await uploadMedia(imageBuffer, "image/jpeg", accessToken);
```

### Upload Video
```typescript
const videoBuffer = await fetch(videoUrl).then(r => r.arrayBuffer());
validateMediaFile(videoBuffer, "video/mp4");
const mediaId = await uploadMedia(videoBuffer, "video/mp4", accessToken);
```

### Post Tweet with Media
```typescript
const response = await fetch("https://api.x.com/2/tweets", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "Check out this media!",
    media: { media_ids: [mediaId] },
  }),
});
```

## File Structure

```
src/lib/social-media-api-functions/x/
├── media-upload-v2.ts          # Main media upload implementation
├── post-image-v2.ts            # Image posting with new implementation
├── post-video-v2.ts            # Video posting with new implementation
├── example-usage.ts            # Usage examples
└── README-v2.md               # This documentation
```

## Features

- ✅ **Latest X API v2 endpoints**
- ✅ **Automatic file validation**
- ✅ **Built-in chunking for large files**
- ✅ **Exponential backoff for status checking**
- ✅ **Rate limiting protection**
- ✅ **Comprehensive error handling**
- ✅ **TypeScript support**
- ✅ **Uses existing dependencies**
- ✅ **Proper logging and debugging**

## API Limits

- **Images**: Maximum 5MB
- **Videos**: Maximum 512MB
- **Supported formats**: JPEG, PNG, GIF, MP4, MOV
- **Rate limits**: Built-in delays to respect API limits

## Error Handling

The implementation includes comprehensive error handling for:
- Network failures
- Invalid file types/sizes
- API rate limits
- Processing failures
- Timeout scenarios

All errors include detailed messages to help with debugging and user feedback.