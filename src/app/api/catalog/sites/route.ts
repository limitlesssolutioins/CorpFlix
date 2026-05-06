
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getCatalogService } from '@/services/catalog.service';

export async function GET() {
    const dataDir = await getCompanyDataDir();
    const catalogService = getCatalogService(dataDir);
    const sites = await catalogService.getSites();
    return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
    const dataDir = await getCompanyDataDir();
    const catalogService = getCatalogService(dataDir);
    const body = await req.json();
    const site = await catalogService.createSite(body);
    return NextResponse.json(site);
}
