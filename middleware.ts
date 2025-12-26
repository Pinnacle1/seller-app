import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value
    const { pathname } = request.nextUrl

    // Define public paths that don't require authentication
    const publicPaths = ['/auth', '/onboarding/intro'] // Assuming onboarding intro might be public, but let's stick to auth

    // Check if current path starts with any of the public paths
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // If there's no token and the path is private, redirect to auth
    if (!token && !isPublicPath) {
        const url = new URL('/auth', request.url)
        // Optional: save the original url to redirect back after login
        // url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // If there is a token and the user is on the auth page, redirect to home
    if (token && pathname === '/auth') {
        // Only redirect from exactly /auth, allows access to sub-auth routes if any exist in future
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Any file with an extension (e.g. .svg, .png, .jpg, .css, .js)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
}
