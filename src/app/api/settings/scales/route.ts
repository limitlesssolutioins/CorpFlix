
import { NextResponse } from 'next/server';
import path from 'path';
import { getCompanyDataDir } from '@/lib/companyContext';

const { getDb } = require('@/lib/db');

export async function GET() {
    const dataDir = await getCompanyDataDir();
    const db = getDb(path.join(dataDir, 'hr.db'));
    const scales = db.prepare('SELECT * FROM SalaryScale').all();
    return NextResponse.json(scales);
}
