import { NextResponse } from 'next/server';
import { managementService } from '@/services/management.service';

export async function GET() {
  const data = managementService.getStrategicPlan();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const updated = managementService.updateStrategicPlan(body);
  return NextResponse.json(updated);
}
