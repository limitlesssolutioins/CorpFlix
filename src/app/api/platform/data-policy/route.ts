import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POLICY_FILE = path.join(process.cwd(), 'src', 'data', 'data-policy.json');

function readPolicy() {
  try {
    if (!fs.existsSync(POLICY_FILE)) {
      return { pdfUrl: '', textContent: '', version: '1', updatedAt: '' };
    }
    return JSON.parse(fs.readFileSync(POLICY_FILE, 'utf-8'));
  } catch {
    return { pdfUrl: '', textContent: '', version: '1', updatedAt: '' };
  }
}

export async function GET() {
  return NextResponse.json(readPolicy());
}

export async function POST(request: Request) {
  const body = await request.json();
  const current = readPolicy();
  const updated = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
    version: String(parseInt(current.version || '1') + 1),
  };
  fs.writeFileSync(POLICY_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
