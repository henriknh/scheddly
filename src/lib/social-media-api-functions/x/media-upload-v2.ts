"use server";

import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime-types';
import { chunkBuffer } from './chunk-buffer';

const xApiUrl = 'https://api.x.com';

export interface MediaUploadOptions {
  accessToken: string;
  mediaCategory: "tweet_image" | "tweet_video";
  mediaType: string;
  totalBytes: number;
}

export interface MediaUploadResult {
  mediaId: string;
  success: boolean;
  error?: string;
}

/**
 * Upload media to X (Twitter) using the v2 API with chunked upload
 * @param buffer - Buffer from MinIO or other source
 * @param mediaType - MIME type of the media
 * @param bearer - Bearer token for authentication
 * @returns Promise<string> - The media ID
 */
export async function uploadMedia(buffer: Buffer, mediaType: string, bearer: string): Promise<string> {
  const totalBytes = buffer.length;
  const isVideo = mediaType.startsWith('video');
  const category = isVideo ? 'tweet_video' : 'tweet_image';

  console.log(`Initializing media upload: ${category}, type: ${mediaType}, size: ${totalBytes} bytes`);

  // Step 1: Initialize media upload
  const init = await axios.post(
    `${xApiUrl}/2/media/upload/initialize`,
    { 
      media_type: mediaType, 
      media_category: category, 
      total_bytes: totalBytes 
    },
    { 
      headers: { 
        Authorization: `Bearer ${bearer}` 
      } 
    }
  );
  
  const mediaId = init.data.data.id;
  console.log(`Media upload initialized with ID: ${mediaId}`);

  // Step 2: Upload media in chunks
  const chunks = chunkBuffer(buffer);
  console.log(`Uploading media in ${chunks.length} chunks`);

  for (let i = 0; i < chunks.length; i++) {
    const fd = new FormData();
    fd.append('media', chunks[i], { filename: 'chunk' });
    fd.append('segment_index', i.toString());

    await axios.post(
      `${xApiUrl}/2/media/upload/${mediaId}/append`,
      fd,
      { 
        headers: { 
          Authorization: `Bearer ${bearer}`, 
          ...fd.getHeaders() 
        } 
      }
    );

    console.log(`Chunk ${i + 1}/${chunks.length} uploaded successfully`);
  }

  // Step 3: Finalize media upload
  const fin = await axios.post(
    `${xApiUrl}/2/media/upload/${mediaId}/finalize`,
    null,
    { 
      headers: { 
        Authorization: `Bearer ${bearer}` 
      } 
    }
  );

  console.log(`Media upload finalized for ${mediaId}`);

  // Step 4: Check processing status if needed
  if (fin.data.data.processing_info) {
    let info = fin.data.data.processing_info;
    console.log(`Media ${mediaId} processing state: ${info.state}`);

    while (['pending', 'in_progress'].includes(info.state)) {
      await new Promise(r => setTimeout(r, info.check_after_secs * 1000));
      
      const status = await axios.get(
        `${xApiUrl}/2/media/upload`,
        { 
          params: { media_id: mediaId }, 
          headers: { 
            Authorization: `Bearer ${bearer}` 
          } 
        }
      );
      
      info = status.data.data.processing_info;
      console.log(`Media ${mediaId} processing state: ${info.state}`);
      
      if (info.state === 'failed') {
        const errorMessage = info.error?.message || 'Unknown error';
        console.error(`Media ${mediaId} processing failed:`, errorMessage);
        throw new Error(`Media processing failed: ${errorMessage}`);
      }
    }

    if (info.state === 'succeeded') {
      console.log(`Media ${mediaId} processing completed successfully`);
    }
  } else {
    console.log(`Media ${mediaId} ready (no processing required)`);
  }

  return mediaId;
}

/**
 * Upload image to X (Twitter)
 * @param imageBuffer - Buffer containing the image data
 * @param mimeType - MIME type of the image
 * @param accessToken - Access token for authentication
 * @returns Promise<string> - The media ID
 */
export async function uploadImage(imageBuffer: Buffer, mimeType: string, accessToken: string): Promise<string> {
  return uploadMedia(imageBuffer, mimeType, accessToken);
}

/**
 * Upload video to X (Twitter)
 * @param videoBuffer - Buffer containing the video data
 * @param mimeType - MIME type of the video
 * @param accessToken - Access token for authentication
 * @returns Promise<string> - The media ID
 */
export async function uploadVideo(videoBuffer: Buffer, mimeType: string, accessToken: string): Promise<string> {
  return uploadMedia(videoBuffer, mimeType, accessToken);
}