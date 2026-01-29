
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const scales = await prisma.salaryScale.findMany();
    return NextResponse.json(scales);
}
