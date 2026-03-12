import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('firebaseAuthToken')?.value

    const protectedPaths = ['/account', '/checkout', '/admin']
    const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

    // If a route is protected and no token is present, bounce to login
    if (isProtected && !token) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Redirect logged-in users away from auth pages
    const authPaths = ['/login', '/signup']
    const isAuthPage = authPaths.some(p => request.nextUrl.pathname.startsWith(p))
    if (isAuthPage && token) {
        const redirect = request.nextUrl.searchParams.get('redirect') || '/account'
        const url = request.nextUrl.clone()
        url.pathname = redirect
        url.search = ''
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api/.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
