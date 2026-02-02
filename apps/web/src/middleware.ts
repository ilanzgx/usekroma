import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "@/resources/auth/auth.service";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/login";
  const isStudioRoute = pathname.startsWith("/studio");

  if (token && isAuthRoute) {
    const isValid = await validateToken();
    if (isValid) {
      return NextResponse.redirect(new URL("/studio", request.url));
    }

    const response = NextResponse.next();
    response.cookies.delete("token");
    return response;
  }

  if (isStudioRoute) {
    return NextResponse.next();
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
