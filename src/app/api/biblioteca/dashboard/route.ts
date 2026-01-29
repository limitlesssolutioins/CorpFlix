import { NextResponse } from 'next/server';
import { bibliotecaService } from '@/services/biblioteca.service';

export async function GET() {
    try {
        const stats = bibliotecaService.getDashboardStats();
        const categories = bibliotecaService.getAllCategories();
        const tags = bibliotecaService.getAllTags();

        return NextResponse.json({ ...stats, allCategories: categories, allTags: tags });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
