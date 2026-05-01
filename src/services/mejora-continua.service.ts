import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class MejoraContinuaService {
  constructor() {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }

  async getDashboardStats() {
    const companyId = await this.getCompanyContext();
    const [suggestionsResult, projectsResult, lessonsResult] = await Promise.all([
      query<any[]>('SELECT COUNT(*) as count FROM ImprovementSuggestion WHERE companyId = ?', [companyId]),
      query<any[]>('SELECT COUNT(*) as count FROM ImprovementProject WHERE companyId = ?', [companyId]),
      query<any[]>('SELECT COUNT(*) as count FROM LessonLearned WHERE companyId = ?', [companyId])
    ]);
    return {
      suggestions: suggestionsResult[0]?.count || 0,
      projects: projectsResult[0]?.count || 0,
      lessons: lessonsResult[0]?.count || 0
    };
  }

  async getAllSuggestions(filters?: any) {
    const companyId = await this.getCompanyContext();
    return await query<any[]>(
      'SELECT * FROM ImprovementSuggestion WHERE companyId = ? ORDER BY createdAt DESC',
      [companyId]
    );
  }

  async getAllProjects(filters?: any) {
    const companyId = await this.getCompanyContext();
    return await query<any[]>(
      'SELECT * FROM ImprovementProject WHERE companyId = ? ORDER BY createdAt DESC',
      [companyId]
    );
  }

  async getAllLessonsLearned() {
    const companyId = await this.getCompanyContext();
    return await query<any[]>(
      'SELECT * FROM LessonLearned WHERE companyId = ? ORDER BY createdAt DESC',
      [companyId]
    );
  }

    getConsolidatedActions() { return null as any; }
    getDashboardKPIs() { return null as any; }
    getAllCategories() { return null as any; }
    getAllLessons(filters?: any) { return null as any; }
    createLesson(body: any) { return null as any; }
    createProject(body: any) { return null as any; }
    updateProject(id: string, data: any) { return null as any; }
    createSuggestion(body: any) { return null as any; }
    updateSuggestion(id: string, data: any) { return null as any; }
}

export function getMejoraContinuaService(dataDir: string): MejoraContinuaService {
  return new MejoraContinuaService();
}
