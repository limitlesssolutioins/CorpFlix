import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const users = await query<any[]>('SELECT id, email, password, companyId FROM User WHERE email = ? LIMIT 1', [email]);
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = users[0];

    // Assuming plain text match right now due to early MVP, but keeping bcrypt for future
    // In our new schema we seeded plain text for now, but you should hash them
    const isValid = user.password === password || await bcrypt.compare(password, user.password).catch(() => false);

    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Crear JWT
    await createSession({
      userId: user.id,
      email: user.email,
      companyId: user.companyId || null,
      planId: "MVP" // Hardcoded for now based on old logic
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, companyId: user.companyId }
    });

    if (user.companyId) {
      response.cookies.set('selectedCompanyId', user.companyId, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60
      });
    }

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el inicio de sesión' }, { status: 500 });
  }
}
