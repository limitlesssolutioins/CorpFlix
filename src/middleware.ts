import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/register', '/api/platform/data-policy'];
const PUBLIC_FILES = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'];
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lidus-super-secret-development-key-12345!'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_FILES.some((ext) => pathname.toLowerCase().endsWith(ext))
  ) {
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Check session cookie
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(sessionToken, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    // Valid session
    const companyId = payload.companyId;

    // If no companyId and trying to access anything other than onboarding or its API, redirect to onboarding
    if (!companyId && !pathname.startsWith('/onboarding') && !pathname.startsWith('/api/onboarding') && !pathname.startsWith('/api/auth/logout')) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // If has companyId and trying to access onboarding, redirect to home
    if (companyId && pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
