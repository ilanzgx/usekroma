import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) {
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:13000";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const baseUrl = getBaseUrl(request);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, baseUrl),
    );
  }

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_token", baseUrl),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.redirect(new URL("/studio", baseUrl));
}
