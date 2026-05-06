
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getCatalogService } from '@/services/catalog.service';

export async function GET() {
    const dataDir = await getCompanyDataDir();
    const catalogService = getCatalogService(dataDir);
    const constants = await catalogService.getConstants();
    return NextResponse.json(constants);
}
