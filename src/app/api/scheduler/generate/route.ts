
import { NextResponse } from 'next/server';
import { schedulerService } from '@/services/scheduler.service';

export async function POST(req: Request) {
    const body = await req.json();
    const result = await schedulerService.generateSchedule(body);
    return NextResponse.json(result);
}
