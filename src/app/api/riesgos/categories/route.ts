import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getRiskService } from '@/services/risk.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const categories = riskService.getAllCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching risk categories:', error);
        return NextResponse.json({ error: 'Failed to fetch risk categories' }, { status: 500 });
    }
}
