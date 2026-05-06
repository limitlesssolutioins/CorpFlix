
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getSchedulerService } from '@/services/scheduler.service';

export async function POST(req: Request) {
    const dataDir = await getCompanyDataDir();
    const schedulerService = getSchedulerService(dataDir);
    const body = await req.json();
    const result = await schedulerService.generateSchedule(body);
    return NextResponse.json(result);
}
