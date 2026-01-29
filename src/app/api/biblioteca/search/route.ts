import { NextResponse } from 'next/server';
import { bibliotecaService } from '@/services/biblioteca.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        const results = bibliotecaService.searchDocuments(query);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error searching documents:', error);
        return NextResponse.json({ error: 'Failed to search documents' }, { status: 500 });
    }
}
