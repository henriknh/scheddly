/**
 * Example implementation of X API media upload using the latest v2 API
 * This demonstrates the improved implementation with better error handling,
 * validation, and using existing dependencies like mime-types
 */

import { uploadMedia, validateMediaFile, getMimeType } from "./media-upload-v2";

// Example function to upload media to X (similar to the provided example)
export async function uploadMediaToX(
  buffer: ArrayBuffer,
  mediaType: string,
  bearer: string
): Promise<string> {
  try {
    // Validate the media file before upload
    validateMediaFile(buffer, mediaType);
    
    // Upload the media using the new unified function
    const mediaId = await uploadMedia(buffer, mediaType, bearer);
    
    console.log(`Media uploaded successfully with ID: ${mediaId}`);
    return mediaId;
  } catch (error) {
    console.error("Failed to upload media to X:", error);
    throw error;
  }
}

// Example function to post a tweet with media
export async function postTweetWithMedia(
  text: string,
  mediaIds: string[],
  bearer: string
): Promise<string> {
  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      media: {
        media_ids: mediaIds,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(`Failed to post tweet: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data?.id;
}

// Example usage function
export async function exampleUsage() {
  // Example: Upload an image
  const imageBuffer = new ArrayBuffer(1024); // Your image buffer
  const imageMimeType = "image/jpeg";
  const bearerToken = "your_bearer_token_here";
  
  try {
    // Upload the image
    const mediaId = await uploadMediaToX(imageBuffer, imageMimeType, bearerToken);
    
    // Post a tweet with the image
    const tweetId = await postTweetWithMedia(
      "Check out this amazing image!",
      [mediaId],
      bearerToken
    );
    
    console.log(`Tweet posted successfully with ID: ${tweetId}`);
  } catch (error) {
    console.error("Failed to post tweet with media:", error);
  }
}

// Example: Upload video with chunking (for large files)
export async function uploadVideoExample(videoBuffer: ArrayBuffer, bearer: string) {
  try {
    // The uploadMedia function automatically handles chunking for videos
    const mediaId = await uploadMedia(videoBuffer, "video/mp4", bearer);
    
    // Post tweet with video
    const tweetId = await postTweetWithMedia(
      "Check out this awesome video!",
      [mediaId],
      bearer
    );
    
    console.log(`Video tweet posted successfully with ID: ${tweetId}`);
  } catch (error) {
    console.error("Failed to upload video:", error);
  }
}

// Example: Upload multiple images
export async function uploadMultipleImages(
  imageBuffers: ArrayBuffer[],
  bearer: string
) {
  const mediaIds: string[] = [];
  
  for (let i = 0; i < imageBuffers.length; i++) {
    try {
      const mediaId = await uploadMedia(imageBuffers[i], "image/jpeg", bearer);
      mediaIds.push(mediaId);
      console.log(`Uploaded image ${i + 1}/${imageBuffers.length}`);
    } catch (error) {
      console.error(`Failed to upload image ${i + 1}:`, error);
      throw error;
    }
  }
  
  // Post tweet with all images
  const tweetId = await postTweetWithMedia(
    "Check out these amazing images!",
    mediaIds,
    bearer
  );
  
  console.log(`Multi-image tweet posted successfully with ID: ${tweetId}`);
}