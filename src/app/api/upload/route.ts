import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/jwt";
import { uploadToMinio } from "@/lib/minio";

export async function POST(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Only allow images
    if (!file.type.startsWith("image/")) {
      return new NextResponse("File must be an image", { status: 400 });
    }

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;

    // Upload to MinIO
    const key = await uploadToMinio(buffer, filename, file.type);

    // Return the URL that can be used to access the file
    return NextResponse.json({ url: `/api/file/${key}` });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
