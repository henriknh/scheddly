import { NextRequest, NextResponse } from "next/server";
import { getFileUrl } from "../get-file-url";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    const fileUrl = await getFileUrl(fileId);
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    if (error instanceof Error && error.message === "File not found") {
      return new NextResponse("File not found", { status: 404 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
