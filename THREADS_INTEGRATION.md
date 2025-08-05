# Threads Social Media Integration

This document explains how the Threads social media integration works in this application.

## Overview

Threads is owned by Meta (Facebook) and uses the same API as Instagram. Since Threads doesn't have a separate API, we integrate with it through the Instagram Graph API. Posts made to Instagram will also appear on Threads.

## Implementation Details

### API Functions

The Threads integration is implemented in `src/lib/social-media-api-functions/threads/` and includes:

- **OAuth Flow**: Uses Instagram's OAuth flow since Threads is part of Meta's ecosystem
- **Posting**: Posts to Instagram which automatically appear on Threads
- **Account Management**: Fetches account information from Instagram Graph API
- **Media Support**: Supports text, image, and video posts

### Environment Variables Required

The Threads integration uses the same environment variables as Instagram:

```env
SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID=your_instagram_client_id
SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
```

### OAuth Flow

1. User clicks "Connect Threads" in the dashboard
2. They are redirected to Facebook's OAuth page
3. After authorization, they're redirected back to `/oauth2-redirect/threads`
4. The system exchanges the authorization code for an access token
5. Account information is fetched and stored

### Posting to Threads

When a user creates a post and selects Threads as a platform:

1. The system gets the Instagram business account ID
2. Media (images/videos) are uploaded to Instagram
3. The post is published to Instagram
4. The post automatically appears on Threads

### Supported Post Types

- **Text Posts**: Simple text posts
- **Image Posts**: Single images or carousels
- **Video Posts**: Video content with optional cover images

### Limitations

- Threads doesn't have a separate API, so we rely on Instagram's API
- Posts appear on both Instagram and Threads
- Some Threads-specific features may not be available through the Instagram API

## Setup Instructions

1. Create a Facebook App in the Facebook Developer Console
2. Add Instagram Basic Display and Instagram Graph API products
3. Configure the OAuth redirect URI: `https://your-domain.com/oauth2-redirect/threads`
4. Set the required environment variables
5. Ensure your Instagram account is a business account connected to a Facebook page

## Usage

Once configured, users can:

1. Go to Dashboard > Integrations
2. Click "Connect Threads"
3. Complete the OAuth flow
4. Start posting content that will appear on both Instagram and Threads

The integration supports all standard features like scheduling posts, managing multiple accounts, and viewing post analytics.