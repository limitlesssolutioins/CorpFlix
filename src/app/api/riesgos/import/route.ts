import { NextResponse } from 'next/server';
import { riskService } from '@/services/risk.service';
import path from 'path';

// POST /api/riesgos/import - Importar riesgos desde catálogos JSON
export async function POST(request: Request) {
    try {
        const { category } = await request.json();

        if (!category) {
            return NextResponse.json(
                { error: 'Category code required' },
                { status: 400 }
            );
        }

        const catalogFiles: Record<string, string> = {
            CALIDAD: 'risk_catalog_quality.json',
            SST: 'risk_catalog_sst.json',
            AMBIENTAL: 'risk_catalog_environmental.json',
            CIBERSEGURIDAD: 'risk_catalog_cybersecurity.json',
            FINANCIERO: 'risk_catalog_financial.json',
            SEGURIDAD_VIAL: 'risk_catalog_road_safety.json'
        };

        const filename = catalogFiles[category];
        if (!filename) {
            return NextResponse.json(
                { error: 'Invalid category' },
                { status: 400 }
            );
        }

        const catalogPath = path.join(process.cwd(), 'src/data', filename);
        const count = riskService.importRisksFromCatalog(category, catalogPath);

        return NextResponse.json({
            success: true,
            category,
            imported: count
        });
    } catch (error) {
        console.error('Error importing risks:', error);
        return NextResponse.json(
            { error: 'Failed to import risks', details: (error as Error).message },
            { status: 500 }
        );
    }
}
