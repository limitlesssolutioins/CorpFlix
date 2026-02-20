
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getAbsencesService } from '@/services/absences.service';

export async function GET() {
    const dataDir = await getCompanyDataDir();
    const absencesService = getAbsencesService(dataDir);
    const data = await absencesService.findAll();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const dataDir = await getCompanyDataDir();
    const absencesService = getAbsencesService(dataDir);
    const body = await req.json();
    const data = await absencesService.create(body);
    return NextResponse.json(data);
}
