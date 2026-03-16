import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/coreDb';
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

    // CRÍTICO: Añadido await
    const user: any = await db.prepare('SELECT company_id, plan_id FROM users WHERE id = ?').get(session.userId);
    
    if (user.company_id) {
      return NextResponse.json({ error: 'El usuario ya tiene una empresa registrada' }, { status: 400 });
    }

    const companyId = uuidv4();

    const companyDir = path.join(COMPANIES_DIR, companyId);
    fs.mkdirSync(companyDir, { recursive: true });

    // CRÍTICO: Añadido await
    await db.prepare(`
      INSERT INTO companies (id, name, nit, sectorActividad, direccion, ciudad, telefono, email, sitioWeb)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      companyId, 
      name.trim(), 
      nit || null, 
      sectorActividad || null, 
      direccion || null, 
      ciudad || null, 
      telefono || null, 
      email || null, 
      sitioWeb || null
    );

    // CRÍTICO: Añadido await
    await db.prepare('UPDATE users SET company_id = ? WHERE id = ?').run(companyId, session.userId);

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
      planId: user.plan_id
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
