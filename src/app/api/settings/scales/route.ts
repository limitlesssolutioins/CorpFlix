
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'));

export async function GET() {
    const scales = db.prepare('SELECT * FROM SalaryScale').all();
    return NextResponse.json(scales);
}
