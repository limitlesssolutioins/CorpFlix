import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const employeesPath = path.join(process.cwd(), 'src/data/employees.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(employeesPath, 'utf8');
    const employees = JSON.parse(fileContent);
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error reading employees data:', error);
    return NextResponse.json({ message: 'Error reading employees data' }, { status: 500 });
  }
}