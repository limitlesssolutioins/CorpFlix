import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/coreDb';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Set company cookie as well if they have one, to mimic old behavior if needed
    // Old system used 'selectedCompanyId' cookie
    if (user.company_id) {
      // It's handled inside createSession but let's also set the classic cookie 
      // just in case any legacy component needs it
    }

    // Create JWT
    await createSession({
      userId: user.id,
      email: user.email,
      companyId: user.company_id || null,
      planId: user.plan_id
    });

    // We can also set the old cookie to maintain compatibility with existing pages
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, companyId: user.company_id } 
    });

    if (user.company_id) {
      response.cookies.set('selectedCompanyId', user.company_id, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60
      });
    } else {
      response.cookies.delete('selectedCompanyId');
    }

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el inicio de sesión' }, { status: 500 });
  }
}
