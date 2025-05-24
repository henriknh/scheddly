import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenData } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  // Check if the path requires authentication
  const isAuthPath = request.nextUrl.pathname.startsWith("/dashboard");

  if (isAuthPath) {
    const token = request.cookies.get("token");

    if (!token) {
      return redirectToLogin(request);
    }

    const payload = await getTokenData(request);
    if (!payload) {
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const redirectUrl = new URL("/auth/login", request.url);
  redirectUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
