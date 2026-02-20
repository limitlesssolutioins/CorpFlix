
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'));

export async function POST(req: Request) {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
    }
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM Shift WHERE id IN (${placeholders})`).run(...ids);
    return NextResponse.json({ message: "Deleted" });
}
