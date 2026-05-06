import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';

const DEFAULT_CONFIG = {
  company: {
    name: 'Mi Empresa / Hogar',
    nit: '000.000.000-0',
    logoUrl: ''
  },
  cargos: [
    { id: '1', nombre: 'Operario General', salarioBase: 1300000, riesgoArl: 3 },
    { id: '2', nombre: 'Supervisor', salarioBase: 2500000, riesgoArl: 2 },
    { id: '3', nombre: 'Administrativo', salarioBase: 1800000, riesgoArl: 1 }
  ],
  turnosEstandar: [
    { id: '1', nombre: 'Turno Mañana (6h)', horas: 6, horaInicio: '06:00', horaFin: '12:00' },
    { id: '2', nombre: 'Turno Estándar (8h)', horas: 8, horaInicio: '08:00', horaFin: '17:00' },
    { id: '3', nombre: 'Turno Extendido (10h)', horas: 10, horaInicio: '08:00', horaFin: '18:00' },
    { id: '4', nombre: 'Turno Operativo (12h)', horas: 12, horaInicio: '06:00', horaFin: '18:00' }
  ]
};

export async function GET() {
  try {
    const dataDir = await getCompanyDataDir();
    const configPath = path.join(dataDir, 'gestion-humana.json');

    try {
      const fileContent = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(fileContent);
      
      // Asegurar campos nuevos
      if (!config.company) config.company = DEFAULT_CONFIG.company;
      if (!config.cargos) config.cargos = DEFAULT_CONFIG.cargos;
      if (!config.turnosEstandar) config.turnosEstandar = DEFAULT_CONFIG.turnosEstandar;

      return NextResponse.json(config);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
        return NextResponse.json(DEFAULT_CONFIG);
      }
      throw err;
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error reading configuration' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const dataDir = await getCompanyDataDir();
    const configPath = path.join(dataDir, 'gestion-humana.json');
    const newConfig = await req.json();
    
    // Guardar el JSON asegurando directorio
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
    
    return NextResponse.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error writing payroll config:', error);
    return NextResponse.json({ message: 'Error updating configuration' }, { status: 500 });
  }
}
