import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  console.log(request);
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/api/auth/signin' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('token')?.value ?? ''

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    // If user is not authenticated, store the requested page and redirect to login
    const redirectUrl = new URL('/api/auth/signin', request.nextUrl);
    redirectUrl.searchParams.set('next', path); // Store the originally requested path
    return NextResponse.redirect(redirectUrl);
}
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/:path*',
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}
