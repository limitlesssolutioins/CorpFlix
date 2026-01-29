import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/admin.json');

export class AdminService {
  private getData() {
    try {
      const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return { general: {}, roles: [], usuarios: [] };
    }
  }

  private saveData(data: any) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
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

export const adminService = new AdminService();
