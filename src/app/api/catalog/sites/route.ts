
import { NextRequest, NextResponse } from 'next/server';
import { catalogService } from '@/services/catalog.service';

export async function GET() {
    const sites = await catalogService.getSites();
    return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const site = await catalogService.createSite(body);
    return NextResponse.json(site);
}
