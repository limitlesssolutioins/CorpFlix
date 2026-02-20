import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getAdminService } from '@/services/admin.service';

export async function GET() {
  const dataDir = await getCompanyDataDir();
  const adminService = getAdminService(dataDir);
  const data = adminService.getGeneralSettings();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const dataDir = await getCompanyDataDir();
  const adminService = getAdminService(dataDir);
  const body = await request.json();
  const updated = adminService.updateGeneralSettings(body);
  return NextResponse.json(updated);
}
