import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

/**
 * Helper genérico para leer/escribir archivos JSON actuando como "Tablas"
 */
class JSONCollection<T> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(DATA_DIR, fileName);
  }

  // Leer todos los registros
  getAll(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        // Si no existe, lo creamos vacío
        fs.writeFileSync(this.filePath, '[]', 'utf-8');
        return [];
      }
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  // Buscar por ID
  getById(id: string): T | undefined {
    const items = this.getAll();
    // @ts-ignore - Asumimos que T tiene un campo id
    return items.find((item) => item.id === id);
  }

  // Crear un registro
  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.save(items);
    return item;
  }

  // Actualizar un registro
  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    // @ts-ignore
    const index = items.findIndex((item) => item.id === id);
    
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    this.save(items);
    return items[index];
  }

  // Borrar un registro
  delete(id: string): boolean {
    let items = this.getAll();
    // @ts-ignore
    const initialLength = items.length;
    // @ts-ignore
    items = items.filter((item) => item.id !== id);
    
    if (items.length !== initialLength) {
      this.save(items);
      return true;
    }
    return false;
  }

  // Guardar cambios al disco
  private save(data: T[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Interfaces básicas inferidas de los archivos existentes
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  identification: string;
  salaryAmount: number;
  contractType: string;
  defaultPosition?: string; // Simplificado a string para JSON
  defaultSite?: string;     // Simplificado a string para JSON
  isActive: boolean;
  [key: string]: any; // Para flexibilidad
}

export interface PayrollRecord {
  id: string;
  period: string; // "2026-01-Q1" (Primera quincena Enero)
  employeeId: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  details: any[]; // Detalles de conceptos
  status: 'DRAFT' | 'PAID';
  createdAt: string;
}

export interface ConfigData {
  extras: any[];
  domesticas: any;
  seguridadSocial: any;
}

// Exportar instancias de las colecciones
export const db = {
  employees: new JSONCollection<Employee>('employees.json'),
  payroll: new JSONCollection<PayrollRecord>('payroll.json'),
  // gestion-humana no es una lista de registros, es un objeto de config, 
  // así que lo manejamos diferente o adaptamos la clase si fuera necesario.
  // Por ahora lo leeremos como raw.
  getConfig: () => {
    try {
        const p = path.join(DATA_DIR, 'gestion-humana.json');
        return JSON.parse(fs.readFileSync(p, 'utf-8')) as ConfigData;
    } catch(e) { return null; }
  }
};
