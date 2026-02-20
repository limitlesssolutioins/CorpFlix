import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getMejoraContinuaService } from '@/services/mejora-continua.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const filters: any = {};
        if (category) filters.category = category;

        const lessons = mejoraContinuaService.getAllLessons(filters);
        return NextResponse.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const body = await request.json();
        const newLesson = mejoraContinuaService.createLesson(body);
        return NextResponse.json(newLesson, { status: 201 });
    } catch (error) {
        console.error('Error creating lesson:', error);
        return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
    }
}
