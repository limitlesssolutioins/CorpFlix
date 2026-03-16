import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getCompanyId } from '@/lib/companyContext';

export async function POST(request: Request) {
  try {
    const companyId = await getCompanyId();
    if (!companyId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      return NextResponse.json({ error: "Invalid file type. Only images and PDFs are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generamos un nombre único para evitar caché
    const prefix = isPdf ? 'doc' : 'logo';
    const filename = `${prefix}-${Date.now()}${path.extname(file.name)}`;
    
    // Separamos por ID de empresa para aislamiento de datos
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', companyId);
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);

    // Retornamos la URL pública (incluyendo el ID de la empresa)
    return NextResponse.json({ url: `/uploads/${companyId}/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
