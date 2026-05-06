import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getManagementService } from '@/services/management.service';

export async function GET() {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const data = managementService.getIndicators();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const body = await request.json();
  const items = Array.isArray(body) ? body : [body];
  const newItems = managementService.addIndicators(items);
  return NextResponse.json(newItems);
}

export async function PUT(request: Request) {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const body = await request.json();
  const updated = managementService.updateIndicator(body);
  if (updated) return NextResponse.json(updated);
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const dataDir = await getCompanyDataDir();
  const managementService = getManagementService(dataDir);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id && managementService.deleteIndicator(id)) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
