
import { NextResponse } from 'next/server';
import { schedulerService } from '@/services/scheduler.service';

export async function GET() {
    const data = await schedulerService.getTeams();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    const data = await schedulerService.createTeam(body);
    return NextResponse.json(data);
}
