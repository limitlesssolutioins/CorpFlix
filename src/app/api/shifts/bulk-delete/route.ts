
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
    }
    await prisma.shift.deleteMany({
        where: { id: { in: ids } }
    });
    return NextResponse.json({ message: "Deleted" });
}
