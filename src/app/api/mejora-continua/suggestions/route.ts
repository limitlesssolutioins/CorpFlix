import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getMejoraContinuaService } from '@/services/mejora-continua.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');

        const filters: any = {};
        if (status) filters.status = status;
        if (category) filters.category = category;

        const suggestions = mejoraContinuaService.getAllSuggestions(filters);
        return NextResponse.json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const body = await request.json();
        const newSuggestion = mejoraContinuaService.createSuggestion(body);
        return NextResponse.json(newSuggestion, { status: 201 });
    } catch (error) {
        console.error('Error creating suggestion:', error);
        return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Suggestion ID is required' }, { status: 400 });
        }

        const updatedSuggestion = mejoraContinuaService.updateSuggestion(id, updateData);
        return NextResponse.json(updatedSuggestion);
    } catch (error) {
        console.error('Error updating suggestion:', error);
        return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
    }
}
