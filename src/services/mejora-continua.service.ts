import Database from 'better-sqlite3';
import path from 'path';

class MejoraContinuaService {
    private db: Database.Database;

    constructor() {
        const dbPath = path.join(process.cwd(), 'src', 'data', 'mejora_continua.db');
        this.db = new Database(dbPath);
        this.initializeDatabase();
    }

    private initializeDatabase() {
        const schemaPath = path.join(process.cwd(), 'src', 'data', 'schema_mejora_continua.sql');
        const schema = require('fs').readFileSync(schemaPath, 'utf8');
        this.db.exec(schema);
    }

    // SUGGESTIONS
    getAllSuggestions(filters?: { status?: string; category?: string }) {
        let query = `SELECT s.*, c.category_name, st.status_name, st.color as status_color 
                 FROM improvement_suggestions s 
                 LEFT JOIN improvement_categories c ON s.category_id = c.id 
                 LEFT JOIN suggestion_status st ON s.status_id = st.id 
                 WHERE 1=1`;
        const params: any[] = [];

        if (filters?.status) {
            query += ' AND st.status_code = ?';
            params.push(filters.status);
        }

        if (filters?.category) {
            query += ' AND c.category_name = ?';
            params.push(filters.category);
        }

        query += ' ORDER BY s.submitted_date DESC';
        return this.db.prepare(query).all(...params);
    }

    createSuggestion(data: any) {
        const code = `SUG-${Date.now()}`;
        const stmt = this.db.prepare(`
      INSERT INTO improvement_suggestions 
      (suggestion_code, title, description, category_id, submitted_by, area_affected, 
       current_situation, proposed_solution, expected_benefits, estimated_savings, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            code,
            data.title,
            data.description,
            data.category_id || null,
            data.submitted_by,
            data.area_affected || null,
            data.current_situation || null,
            data.proposed_solution || null,
            data.expected_benefits || null,
            data.estimated_savings || 0,
            data.priority || 3
        );

        return { id: result.lastInsertRowid, suggestion_code: code };
    }

    updateSuggestion(id: number, data: any) {
        const stmt = this.db.prepare(`
      UPDATE improvement_suggestions 
      SET status_id = ?, votes = ?, assigned_to = ?, evaluation_notes = ?, 
          implementation_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            data.status_id || null,
            data.votes || 0,
            data.assigned_to || null,
            data.evaluation_notes || null,
            data.implementation_date || null,
            id
        );

        return this.db.prepare('SELECT * FROM improvement_suggestions WHERE id = ?').get(id);
    }

    // PROJECTS
    getAllProjects(filters?: { phase?: string; status?: string }) {
        let query = `SELECT p.*, c.category_name 
                 FROM improvement_projects p 
                 LEFT JOIN improvement_categories c ON p.category_id = c.id 
                 WHERE 1=1`;
        const params: any[] = [];

        if (filters?.phase) {
            query += ' AND p.current_phase = ?';
            params.push(filters.phase);
        }

        if (filters?.status) {
            query += ' AND p.status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY p.start_date DESC';
        return this.db.prepare(query).all(...params);
    }

    createProject(data: any) {
        const code = `PRJ-${Date.now()}`;
        const stmt = this.db.prepare(`
      INSERT INTO improvement_projects 
      (project_code, title, description, category_id, suggestion_id, objective_smart, 
       scope, project_leader, team_members, start_date, target_end_date, budget, expected_roi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            code,
            data.title,
            data.description,
            data.category_id || null,
            data.suggestion_id || null,
            data.objective_smart || null,
            data.scope || null,
            data.project_leader,
            data.team_members || null,
            data.start_date,
            data.target_end_date || null,
            data.budget || 0,
            data.expected_roi || 0
        );

        return { id: result.lastInsertRowid, project_code: code };
    }

    updateProject(id: number, data: any) {
        const stmt = this.db.prepare(`
      UPDATE improvement_projects 
      SET current_phase = ?, status = ?, progress = ?, actual_cost = ?, 
          actual_roi = ?, actual_end_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            data.current_phase || null,
            data.status || null,
            data.progress || 0,
            data.actual_cost || null,
            data.actual_roi || null,
            data.actual_end_date || null,
            id
        );

        return this.db.prepare('SELECT * FROM improvement_projects WHERE id = ?').get(id);
    }

    // LESSONS LEARNED
    getAllLessons(filters?: { category?: string }) {
        let query = `SELECT l.*, c.category_name 
                 FROM lessons_learned l 
                 LEFT JOIN improvement_categories c ON l.category_id = c.id 
                 WHERE l.is_public = 1`;
        const params: any[] = [];

        if (filters?.category) {
            query += ' AND c.category_name = ?';
            params.push(filters.category);
        }

        query += ' ORDER BY l.lesson_date DESC';
        return this.db.prepare(query).all(...params);
    }

    createLesson(data: any) {
        const code = `LES-${Date.now()}`;
        const stmt = this.db.prepare(`
      INSERT INTO lessons_learned 
      (lesson_code, title, description, context, what_worked, what_didnt_work, 
       recommendations, category_id, project_id, submitted_by, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            code,
            data.title,
            data.description,
            data.context || null,
            data.what_worked || null,
            data.what_didnt_work || null,
            data.recommendations || null,
            data.category_id || null,
            data.project_id || null,
            data.submitted_by,
            data.tags || null
        );

        return { id: result.lastInsertRowid, lesson_code: code };
    }

    // DASHBOARD
    getDashboardKPIs() {
        const totalSuggestions = (this.db.prepare('SELECT COUNT(*) as count FROM improvement_suggestions').get() as any).count;
        const activeSuggestions = (this.db.prepare(`SELECT COUNT(*) as count FROM improvement_suggestions WHERE status_id IN (SELECT id FROM suggestion_status WHERE status_code IN ('NEW', 'UNDER_REVIEW', 'APPROVED'))`).get() as any).count;
        const activeProjects = (this.db.prepare(`SELECT COUNT(*) as count FROM improvement_projects WHERE status = 'ACTIVE'`).get() as any).count;
        const implementedImprovements = (this.db.prepare(`SELECT COUNT(*) as count FROM improvement_suggestions WHERE status_id = (SELECT id FROM suggestion_status WHERE status_code = 'IMPLEMENTED')`).get() as any).count;
        const totalSavings = (this.db.prepare('SELECT COALESCE(SUM(estimated_savings), 0) as total FROM improvement_suggestions WHERE status_id = (SELECT id FROM suggestion_status WHERE status_code = \'IMPLEMENTED\')').get() as any).total;

        return {
            totalSuggestions,
            activeSuggestions,
            activeProjects,
            implementedImprovements,
            totalSavings
        };
    }

    // CATEGORIES
    getAllCategories() {
        return this.db.prepare('SELECT * FROM improvement_categories ORDER BY category_name').all();
    }
}

export const mejoraContinuaService = new MejoraContinuaService();
