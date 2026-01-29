import { NextResponse } from 'next/server';
import { bibliotecaService } from '@/services/biblioteca.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const document = bibliotecaService.getDocumentById(parseInt(id));
            return NextResponse.json(document);
        }

        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const filters: any = {};
        if (category) filters.category = category;
        if (status) filters.status = status;
        if (search) filters.search = search;

        const documents = bibliotecaService.getAllDocuments(filters);
        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newDocument = bibliotecaService.createDocument(body);
        return NextResponse.json(newDocument, { status: 201 });
    } catch (error) {
        console.error('Error creating document:', error);
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }

        const updatedDocument = bibliotecaService.updateDocument(id, updateData);
        return NextResponse.json(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }

        const result = bibliotecaService.deleteDocument(parseInt(id));
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error deleting document:', error);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
