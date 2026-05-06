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

  // 1. Permitir archivos estáticos e internos de Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_FILES.some((ext) => pathname.toLowerCase().endsWith(ext))
  ) {
    return NextResponse.next();
  }

  // 2. Verificar sesión
  const sessionToken = request.cookies.get('session')?.value;

  // 3. Lógica para rutas públicas (/login, etc)
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (sessionToken) {
      try {
        // Si ya tiene sesión, intentar mandarlo al dashboard en lugar de dejarlo en login
        await jwtVerify(sessionToken, SECRET_KEY);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (e) {
        // Token inválido, dejar que entre a login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 4. Lógica para rutas protegidas
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload }: any = await jwtVerify(sessionToken, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    const companyId = payload.companyId;

    // Si no tiene empresa y no está en onboarding, redirigir a onboarding
    if (!companyId && !pathname.startsWith('/onboarding') && !pathname.startsWith('/api/onboarding') && !pathname.startsWith('/api/auth/logout')) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Si ya tiene empresa y está intentando entrar a onboarding, devolver a home
    if (companyId && pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token expirado o corrupto
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
