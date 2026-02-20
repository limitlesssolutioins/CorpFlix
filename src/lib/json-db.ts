import fs from 'fs';
import path from 'path';

/**
 * Helper genérico para leer/escribir archivos JSON actuando como "Tablas"
 */
class JSONCollection<T> {
  private filePath: string;

  constructor(dataDir: string, fileName: string) {
    this.filePath = path.join(dataDir, fileName);
  }

  getAll(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) {
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

  getById(id: string): T | undefined {
    const items = this.getAll();
    // @ts-ignore
    return items.find((item) => item.id === id);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.save(items);
    return item;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    // @ts-ignore
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    this.save(items);
    return items[index];
  }

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

  private save(data: T[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  identification: string;
  salaryAmount: number;
  contractType: string;
  defaultPosition?: string;
  defaultSite?: string;
  isActive: boolean;
  [key: string]: any;
}

export interface PayrollRecord {
  id: string;
  period: string;
  employeeId: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  details: any[];
  status: 'DRAFT' | 'PAID';
  createdAt: string;
}

export interface ConfigData {
  extras: any[];
  domesticas: any;
  seguridadSocial: any;
}

export interface JsonDb {
  employees: JSONCollection<Employee>;
  payroll: JSONCollection<PayrollRecord>;
  getConfig: () => ConfigData | null;
}

export function getJsonDb(dataDir: string): JsonDb {
  return {
    employees: new JSONCollection<Employee>(dataDir, 'employees.json'),
    payroll: new JSONCollection<PayrollRecord>(dataDir, 'payroll.json'),
    getConfig: () => {
      try {
        const p = path.join(dataDir, 'gestion-humana.json');
        if (!fs.existsSync(p)) return null;
        return JSON.parse(fs.readFileSync(p, 'utf-8')) as ConfigData;
      } catch (e) { return null; }
    }
  };
}
