import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getEmployeesService } from '@/services/employees.service';

export async function GET() {
  try {
    const dataDir = await getCompanyDataDir();
    const employeesService = getEmployeesService(dataDir);
    const employees = await employeesService.findAll();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error reading employees data:', error);
    return NextResponse.json({ message: 'Error reading employees data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const employeesService = getEmployeesService(dataDir);
    const body = await request.json();
    const employee = await employeesService.create(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ message: 'Error creating employee' }, { status: 500 });
  }
}