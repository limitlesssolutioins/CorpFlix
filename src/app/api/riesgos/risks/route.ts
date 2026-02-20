import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getRiskService } from '@/services/risk.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const { searchParams } = new URL(request.url);
        const category_id = searchParams.get('category_id');
        const status = searchParams.get('status');

        const filters: any = {};
        if (category_id) filters.category_id = parseInt(category_id);
        if (status) filters.status = status;

        const risks = riskService.getAllRisks(filters);
        return NextResponse.json(risks);
    } catch (error) {
        console.error('Error fetching risks:', error);
        return NextResponse.json({ error: 'Failed to fetch risks' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const body = await request.json();
        const newRisk = riskService.createRisk(body);
        return NextResponse.json(newRisk, { status: 201 });
    } catch (error) {
        console.error('Error creating risk:', error);
        return NextResponse.json({ error: 'Failed to create risk' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Risk ID is required' }, { status: 400 });
        }

        const updatedRisk = riskService.updateRisk(id, updateData);
        if (!updatedRisk) {
            return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
        }

        return NextResponse.json(updatedRisk);
    } catch (error) {
        console.error('Error updating risk:', error);
        return NextResponse.json({ error: 'Failed to update risk' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Risk ID is required' }, { status: 400 });
        }

        const deleted = riskService.deleteRisk(parseInt(id));
        if (!deleted) {
            return NextResponse.json({ error: 'Risk not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting risk:', error);
        return NextResponse.json({ error: 'Failed to delete risk' }, { status: 500 });
    }
}
