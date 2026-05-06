import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getTicketsService } from '@/services/tickets.service';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dataDir = await getCompanyDataDir();
    const ticket = getTicketsService(dataDir).getTicketById(parseInt(id));
    if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(ticket);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dataDir = await getCompanyDataDir();
    const body = await request.json();
    const ticket = getTicketsService(dataDir).updateTicket(parseInt(id), body);
    if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(ticket);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dataDir = await getCompanyDataDir();
    const ok = getTicketsService(dataDir).deleteTicket(parseInt(id));
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
}
