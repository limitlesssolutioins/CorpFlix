import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getRiskService } from '@/services/risk.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const { searchParams } = new URL(request.url);
        const assessment_id = searchParams.get('assessment_id');
        const status = searchParams.get('status');

        if (assessment_id) {
            const plans = riskService.getActionPlansByAssessment(parseInt(assessment_id));
            return NextResponse.json(plans);
        }

        const filters: any = {};
        if (status) filters.status = status;

        const plans = riskService.getAllActionPlans(filters);
        return NextResponse.json(plans);
    } catch (error) {
        console.error('Error fetching action plans:', error);
        return NextResponse.json({ error: 'Failed to fetch action plans' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const body = await request.json();
        const newPlan = riskService.createActionPlan(body);
        return NextResponse.json(newPlan, { status: 201 });
    } catch (error) {
        console.error('Error creating action plan:', error);
        return NextResponse.json({ error: 'Failed to create action plan' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Action plan ID is required' }, { status: 400 });
        }

        const updatedPlan = riskService.updateActionPlan(id, updateData);
        if (!updatedPlan) {
            return NextResponse.json({ error: 'Action plan not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPlan);
    } catch (error) {
        console.error('Error updating action plan:', error);
        return NextResponse.json({ error: 'Failed to update action plan' }, { status: 500 });
    }
}
