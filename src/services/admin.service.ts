import fs from 'fs';
import path from 'path';
import { query } from '@/lib/db';

export class AdminService {
  private dataPath: string;
  private companyId: string | null;

  constructor(dataDir: string) {
    this.dataPath = path.join(dataDir, 'admin.json');
    // Extraer companyId del dataDir (ej: .../src/data/companies/[companyId])
    const parts = dataDir.split(path.sep);
    // En entornos Linux path.sep es /
    this.companyId = parts[parts.length - 1] || null;
  }

  private getData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        const defaults = { general: {}, roles: [], usuarios: [] };
        const dir = path.dirname(this.dataPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.dataPath, JSON.stringify(defaults, null, 2));
        return defaults;
      }
      const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error("Error reading admin.json:", error);
      return { general: {}, roles: [], usuarios: [] };
    }
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  async getGeneralSettings() {
    const data = this.getData();
    const settings = data.general || {};

    // Si tenemos un companyId, intentamos complementar con MariaDB
    if (this.companyId) {
      try {
        const companies = await query<any[]>('SELECT * FROM Company WHERE id = ?', [this.companyId]);
        if (companies.length > 0) {
          const c = companies[0];
          // Priorizamos lo que esté en JSON pero si está vacío usamos MariaDB
          return {
            ...settings,
            nombreEmpresa: settings.nombreEmpresa || c.name,
            nit: settings.nit || c.nit,
            direccion: settings.direccion || c.address,
            telefono: settings.telefono || c.phone,
            email: settings.email || c.email,
            sectorActividad: settings.sectorActividad || c.industry,
          };
        }
      } catch (error) {
        console.error("Error fetching company from MariaDB:", error);
      }
    }

    return settings;
  }

  async updateGeneralSettings(settings: any) {
    const data = this.getData();
    data.general = { ...data.general, ...settings };
    this.saveData(data);

    // Sincronizar con MariaDB
    if (this.companyId) {
      try {
        await query(
          'UPDATE Company SET name = ?, nit = ?, address = ?, phone = ?, email = ?, industry = ? WHERE id = ?',
          [
            settings.nombreEmpresa || "",
            settings.nit || "",
            settings.direccion || "",
            settings.telefono || "",
            settings.email || "",
            settings.sectorActividad || "",
            this.companyId
          ]
        );
      } catch (error) {
        console.error("Error updating company in MariaDB:", error);
      }
    }

    return data.general;
  }

  getRoles() {
    const data = this.getData();
    return data.roles || [];
  }
}

const instances = new Map<string, AdminService>();

export function getAdminService(dataDir: string): AdminService {
  if (!instances.has(dataDir)) {
    instances.set(dataDir, new AdminService(dataDir));
  }
  return instances.get(dataDir)!;
}
