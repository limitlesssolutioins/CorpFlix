import { NextResponse } from 'next/server';
import { managementService } from '@/services/management.service';

export async function GET() {
  const data = managementService.getProcesses();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  if (Array.isArray(body)) {
    const newItems = managementService.addProcesses(body);
    return NextResponse.json(newItems);
  }

  const newItem = managementService.addProcess(body);
  return NextResponse.json(newItem);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updatedItem = managementService.updateProcess(body);
  if (updatedItem) {
    return NextResponse.json(updatedItem);
  }
  return NextResponse.json({ error: 'Process not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = managementService.deleteProcess(id);
  if (success) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Process not found' }, { status: 404 });
}
