import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/companies'];
const PUBLIC_FILES = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Allow static image files (logos, etc.)
  if (PUBLIC_FILES.some((ext) => pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  // Check for company cookie
  const companyId = request.cookies.get('lidus_company_id')?.value;
  if (!companyId) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
