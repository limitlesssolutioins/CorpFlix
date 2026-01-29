
import { NextRequest, NextResponse } from 'next/server';
import { catalogService } from '@/services/catalog.service';

export async function GET() {
    const positions = await catalogService.getPositions();
    return NextResponse.json(positions);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const position = await catalogService.createPosition(body);
    return NextResponse.json(position);
}
