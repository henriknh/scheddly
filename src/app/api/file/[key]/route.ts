import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "@/lib/minio";

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    console.log(params);

    const { key } = params;
    if (!key) {
      return new NextResponse("File key is required", { status: 400 });
    }

    // Get a presigned URL for the object
    const presignedUrl = await getPresignedUrl(key);

    // Fetch the object using the presigned URL
    const response = await fetch(presignedUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return new NextResponse("File not found", { status: 404 });
      }
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the content type from the response headers
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    if (error instanceof Error && error.message.includes("NoSuchKey")) {
      return new NextResponse("File not found", { status: 404 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
