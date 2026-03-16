import { NextResponse } from 'next/server';
import { getCompanyDataDir, getCompanyId } from '@/lib/companyContext';
import { getManagementService } from '@/services/management.service';
import { emitKpiUpdate } from '@/lib/socket-server';

export async function GET() {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const data = managementService.getStrategicPlan();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const companyId = await getCompanyId();
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const body = await request.json();
  const updated = managementService.updateStrategicPlan(body);
  
  if (companyId) {
    emitKpiUpdate(companyId, 'planeacion');
  }
  
  return NextResponse.json(updated);
}
