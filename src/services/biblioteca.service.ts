import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const SCHEMA_PATH = path.join(process.cwd(), 'src', 'data', 'schema_biblioteca.sql');

class BibliotecaService {
    private db: Database.Database;

    constructor(dataDir: string) {
        const dbPath = path.join(dataDir, 'biblioteca.db');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        this.db = new Database(dbPath);
        this.initializeDatabase();
    }

    private initializeDatabase() {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        this.db.exec(schema);
    }

    // DOCUMENTS
    getAllDocuments(filters?: { category?: string; status?: string; search?: string }) {
        let query = `SELECT d.*, c.category_name
                 FROM documents d
                 LEFT JOIN document_categories c ON d.category_id = c.id
                 WHERE 1=1`;
        const params: any[] = [];

        if (filters?.category) {
            query += ' AND c.category_name = ?';
            params.push(filters.category);
        }

        if (filters?.status) {
            query += ' AND d.status = ?';
            params.push(filters.status);
        }

        if (filters?.search) {
            query += ' AND (d.title LIKE ? OR d.description LIKE ? OR d.keywords LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY d.upload_date DESC';
        return this.db.prepare(query).all(...params);
    }

    getDocumentById(id: number) {
        return this.db.prepare(`
      SELECT d.*, c.category_name
      FROM documents d
      LEFT JOIN document_categories c ON d.category_id = c.id
      WHERE d.id = ?
    `).get(id);
    }

    createDocument(data: any) {
        const code = `DOC-${Date.now()}`;
        const stmt = this.db.prepare(`
      INSERT INTO documents
      (document_code, title, description, category_id, file_path, file_name,
       file_size, file_type, mime_type, version, author, uploaded_by, keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            code,
            data.title,
            data.description || null,
            data.category_id,
            data.file_path,
            data.file_name,
            data.file_size || null,
            data.file_type || null,
            data.mime_type || null,
            data.version || '1.0',
            data.author || null,
            data.uploaded_by,
            data.keywords || null
        );

        return { id: result.lastInsertRowid, document_code: code };
    }

    updateDocument(id: number, data: any) {
        const stmt = this.db.prepare(`
      UPDATE documents
      SET title = ?, description = ?, category_id = ?, status = ?,
          keywords = ?, last_modified = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            data.title,
            data.description || null,
            data.category_id,
            data.status || 'PUBLISHED',
            data.keywords || null,
            id
        );

        return this.getDocumentById(id);
    }

    deleteDocument(id: number) {
        this.db.prepare('DELETE FROM documents WHERE id = ?').run(id);
        return { success: true };
    }

    incrementViews(id: number) {
        this.db.prepare('UPDATE documents SET views = views + 1 WHERE id = ?').run(id);
    }

    incrementDownloads(id: number) {
        this.db.prepare('UPDATE documents SET downloads = downloads + 1 WHERE id = ?').run(id);
    }

    // CATEGORIES
    getAllCategories() {
        return this.db.prepare('SELECT * FROM document_categories ORDER BY category_name').all();
    }

    // TAGS
    getAllTags() {
        return this.db.prepare('SELECT * FROM document_tags ORDER BY tag_name').all();
    }

    // SEARCH
    searchDocuments(query: string) {
        const searchTerm = `%${query}%`;
        return this.db.prepare(`
      SELECT d.*, c.category_name
      FROM documents d
      LEFT JOIN document_categories c ON d.category_id = c.id
      WHERE d.status = 'PUBLISHED'
        AND (d.title LIKE ? OR d.description LIKE ? OR d.keywords LIKE ?)
      ORDER BY d.views DESC, d.upload_date DESC
      LIMIT 50
    `).all(searchTerm, searchTerm, searchTerm);
    }

    // DASHBOARD
    getDashboardStats() {
        const totalDocuments = (this.db.prepare('SELECT COUNT(*) as count FROM documents WHERE status = \'PUBLISHED\'').get() as any).count;
        const totalCategories = (this.db.prepare('SELECT COUNT(*) as count FROM document_categories').get() as any).count;
        const recentUploads = (this.db.prepare('SELECT COUNT(*) as count FROM documents WHERE upload_date >= DATE(\'now\', \'-7 days\')').get() as any).count;
        const totalViews = (this.db.prepare('SELECT COALESCE(SUM(views), 0) as total FROM documents').get() as any).total;

        const categoryStats = this.db.prepare(`
      SELECT c.category_name, COUNT(d.id) as count
      FROM document_categories c
      LEFT JOIN documents d ON c.id = d.category_id AND d.status = 'PUBLISHED'
      GROUP BY c.id
      ORDER BY count DESC
    `).all();

        const recentDocuments = this.db.prepare(`
      SELECT d.*, c.category_name
      FROM documents d
      LEFT JOIN document_categories c ON d.category_id = c.id
      WHERE d.status = 'PUBLISHED'
      ORDER BY d.upload_date DESC
      LIMIT 10
    `).all();

        return {
            totalDocuments,
            totalCategories,
            recentUploads,
            totalViews,
            categoryStats,
            recentDocuments
        };
    }

    // ACCESS LOGS
    logAccess(documentId: number, accessedBy: string, accessType: string) {
        this.db.prepare(`
      INSERT INTO access_logs (document_id, accessed_by, access_type)
      VALUES (?, ?, ?)
    `).run(documentId, accessedBy, accessType);
    }
}

const instances = new Map<string, BibliotecaService>();

export function getBibliotecaService(dataDir: string): BibliotecaService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new BibliotecaService(dataDir));
    }
    return instances.get(dataDir)!;
}
