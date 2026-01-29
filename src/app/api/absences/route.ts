
import { NextResponse } from 'next/server';
import { absencesService } from '@/services/absences.service';

export async function GET() {
    const data = await absencesService.findAll();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    const data = await absencesService.create(body);
    return NextResponse.json(data);
}
