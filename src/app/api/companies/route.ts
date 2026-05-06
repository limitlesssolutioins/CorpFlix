import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const COMPANIES_FILE = path.join(process.cwd(), 'src', 'data', 'companies.json');
const COMPANIES_DIR = path.join(process.cwd(), 'src', 'data', 'companies');

function readCompanies() {
  try {
    if (!fs.existsSync(COMPANIES_FILE)) {
      fs.writeFileSync(COMPANIES_FILE, '[]', 'utf-8');
      return [];
    }
    return JSON.parse(fs.readFileSync(COMPANIES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveCompanies(companies: any[]) {
  fs.writeFileSync(COMPANIES_FILE, JSON.stringify(companies, null, 2), 'utf-8');
}

export async function GET() {
  const companies = readCompanies();
  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const id = uuidv4();
    const newCompany = {
      id,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    // Create company directory
    const companyDir = path.join(COMPANIES_DIR, id);
    fs.mkdirSync(companyDir, { recursive: true });

    // Add to companies registry
    const companies = readCompanies();
    companies.push(newCompany);
    saveCompanies(companies);

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
