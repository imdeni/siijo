import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl.clone();

    // If the user is authenticated
    if (token) {
        // Redirect authenticated users away from login or register pages
        // if (url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) {
        //     return NextResponse.redirect(new URL('/', request.url));
        // }

        // Role-based redirection
        if (token.role === 1 && !url.pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin', request.url));
        } else if (token.role === 0 && !url.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    } else {
        // Redirect unauthenticated users to login page if not accessing public routes
        if (!url.pathname.startsWith('/login') && !url.pathname.startsWith('/register') && !url.pathname.startsWith('/pendaftaran')  && !url.pathname.startsWith('/pendaftaran2')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
        '/login',
        '/register',
    ]
}
