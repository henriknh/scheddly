import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "@/lib/minio";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;

    if (!key) {
      return new NextResponse("File key is required", { status: 400 });
    }

    const url = key.join("/");
    const presignedUrl = await getPresignedUrl(url);

    if (!presignedUrl) {
      return new NextResponse("File not found", { status: 404 });
    }

    return NextResponse.redirect(presignedUrl);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    if (error instanceof Error && error.message.includes("NoSuchKey")) {
      return new NextResponse("File not found", { status: 404 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
