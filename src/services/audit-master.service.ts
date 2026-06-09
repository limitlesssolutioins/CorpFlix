import { query } from '@/lib/db';

export interface AuditStandardMaster {
    id: number;
    code: string;
    name: string;
    fullName: string;
    category: string;
    color: string;
    description: string;
}

export interface AuditChapterMaster {
    id: number;
    standardId: number;
    chapterNumber: string;
    title: string;
}

export interface AuditRequirementMaster {
    id: number;
    chapterId: number;
    code: string;
    title: string;
    isAuditable: boolean;
    weight: number;
}

export class AuditMasterService {
    // CATEGORIES (Using a dedicated AuditCategory table with auto-initialization)
    private async ensureCategoryTableExists(): Promise<void> {
        await query(`
            CREATE TABLE IF NOT EXISTS AuditCategory (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(191) NOT NULL UNIQUE
            )
        `);

        // Check if empty, then seed default categories
        const countRes = await query<any[]>('SELECT COUNT(*) as count FROM AuditCategory');
        if (countRes[0]?.count === 0) {
            const defaults = ['Calidad', 'Ambiental', 'SST', 'Seguridad y Salud', 'Seguridad vial'];
            for (const cat of defaults) {
                await query('INSERT IGNORE INTO AuditCategory (name) VALUES (?)', [cat]);
            }
        }
    }

    async getCategories(): Promise<{ id: number; name: string }[]> {
        await this.ensureCategoryTableExists();
        return await query<{ id: number; name: string }[]>('SELECT id, name FROM AuditCategory ORDER BY name ASC');
    }

    async createCategory(name: string): Promise<number> {
        await this.ensureCategoryTableExists();
        const res = await query<any>('INSERT INTO AuditCategory (name) VALUES (?)', [name]);
        return res.insertId;
    }

    async updateCategory(id: number, name: string): Promise<void> {
        await this.ensureCategoryTableExists();
        // Fetch old name to update associated standards
        const existing = await query<any[]>('SELECT name FROM AuditCategory WHERE id = ?', [id]);
        if (existing.length === 0) throw new Error('Category not found');
        const oldName = existing[0].name;

        // Update category table
        await query('UPDATE AuditCategory SET name = ? WHERE id = ?', [name, id]);
        
        // Update standards table to keep sync
        await query('UPDATE AuditStandard SET category = ? WHERE category = ?', [name, oldName]);
    }

    async deleteCategory(id: number): Promise<void> {
        await this.ensureCategoryTableExists();
        // Fetch old name to clear associated standards
        const existing = await query<any[]>('SELECT name FROM AuditCategory WHERE id = ?', [id]);
        if (existing.length > 0) {
            const oldName = existing[0].name;
            // Clear category field in standards
            await query('UPDATE AuditStandard SET category = "" WHERE category = ?', [oldName]);
        }
        await query('DELETE FROM AuditCategory WHERE id = ?', [id]);
    }

    // STANDARDS
    async getStandards(): Promise<AuditStandardMaster[]> {
        return await query<AuditStandardMaster[]>('SELECT * FROM AuditStandard ORDER BY id ASC');
    }

    async createStandard(data: Partial<AuditStandardMaster>): Promise<number> {
        const res = await query<any>(`
            INSERT INTO AuditStandard (code, name, fullName, category, color, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [data.code, data.name, data.fullName, data.category, data.color || '#3b82f6', data.description || '']);
        return res.insertId;
    }

    async updateStandard(id: number, data: Partial<AuditStandardMaster>): Promise<void> {
        await query(`
            UPDATE AuditStandard SET code=?, name=?, fullName=?, category=?, color=?, description=?
            WHERE id=?
        `, [data.code, data.name, data.fullName, data.category, data.color, data.description, id]);
    }

    async deleteStandard(id: number): Promise<void> {
        // Cascade delete would be handled by DB if configured, otherwise manually:
        // For safety, we'll assume DB has constraints or we'll add them.
        await query('DELETE FROM AuditStandard WHERE id = ?', [id]);
    }

    // CHAPTERS
    async getChapters(standardId: number): Promise<AuditChapterMaster[]> {
        return await query<AuditChapterMaster[]>('SELECT * FROM AuditChapter WHERE standardId = ? ORDER BY CAST(chapterNumber AS UNSIGNED)', [standardId]);
    }

    async createChapter(data: Partial<AuditChapterMaster>): Promise<number> {
        const res = await query<any>(`
            INSERT INTO AuditChapter (standardId, chapterNumber, title)
            VALUES (?, ?, ?)
        `, [data.standardId, data.chapterNumber, data.title]);
        return res.insertId;
    }

    async updateChapter(id: number, data: Partial<AuditChapterMaster>): Promise<void> {
        await query('UPDATE AuditChapter SET chapterNumber=?, title=? WHERE id=?', [data.chapterNumber, data.title, id]);
    }

    async deleteChapter(id: number): Promise<void> {
        await query('DELETE FROM AuditChapter WHERE id = ?', [id]);
    }

    // REQUIREMENTS
    async getRequirements(chapterId: number): Promise<AuditRequirementMaster[]> {
        return await query<AuditRequirementMaster[]>('SELECT * FROM AuditRequirement WHERE chapterId = ? ORDER BY code', [chapterId]);
    }

    async createRequirement(data: Partial<AuditRequirementMaster>): Promise<number> {
        const res = await query<any>(`
            INSERT INTO AuditRequirement (chapterId, code, title, isAuditable, weight)
            VALUES (?, ?, ?, ?, ?)
        `, [data.chapterId, data.code, data.title, data.isAuditable ? 1 : 0, data.weight || 0]);
        return res.insertId;
    }

    async updateRequirement(id: number, data: Partial<AuditRequirementMaster>): Promise<void> {
        await query(`
            UPDATE AuditRequirement SET code=?, title=?, isAuditable=?, weight=?
            WHERE id=?
        `, [data.code, data.title, data.isAuditable ? 1 : 0, data.weight, id]);
    }

    async deleteRequirement(id: number): Promise<void> {
        await query('DELETE FROM AuditRequirement WHERE id = ?', [id]);
    }

    // VARIABLES / CRITERIA
    async getVariables(requirementId: number): Promise<any[]> {
        return await query<any[]>('SELECT * FROM RequirementVariable WHERE requirementId = ? ORDER BY `order` ASC', [requirementId]);
    }

    async saveVariables(requirementId: number, variables: string[]): Promise<void> {
        await query('DELETE FROM RequirementVariable WHERE requirementId = ?', [requirementId]);
        for (let i = 0; i < variables.length; i++) {
            await query('INSERT INTO RequirementVariable (requirementId, text, `order`) VALUES (?, ?, ?)', [requirementId, variables[i], i + 1]);
        }
    }
}

export const auditMasterService = new AuditMasterService();
