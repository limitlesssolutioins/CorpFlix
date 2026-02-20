import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getManagementService } from '@/services/management.service';

export async function GET() {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const data = managementService.getStrategicPlan();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const body = await request.json();
  const updated = managementService.updateStrategicPlan(body);
  return NextResponse.json(updated);
}
