import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getBibliotecaService } from '@/services/biblioteca.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const bibliotecaService = getBibliotecaService(dataDir);
        const stats = bibliotecaService.getDashboardStats();
        const categories = bibliotecaService.getAllCategories();
        const tags = bibliotecaService.getAllTags();
        return NextResponse.json({ ...stats, allCategories: categories, allTags: tags });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
