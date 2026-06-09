import { NextResponse } from 'next/server';
import { auditMasterService } from '@/services/audit-master.service';

export async function GET() {
    try {
        const categories = await auditMasterService.getCategories();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { oldName, newName } = await req.json();
        await auditMasterService.updateCategory(oldName, newName);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}
