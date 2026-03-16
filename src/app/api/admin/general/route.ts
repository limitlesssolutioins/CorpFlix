import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getAdminService } from '@/services/admin.service';

export async function GET() {
  try {
    const dataDir = await getCompanyDataDir();
    const adminService = getAdminService(dataDir);
    // CRÍTICO: Añadido await
    const data = await adminService.getGeneralSettings();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /api/admin/general:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const adminService = getAdminService(dataDir);
    const body = await request.json();
    // CRÍTICO: Añadido await
    const updated = await adminService.updateGeneralSettings(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error in POST /api/admin/general:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
