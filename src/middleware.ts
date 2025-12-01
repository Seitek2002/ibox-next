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

  // Specific mappings:
  // /I/Holod1 -> /holod1/1
  // /I/Holod2 -> /holod1/2
  if (pathname === "/I/Holod1") {
    const url = request.nextUrl.clone();
    url.pathname = "/holod1/1";
    return NextResponse.redirect(url);
  }
  if (pathname === "/I/Holod2") {
    const url = request.nextUrl.clone();
    url.pathname = "/holod1/2";
    return NextResponse.redirect(url);
  }

  // Generic mapping: Redirect /I/<...> -> /<...>
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
