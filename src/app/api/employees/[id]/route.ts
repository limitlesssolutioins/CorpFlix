
import { NextRequest, NextResponse } from 'next/server';
import { employeesService } from '@/services/employees.service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const employee = await employeesService.findOne(params.id);
        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const employee = await employeesService.update(params.id, body);
        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await employeesService.remove(params.id);
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
