import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from '@/lib/coreDb';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    // CRÍTICO: Añadido await
    const existingUser = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    // CRÍTICO: Añadido await en el .run()
    await db.prepare(`
      INSERT INTO users (id, email, password_hash, plan_id)
      VALUES (?, ?, ?, 'pro')
    `).run(id, email, password_hash);

    await createSession({ userId: id, email, companyId: null });

    return NextResponse.json({ success: true, user: { id, email } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
