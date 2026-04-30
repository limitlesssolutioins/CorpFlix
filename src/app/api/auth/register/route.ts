import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    // We need a default company because the schema requires it now.
    // Ideally this comes from a registration form.
    let company = await prisma.company.findFirst();
    if (!company) {
        company = await prisma.company.create({
            data: {
                id: uuidv4(),
                name: 'Lidus Default',
                nit: '000000000'
            }
        });
    }

    await prisma.user.create({
        data: {
            id,
            email,
            password: password_hash,
            name: email.split('@')[0],
            companyId: company.id
        }
    });

    await createSession({ userId: id, email, companyId: company.id });

    return NextResponse.json({ success: true, user: { id, email } }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
