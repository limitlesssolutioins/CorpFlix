import { NextResponse } from 'next/server';
import { auditMasterService } from '@/services/audit-master.service';

// GET: Fetch all categories
export async function GET() {
    try {
        const categories = await auditMasterService.getCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST: Create a new category
export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        const insertId = await auditMasterService.createCategory(name);
        return NextResponse.json({ success: true, id: insertId });
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
    }
}

// PUT: Update an existing category
export async function PUT(req: Request) {
    try {
        const { id, name } = await req.json();
        if (!id || !name) {
            return NextResponse.json({ error: 'Id and name are required' }, { status: 400 });
        }
        await auditMasterService.updateCategory(id, name);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
    }
}

// DELETE: Delete a category
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Id is required' }, { status: 400 });
        }
        await auditMasterService.deleteCategory(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
    }
}
