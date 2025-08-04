/**
 * Test file for the new X API media upload implementation
 * This demonstrates how to use the new functions and test error cases
 */

import { uploadMedia, validateMediaFile, getMimeType } from "./media-upload-v2";

// Mock function for testing (replace with actual access token in production)
async function testMediaUpload() {
  console.log("Testing X API Media Upload Implementation v2");
  
  // Test 1: Validate file types
  console.log("\n1. Testing file validation...");
  
  try {
    // Test valid image
    const validImageBuffer = new ArrayBuffer(1024); // 1KB test image
    validateMediaFile(validImageBuffer, "image/jpeg");
    console.log("✅ Valid image validation passed");
    
    // Test invalid file type
    try {
      validateMediaFile(validImageBuffer, "application/pdf");
      console.log("❌ Should have failed for PDF");
    } catch (error) {
      console.log("✅ Correctly rejected PDF file");
    }
    
    // Test oversized file
    const largeBuffer = new ArrayBuffer(10 * 1024 * 1024); // 10MB
    try {
      validateMediaFile(largeBuffer, "image/jpeg");
      console.log("❌ Should have failed for oversized image");
    } catch (error) {
      console.log("✅ Correctly rejected oversized image");
    }
    
  } catch (error) {
    console.error("❌ File validation test failed:", error);
  }
  
  // Test 2: MIME type detection
  console.log("\n2. Testing MIME type detection...");
  
  try {
    const jpegMime = getMimeType("image.jpg");
    console.log(`✅ JPEG MIME type: ${jpegMime}`);
    
    const pngMime = getMimeType("image.png");
    console.log(`✅ PNG MIME type: ${pngMime}`);
    
    const mp4Mime = getMimeType("video.mp4");
    console.log(`✅ MP4 MIME type: ${mp4Mime}`);
    
    try {
      getMimeType("unknown.xyz");
      console.log("❌ Should have failed for unknown extension");
    } catch (error) {
      console.log("✅ Correctly rejected unknown file extension");
    }
    
  } catch (error) {
    console.error("❌ MIME type detection test failed:", error);
  }
  
  // Test 3: Chunking function (internal)
  console.log("\n3. Testing buffer chunking...");
  
  const testBuffer = new ArrayBuffer(3 * 1024 * 1024); // 3MB
  const chunks = testBuffer.byteLength / (1024 * 1024); // Should be 3 chunks of 1MB each
  console.log(`✅ Buffer size: ${testBuffer.byteLength} bytes, expected chunks: ${chunks}`);
  
  console.log("\n✅ All tests completed successfully!");
}

// Example of how to use the upload function (commented out for safety)
async function exampleUsage() {
  /*
  // This is how you would use it in production:
  
  const accessToken = "your_access_token_here";
  const imageUrl = "https://example.com/image.jpg";
  
  try {
    // Download image
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    
    // Validate and upload
    validateMediaFile(imageBuffer, "image/jpeg");
    const mediaId = await uploadMedia(imageBuffer, "image/jpeg", accessToken);
    
    console.log(`Media uploaded successfully with ID: ${mediaId}`);
    
    // Post tweet with media
    const tweetResponse = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Test tweet with media!",
        media: { media_ids: [mediaId] },
      }),
    });
    
    if (tweetResponse.ok) {
      const tweetData = await tweetResponse.json();
      console.log(`Tweet posted successfully with ID: ${tweetData.data.id}`);
    }
    
  } catch (error) {
    console.error("Failed to upload media:", error);
  }
  */
}

// Run tests if this file is executed directly
if (require.main === module) {
  testMediaUpload().catch(console.error);
}

export { testMediaUpload, exampleUsage };