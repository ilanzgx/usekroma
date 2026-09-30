import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/jwt";

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) {
    return `${proto}://${host}`;
  }
  return "http://localhost:13000";
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/login";
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", getBaseUrl(request)));
    }

    const session = await verifySessionToken(token);
    if (!session) {
      const response = NextResponse.redirect(
        new URL("/login?error=session_expired", getBaseUrl(request)),
      );
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (!token) {
      return NextResponse.next();
    }

    const session = await verifySessionToken(token);
    if (session) {
      return NextResponse.redirect(new URL("/studio", getBaseUrl(request)));
    }

    const response = NextResponse.next();
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
