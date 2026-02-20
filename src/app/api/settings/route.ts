
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getAdminService } from '@/services/admin.service';

export async function GET() {
    // 1. Fetch Company Profile from Admin Service (Source of Truth)
    const dataDir = await getCompanyDataDir();
    const adminSettings = getAdminService(dataDir).getGeneralSettings();

    // 2. Define HR/Legal Settings Defaults (Removed Prisma Dependency)
    const config = {
        smlmv: 1300000,
        transportAid: 162000,
        currentYear: 2026
    };

    // 3. Merge Data (Admin Profile + HR Params)
    return NextResponse.json({
        // HR & Legal Defaults
        smlmv: config.smlmv,
        transportAid: config.transportAid,
        currentYear: config.currentYear,
        
        // Company Profile (from Admin Module)
        companyName: adminSettings.nombreEmpresa || 'LIDUS',
        idType: 'NIT', // Default as admin service doesn't store this specific field yet
        nit: adminSettings.nit || '900123456',
        address: adminSettings.direccion || 'Calle 123 # 45-67',
        city: adminSettings.ciudad || 'Bogotá D.C.',
        sectorActividad: adminSettings.sectorActividad || '',
        logoUrl: adminSettings.logoUrl || '',
        phone: adminSettings.telefono || '',
        email: adminSettings.email || '',
        website: adminSettings.sitioWeb || ''
    });
}
