const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    private db: any;
    private dbPath: string;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
        this.db = null;
    }

    connect() {
        if (!this.db) {
            this.db = new sqlite3.Database(this.dbPath, (err: any) => {
                if (err) {
                    console.error('Error connecting to database:', err);
                }
            });
        }
        return this.db;
    }

    run(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connect().run(sql, params, function (this: any, err: any) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    get(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connect().get(sql, params, (err: any, row: any) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.connect().all(sql, params, (err: any, rows: any[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

const instances = new Map<string, Database>();

function getDb(dbPath: string): Database {
    if (!instances.has(dbPath)) {
        instances.set(dbPath, new Database(dbPath));
    }
    return instances.get(dbPath)!;
}

module.exports = { getDb, Database };
