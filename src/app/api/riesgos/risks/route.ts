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

        const category_code = searchParams.get('category_code');

        // Resolve category_code → category_id
        let resolvedCategoryId: number | undefined;
        if (category_code) {
            const cat = riskService.getCategoryByCode(category_code);
            if (cat?.id) resolvedCategoryId = cat.id;
        } else if (category_id) {
            resolvedCategoryId = parseInt(category_id);
        }

        const filters: any = {};
        if (resolvedCategoryId) filters.category_id = resolvedCategoryId;
        if (status) filters.status = status;

        const risks = riskService.getAllRisksWithAssessments(filters);
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

        // Support category_code instead of category_id
        if (body.category_code && !body.category_id) {
            const cat = riskService.getCategoryByCode(body.category_code);
            if (cat?.id) body.category_id = cat.id;
            delete body.category_code;
        }

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
