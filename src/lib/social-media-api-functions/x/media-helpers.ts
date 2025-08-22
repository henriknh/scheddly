"use server";

import { xApiUrl } from "./index";

export async function fetchBlobByFileId(
  fileId: string,
  fallbackMimeType: string
): Promise<{ blob: Blob; mimeType: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Missing API URL");

  const fileResp = await fetch(`${apiUrl}/api/file/${fileId}`);
  if (!fileResp.ok) {
    const errText = await fileResp.text().catch(() => "");
    console.error("Failed to load media from storage:", errText);
    throw new Error("Failed to load media from storage");
  }
  const blob = await fileResp.blob();
  const mimeType =
    blob.type && blob.type.length > 0 ? blob.type : fallbackMimeType;
  return { blob, mimeType };
}

export async function initializeUpload(
  accessToken: string,
  mediaType: string,
  totalBytes: number,
  mediaCategory: "tweet_image" | "tweet_video" | "tweet_gif"
): Promise<string> {
  const resp = await fetch(`${xApiUrl}/2/media/upload/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_type: mediaType,
      total_bytes: totalBytes,
      media_category: mediaCategory,
    }),
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => null);
    console.error("Failed to INIT upload to X:", error);
    throw new Error("Failed to INIT upload to X");
  }
  const data = await resp.json();
  const mediaId: string | undefined = data?.data?.id;
  if (!mediaId) {
    console.error("INIT response missing media id", data);
    throw new Error("INIT response missing media id");
  }
  return mediaId;
}

export async function appendChunk(
  accessToken: string,
  mediaId: string,
  chunk: Blob,
  segmentIndex: number,
  filename: string
): Promise<void> {
  const form = new FormData();
  form.append("segment_index", String(segmentIndex));
  form.append("media", chunk, filename);

  const resp = await fetch(`${xApiUrl}/2/media/upload/${mediaId}/append`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });
  if (!resp.ok) {
    const error = await resp.text().catch(() => null);
    console.error("Failed to APPEND chunk to X:", error);
    throw new Error("Failed to APPEND chunk to X");
  }
}

export async function finalizeUpload(
  accessToken: string,
  mediaId: string
): Promise<any | undefined> {
  const resp = await fetch(`${xApiUrl}/2/media/upload/${mediaId}/finalize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => null);
    console.error("Failed to FINALIZE upload to X:", error);
    throw new Error("Failed to FINALIZE upload to X");
  }
  const data = await resp.json().catch(() => ({} as any));
  return data?.data?.processing_info;
}

export async function waitForProcessing(
  accessToken: string,
  mediaId: string,
  initialCheckAfterSecs: number = 2,
  maxAttempts: number = 120
): Promise<void> {
  let attempts = 0;
  let state: string | undefined = "pending";
  let waitSecs = initialCheckAfterSecs;
  while (state && state !== "succeeded") {
    await new Promise((r) => setTimeout(r, Math.max(1, waitSecs) * 1000));
    const statusResp = await fetch(
      `${xApiUrl}/2/media/upload?command=STATUS&media_id=${encodeURIComponent(
        mediaId
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!statusResp.ok) {
      const error = await statusResp.text().catch(() => null);
      console.error("Failed to get media STATUS from X:", error);
      throw new Error("Failed to get media STATUS from X");
    }
    const statusData = await statusResp.json().catch(() => ({} as any));
    state = statusData?.data?.processing_info?.state;
    waitSecs = statusData?.data?.processing_info?.check_after_secs ?? waitSecs;
    attempts += 1;
    if (state === "failed") {
      console.error("Media processing failed on X:", statusData);
      throw new Error("Media processing failed on X");
    }
    if (attempts > maxAttempts) {
      console.error("Media processing timed out on X:", statusData);
      throw new Error("Media processing timed out on X");
    }
  }
}

export async function uploadImageMedia(
  accessToken: string,
  blob: Blob,
  mimeType: string
): Promise<string> {
  const mediaId = await initializeUpload(
    accessToken,
    mimeType,
    blob.size,
    "tweet_image"
  );
  await appendChunk(accessToken, mediaId, blob, 0, "image.jpg");
  const processingInfo = await finalizeUpload(accessToken, mediaId);
  if (processingInfo) {
    await waitForProcessing(
      accessToken,
      mediaId,
      processingInfo.check_after_secs ?? 2,
      60
    );
  }
  return mediaId;
}

export async function uploadVideoMedia(
  accessToken: string,
  blob: Blob,
  mimeType: string
): Promise<string> {
  const mediaId = await initializeUpload(
    accessToken,
    mimeType,
    blob.size,
    "tweet_video"
  );
  const chunkSize = 5 * 1024 * 1024;
  let segmentIndex = 0;
  for (let offset = 0; offset < blob.size; offset += chunkSize) {
    const chunk = blob.slice(offset, Math.min(offset + chunkSize, blob.size));
    await appendChunk(
      accessToken,
      mediaId,
      chunk,
      segmentIndex,
      `chunk-${segmentIndex}`
    );
    segmentIndex += 1;
  }
  const processingInfo = await finalizeUpload(accessToken, mediaId);
  if (processingInfo) {
    await waitForProcessing(
      accessToken,
      mediaId,
      processingInfo.check_after_secs ?? 5,
      120
    );
  }
  return mediaId;
}

export async function createTweet(
  accessToken: string,
  params: {
    text: string;
    mediaIds: string[];
    communityId?: string | null;
    shareWithFollowers?: boolean | null;
  }
): Promise<string> {
  const resp = await fetch(`${xApiUrl}/2/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      community_id: params.communityId || undefined,
      share_with_followers: params.communityId
        ? params.shareWithFollowers
        : true,
      text: params.text,
      media: { media_ids: params.mediaIds },
    }),
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => null);
    console.error("Failed to create Tweet on X:", error);
    throw new Error("Failed to create Tweet on X");
  }
  const data = await resp.json();
  const tweetId = data?.data?.id;
  if (!tweetId) {
    console.error("No tweet id returned:", data);
    throw new Error("No tweet id returned from X");
  }
  return tweetId;
}
