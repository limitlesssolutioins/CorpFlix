import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';

export async function GET() {
  try {
    const dataDir = await getCompanyDataDir();
    const configPath = path.join(dataDir, 'gestion-humana.json');
    const fileContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(fileContent);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading payroll config:', error);
    return NextResponse.json({ message: 'Error reading configuration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const dataDir = await getCompanyDataDir();
    const configPath = path.join(dataDir, 'gestion-humana.json');
    const newConfig = await req.json();
    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
    return NextResponse.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error writing payroll config:', error);
    return NextResponse.json({ message: 'Error updating configuration' }, { status: 500 });
  }
}
