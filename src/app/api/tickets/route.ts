import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getTicketsService } from '@/services/tickets.service';

export async function GET(request: Request) {
    const dataDir = await getCompanyDataDir();
    const service = getTicketsService(dataDir);
    const { searchParams } = new URL(request.url);

    const filters: Record<string, string> = {};
    const status   = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    if (status)   filters.status   = status;
    if (priority) filters.priority = priority;
    if (category) filters.category = category;

    const tickets = service.getAllTickets(Object.keys(filters).length ? filters : undefined);
    const stats   = service.getStats();
    return NextResponse.json({ tickets, stats });
}

export async function POST(request: Request) {
    const dataDir = await getCompanyDataDir();
    const service = getTicketsService(dataDir);
    const body = await request.json();
    const ticket = service.createTicket(body);
    return NextResponse.json(ticket, { status: 201 });
}
