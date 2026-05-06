
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getSchedulerService } from '@/services/scheduler.service';

export async function GET() {
    const dataDir = await getCompanyDataDir();
    const schedulerService = getSchedulerService(dataDir);
    const data = await schedulerService.getPatterns();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const dataDir = await getCompanyDataDir();
    const schedulerService = getSchedulerService(dataDir);
    const body = await req.json();
    const data = await schedulerService.createPattern(body);
    return NextResponse.json(data);
}
