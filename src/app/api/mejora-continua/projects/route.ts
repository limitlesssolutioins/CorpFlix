import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getMejoraContinuaService } from '@/services/mejora-continua.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const { searchParams } = new URL(request.url);
        const phase = searchParams.get('phase');
        const status = searchParams.get('status');

        const filters: any = {};
        if (phase) filters.phase = phase;
        if (status) filters.status = status;

        const projects = mejoraContinuaService.getAllProjects(filters);
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const body = await request.json();
        const newProject = mejoraContinuaService.createProject(body);
        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const mejoraContinuaService = getMejoraContinuaService(dataDir);
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const updatedProject = mejoraContinuaService.updateProject(id, updateData);
        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}
