import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import db from '@/lib/coreDb';

export async function GET() {
  try {
    const session: any = await verifySession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user: any = db.prepare('SELECT id, email, company_id, plan_id, status FROM users WHERE id = ?').get(session.userId);

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
