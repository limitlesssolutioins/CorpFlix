const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_PATH = path.join(DB_DIR, 'core.db');

if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Creamos una interfaz que simula el comportamiento básico que necesitamos
class CoreDatabase {
    private db: any;

    constructor() {
        this.db = new sqlite3.Database(DB_PATH);
        this.init();
    }

    private init() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS companies (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    nit TEXT,
                    sectorActividad TEXT,
                    direccion TEXT,
                    ciudad TEXT,
                    telefono TEXT,
                    email TEXT,
                    sitioWeb TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    company_id TEXT,
                    plan_id TEXT DEFAULT 'free',
                    status TEXT DEFAULT 'active',
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE SET NULL
                )
            `);
        });
    }

    // Adaptador para promesas (para mantener compatibilidad con el código que escribí)
    prepare(sql: string) {
        return {
            get: (param: any) => {
                return new Promise((resolve, reject) => {
                    this.db.get(sql, [param], (err: any, row: any) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });
            },
            run: (...params: any[]) => {
                return new Promise((resolve, reject) => {
                    this.db.run(sql, params, function(err: any) {
                        if (err) reject(err);
                        else resolve({ lastID: this.lastID, changes: this.changes });
                    });
                });
            }
        };
    }
}

const db = new CoreDatabase();
export default db;
