import { NextResponse } from 'next/server';
import { financeService } from '@/services/finance.service';

export async function GET() {
  try {
    const config = financeService.getConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedConfig = financeService.updateConfig(body);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating config' }, { status: 500 });
  }
}
