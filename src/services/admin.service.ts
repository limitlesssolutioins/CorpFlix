import fs from 'fs';
import path from 'path';

export class AdminService {
  private dataPath: string;

  constructor(dataDir: string) {
    this.dataPath = path.join(dataDir, 'admin.json');
  }

  private getData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        const defaults = { general: {}, roles: [], usuarios: [] };
        fs.writeFileSync(this.dataPath, JSON.stringify(defaults, null, 2));
        return defaults;
      }
      const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return { general: {}, roles: [], usuarios: [] };
    }
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  getGeneralSettings() {
    return this.getData().general;
  }

  updateGeneralSettings(settings: any) {
    const data = this.getData();
    data.general = { ...data.general, ...settings };
    this.saveData(data);
    return data.general;
  }

  getRoles() {
    return this.getData().roles;
  }
}

const instances = new Map<string, AdminService>();

export function getAdminService(dataDir: string): AdminService {
  if (!instances.has(dataDir)) {
    instances.set(dataDir, new AdminService(dataDir));
  }
  return instances.get(dataDir)!;
}
