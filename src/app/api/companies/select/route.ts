import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const COMPANIES_FILE = path.join(process.cwd(), 'src', 'data', 'companies.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    // Verify company exists
    let companies: any[] = [];
    try {
      companies = JSON.parse(fs.readFileSync(COMPANIES_FILE, 'utf-8'));
    } catch {
      companies = [];
    }

    const company = companies.find((c: any) => c.id === companyId);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, company });
    response.cookies.set('lidus_company_id', companyId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error selecting company:', error);
    return NextResponse.json({ error: 'Failed to select company' }, { status: 500 });
  }
}
