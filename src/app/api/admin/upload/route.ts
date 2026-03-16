import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getCompanyId } from '@/lib/companyContext';
import fs from 'fs';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const prefix = file.type === 'application/pdf' ? 'doc' : 'logo';
    const filename = `${prefix}-${Date.now()}${path.extname(file.name)}`;
    
    // Ruta absoluta en el sistema de archivos
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', companyId);
    const filepath = path.join(uploadDir, filename);

    // Asegurar que el directorio existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    await writeFile(filepath, buffer);

    // Retornamos la URL pública (sin el prefijo 'public')
    return NextResponse.json({ 
      url: `/uploads/${companyId}/${filename}`,
      filename: filename
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
