import { NextResponse } from 'next/server';
import { adminService } from '@/services/admin.service';

export async function GET() {
  const data = adminService.getGeneralSettings();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const updated = adminService.updateGeneralSettings(body);
  return NextResponse.json(updated);
}
