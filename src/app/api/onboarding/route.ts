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

    // Comprobar que el usuario no tenga ya una empresa
    const user: any = db.prepare('SELECT company_id, plan_id FROM users WHERE id = ?').get(session.userId);
    
    if (user.company_id) {
      return NextResponse.json({ error: 'El usuario ya tiene una empresa registrada' }, { status: 400 });
    }

    const companyId = uuidv4();

    // Create company directory in file system for backward compatibility
    const companyDir = path.join(COMPANIES_DIR, companyId);
    fs.mkdirSync(companyDir, { recursive: true });

    // Insert company in db
    const insertCompanyStmt = db.prepare(`
      INSERT INTO companies (id, name, nit, sectorActividad, direccion, ciudad, telefono, email, sitioWeb)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCompanyStmt.run(
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

    // Update user with company
    db.prepare('UPDATE users SET company_id = ? WHERE id = ?').run(companyId, session.userId);

    // Add backwards-compatible entries to admin.json in company directory (so dashboard works)
    const adminPath = path.join(companyDir, 'admin.json');
    fs.writeFileSync(adminPath, JSON.stringify({
      nombreEmpresa: name.trim(),
      nit: nit || "",
      sectorActividad: sectorActividad || "",
      direccion: direccion || "",
      ciudad: ciudad || "",
      telefono: telefono || "",
      email: email || "",
      sitioWeb: sitioWeb || ""
    }, null, 2));

    // Update session
    await createSession({
      userId: session.userId,
      email: session.email,
      companyId: companyId,
      planId: user.plan_id
    });

    const response = NextResponse.json({ success: true, companyId });

    // Backwards compatibility cookie
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
