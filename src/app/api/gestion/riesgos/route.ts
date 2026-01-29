import { NextResponse } from 'next/server';
import { managementService } from '@/services/management.service';

export async function GET() {
  const data = managementService.getRisks();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = managementService.addRisk(body);
  return NextResponse.json(newItem);
}
