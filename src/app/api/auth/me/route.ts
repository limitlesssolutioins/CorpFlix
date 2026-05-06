import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session: any = await verifySession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = await query<any[]>('SELECT id, email, companyId, status FROM User WHERE id = ?', [session.userId]);
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Map to legacy format expected by UI if necessary
    const mappedUser = {
        ...user,
        company_id: user.companyId,
        plan_id: "MVP"
    };

    return NextResponse.json({ user: mappedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
