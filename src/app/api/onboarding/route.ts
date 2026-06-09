import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { verifySession, createSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const COMPANIES_DIR = path.join(process.cwd(), 'src', 'data', 'companies');

export async function POST(request: Request) {
  try {
    const session: any = await verifySession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, nit, sectorActividad, direccion, ciudad, telefono, email, sitioWeb } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre de la empresa es obligatorio' }, { status: 400 });
    }

    const users = await query<any[]>('SELECT * FROM User WHERE id = ?', [session.userId]);
    let user = users[0];

    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const companies = await query<any[]>('SELECT * FROM Company WHERE id = ?', [user.companyId]);
    user.company = companies[0];

    if (user.company && user.company.name !== 'Lidus Default') {
      return NextResponse.json({ error: 'El usuario ya tiene una empresa registrada' }, { status: 400 });
    }

    const companyId = user.companyId;

    await query(
        'UPDATE Company SET name = ?, nit = ?, address = ?, phone = ?, email = ?, industry = ? WHERE id = ?',
        [name.trim(), nit || "", direccion || "", telefono || "", email || "", sectorActividad || "", companyId]
    );

    const companyDir = path.join(COMPANIES_DIR, companyId);
    fs.mkdirSync(companyDir, { recursive: true });

    const adminPath = path.join(companyDir, 'admin.json');
    fs.writeFileSync(adminPath, JSON.stringify({
      general: {
        nombreEmpresa: name.trim(),
        nit: nit || "",
        sectorActividad: sectorActividad || "",
        direccion: direccion || "",
        ciudad: ciudad || "",
        telefono: telefono || "",
        email: email || "",
        sitioWeb: sitioWeb || ""
      },
      roles: [],
      usuarios: []
    }, null, 2));

    await createSession({
      userId: session.userId,
      email: session.email,
      companyId: companyId,
      needsOnboarding: false,
      planId: "MVP"
    });

    const response = NextResponse.json({ success: true, companyId });
    response.cookies.set('selectedCompanyId', companyId, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });

    return response;

  } catch (error: any) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Error creando la empresa' }, { status: 500 });
  }
}
