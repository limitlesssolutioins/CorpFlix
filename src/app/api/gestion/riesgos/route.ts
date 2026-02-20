import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getManagementService } from '@/services/management.service';

export async function GET() {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const data = managementService.getRisks();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const body = await request.json();
  const newItem = managementService.addRisk(body);
  return NextResponse.json(newItem);
}
