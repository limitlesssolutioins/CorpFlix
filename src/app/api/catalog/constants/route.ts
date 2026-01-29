
import { NextResponse } from 'next/server';
import { catalogService } from '@/services/catalog.service';

export async function GET() {
    const data = catalogService.getSocialSecurityData();
    const absenceTypes = await catalogService.getAbsenceTypes();
    return NextResponse.json({ ...data, absenceTypes });
}
