import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const existingUsers = await query<any[]>('SELECT id FROM User WHERE email = ? LIMIT 1', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    // We need a default company because the schema requires it now.
    // Ideally this comes from a registration form.
    let companyId: string;
    const companies = await query<any[]>('SELECT id FROM Company LIMIT 1');
    
    if (companies.length === 0) {
        companyId = uuidv4();
        await query(
            'INSERT INTO Company (id, name, nit, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [companyId, 'Lidus Default', '000000000', 'ACTIVE']
        );
    } else {
        companyId = companies[0].id;
    }

    await query(
        'INSERT INTO User (id, email, password, name, companyId, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [id, email, password_hash, email.split('@')[0], companyId, 'USER', 'ACTIVE']
    );

    await createSession({ userId: id, email, companyId: companyId });

    return NextResponse.json({ success: true, user: { id, email } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
