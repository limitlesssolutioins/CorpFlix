import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const COMPANIES_FILE = path.join(process.cwd(), 'src', 'data', 'companies.json');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const companyId = cookieStore.get('lidus_company_id')?.value;

    if (!companyId) {
      return NextResponse.json({ error: 'No company selected' }, { status: 400 });
    }

    let companies: any[] = [];
    try {
      if (fs.existsSync(COMPANIES_FILE)) {
        companies = JSON.parse(fs.readFileSync(COMPANIES_FILE, 'utf-8'));
      }
    } catch {
      companies = [];
    }

    const company = companies.find((c: any) => c.id === companyId);
    
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Error fetching current company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
