
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getCatalogService } from '@/services/catalog.service';

export async function GET() {
    const dataDir = await getCompanyDataDir();
    const catalogService = getCatalogService(dataDir);
    const positions = await catalogService.getPositions();
    return NextResponse.json(positions);
}

export async function POST(req: NextRequest) {
    const dataDir = await getCompanyDataDir();
    const catalogService = getCatalogService(dataDir);
    const body = await req.json();
    const position = await catalogService.createPosition(body);
    return NextResponse.json(position);
}
