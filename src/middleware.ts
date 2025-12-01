import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Redirect /I/<...> -> /<...>
 * Examples:
 *  - /I/Holod1   -> /Holod1
 *  - /I          -> /
 *  - /I/a/b?x=1  -> /a/b?x=1
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/I" || pathname.startsWith("/I/")) {
    const url = request.nextUrl.clone();
    // Remove the leading "/I" segment once
    url.pathname = pathname.replace(/^\/I(\/?)/, "/");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Ensure middleware runs only for /I and its subpaths
export const config = {
  matcher: ["/I", "/I/:path*"],
};
