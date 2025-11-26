import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from './app/api/utils/jwtToken';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    const publicPaths = ['/', '/loginsignup', '/forgotpassword', '/resetpassword', '/verifyemail'];
    const protectedPrefixes = ['/dashboard', '/platform'];

    if (!token && protectedPrefixes.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (token && publicPaths.includes(pathname)) {
        const payload = getUserFromToken(request);
        if (payload) {
            return NextResponse.redirect(new URL(`/platform`, request.url));
        }
    }
}

export const config = {
    matcher: ['/login', '/forgotpassword', '/resetpassword', '/verifyemail', '/dashboard/:path*', '/platform'],
};
