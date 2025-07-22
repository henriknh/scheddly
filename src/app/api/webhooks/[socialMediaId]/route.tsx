import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ socialMediaId: string }> }
) {
  const { socialMediaId } = await params;

  return NextResponse.json({ message: "Hello, world!", socialMediaId });
}
