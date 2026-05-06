import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class BibliotecaService {
  constructor() {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }

  async getDashboardStats() {
    const companyId = await this.getCompanyContext();
    const [{ count: totalDocuments }] = await query<any[]>('SELECT COUNT(*) as count FROM Document WHERE companyId = ? AND status = ?', [companyId, 'ACTIVE']);
    const [{ count: totalCategories }] = await query<any[]>('SELECT COUNT(*) as count FROM DocumentCategory');
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [{ count: recentUploads }] = await query<any[]>('SELECT COUNT(*) as count FROM Document WHERE companyId = ? AND createdAt >= ?', [companyId, sevenDaysAgo]);

    return { totalDocuments, totalCategories, recentUploads, totalViews: 0, categoryStats: [], recentDocuments: [] };
  }

  async getAllCategories() {
    return await query<any[]>('SELECT * FROM DocumentCategory ORDER BY name ASC');
  }

  private mapDocuments(rows: any[]) {
    return rows.map(r => {
      const { cat_id, cat_name, cat_desc, cat_icon, ...docData } = r;
      return {
        ...docData,
        category: cat_id ? { id: cat_id, name: cat_name, description: cat_desc, icon: cat_icon } : null
      };
    });
  }

  async getRecentDocuments() {
    const companyId = await this.getCompanyContext();
    const sql = `
      SELECT d.*, c.id as cat_id, c.name as cat_name, c.description as cat_desc, c.icon as cat_icon
      FROM Document d
      LEFT JOIN DocumentCategory c ON d.categoryId = c.id
      WHERE d.companyId = ? AND d.status = 'ACTIVE'
      ORDER BY d.createdAt DESC
      LIMIT 10
    `;
    const rows = await query<any[]>(sql, [companyId]);
    return this.mapDocuments(rows);
  }

  async getAllDocuments(filters?: any) {
    const companyId = await this.getCompanyContext();
    const sql = `
      SELECT d.*, c.id as cat_id, c.name as cat_name, c.description as cat_desc, c.icon as cat_icon
      FROM Document d
      LEFT JOIN DocumentCategory c ON d.categoryId = c.id
      WHERE d.companyId = ?
      ORDER BY d.createdAt DESC
    `;
    const rows = await query<any[]>(sql, [companyId]);
    return this.mapDocuments(rows);
  }

  async searchDocuments(q: string) {
    const companyId = await this.getCompanyContext();
    const sql = `
      SELECT d.*, c.id as cat_id, c.name as cat_name, c.description as cat_desc, c.icon as cat_icon
      FROM Document d
      LEFT JOIN DocumentCategory c ON d.categoryId = c.id
      WHERE d.companyId = ? AND d.status = 'ACTIVE' AND d.title LIKE ?
      LIMIT 50
    `;
    const rows = await query<any[]>(sql, [companyId, `%${q}%`]);
    return this.mapDocuments(rows);
  }

    getAllTags() { return null as any; }
    getDocumentById(id: number) { return null as any; }
    createDocument(body: any) { return null as any; }
    updateDocument(id: string, data: any) { return null as any; }
    deleteDocument(id: number) { return null as any; }
}

export function getBibliotecaService(dataDir: string): BibliotecaService {
  return new BibliotecaService();
}