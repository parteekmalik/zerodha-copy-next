import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/api/auth/signin","/api/auth/signin/discord","/api/auth/callback/discord"];
  const isPublicPath = publicPaths.includes(path);

  const token = request.cookies.get("next-auth.session-token")?.value;

  console.log(path, isPublicPath, token);

  // Redirect from root ("/") to "/Dashboard"
  if (path === "/kite" || path === "/") {
    return NextResponse.redirect(new URL("/kite/Dashboard", request.nextUrl));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    // If user is not authenticated, store the requested page and redirect to login
    const redirectUrl = new URL("/api/auth/signin", request.nextUrl);
    redirectUrl.searchParams.set("next", path); // Store the originally requested path
    return NextResponse.redirect(redirectUrl);
  }
}

// Apply middleware to all paths except those starting with "/_next"
export const config = {
  matcher: ["/","/kite","/kite/(.*)", "/api/(.*)"],
};
