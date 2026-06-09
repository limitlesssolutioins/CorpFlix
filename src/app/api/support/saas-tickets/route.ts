import { NextResponse } from 'next/server';
import { getSaasSupportDb } from '@/lib/saasSupportDb';
import { verifySession } from '@/lib/auth';

// GET: Obtain all SaaS tickets (for the admin dashboard)
export async function GET(request: Request) {
    try {
        const session = await verifySession();
        // Here you would check if session user has 'SUPERADMIN' or support roles
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const db = getSaasSupportDb();
        const tickets = await db.getAllTickets();

        // Map camelCase DB fields to snake_case used by UI, and generate ticket_code
        const mappedTickets = tickets.map((t: any) => ({
            id: t.id,
            ticket_code: t.id ? `TCK-${t.id.substring(0, 8).toUpperCase()}` : 'TCK-UNKNOWN',
            company_id: t.companyId,
            subject: t.subject,
            status: t.status || 'OPEN',
            created_at: t.createdAt
        }));

        return NextResponse.json(mappedTickets);
    } catch (error) {
        console.error('Error fetching SaaS tickets:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// POST: Create a new SaaS ticket (usually from the Chat fallback)
export async function POST(request: Request) {
    try {
        const session: any = await verifySession();
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { subject, transcript, priority } = body;
        const companyId = session.companyId;
        const userId = session.userId || session.user?.id || 'unknown';

        if (!subject || !transcript || !companyId) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const db = getSaasSupportDb();
        const newTicket = await db.createTicket({
            companyId: companyId,
            userId: userId,
            subject,
            description: transcript,
            priority: priority || 'MEDIUM',
            status: 'OPEN'
        });

        return NextResponse.json(newTicket, { status: 201 });
    } catch (error) {
        console.error('Error creating SaaS ticket:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
