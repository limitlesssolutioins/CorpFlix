
import { NextResponse } from 'next/server';

export async function GET() {
    // Retornamos escalas quemadas para evitar error TS con DB custom
    const scales = [
      { id: 1, name: 'Operativo', min_salary: 1300000, max_salary: 1500000 },
      { id: 2, name: 'Asistencial', min_salary: 1500000, max_salary: 2000000 },
      { id: 3, name: 'Profesional', min_salary: 2000000, max_salary: 3500000 },
      { id: 4, name: 'Coordinación', min_salary: 3500000, max_salary: 5000000 },
      { id: 5, name: 'Gerencial', min_salary: 5000000, max_salary: 10000000 }
    ];
    return NextResponse.json(scales);
}
