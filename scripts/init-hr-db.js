const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function initHrDatabase() {
    console.log('🚀 INICIANDO INICIALIZADOR UNIVERSAL DE RECURSOS HUMANOS');

    const companiesRoot = path.join(process.cwd(), 'src', 'data', 'companies');
    
    if (!fs.existsSync(companiesRoot)) {
        console.log(`❌ No se encontró la carpeta raíz de empresas: ${companiesRoot}`);
        return;
    }

    const companies = fs.readdirSync(companiesRoot).filter(file => {
        return fs.statSync(path.join(companiesRoot, file)).isDirectory();
    });

    if (companies.length === 0) {
        console.log('⚠️ No se encontraron carpetas de empresas. Creando "default" por si acaso...');
        companies.push('default');
        fs.mkdirSync(path.join(companiesRoot, 'default'), { recursive: true });
    }

    for (const companyId of companies) {
        console.log(`\n-----------------------------------------`);
        console.log(`🏢 Procesando Empresa: ${companyId}`);
        const dbPath = path.join(companiesRoot, companyId, 'hr.db');
        console.log(`📍 Ruta: ${dbPath}`);

        const db = new sqlite3.Database(dbPath);
        
        const run = (sql) => new Promise((res, rej) => {
            db.run(sql, (err) => err ? rej(err) : res());
        });

        try {
            await run(`CREATE TABLE IF NOT EXISTS Site (id TEXT PRIMARY KEY, name TEXT NOT NULL, address TEXT, city TEXT, country TEXT DEFAULT 'Colombia', isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            await run(`CREATE TABLE IF NOT EXISTS Position (id TEXT PRIMARY KEY, name TEXT NOT NULL, department TEXT, description TEXT, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            await run(`CREATE TABLE IF NOT EXISTS Team (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, managerId TEXT, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            
            await run(`CREATE TABLE IF NOT EXISTS Employee (
                id TEXT PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, identification TEXT UNIQUE NOT NULL, email TEXT, phone TEXT,
                contractType TEXT NOT NULL, salaryAmount REAL DEFAULT 0, salaryScheme TEXT DEFAULT 'FIJO', startDate DATE,
                epsEntity TEXT, arlEntity TEXT, pensionEntity TEXT, defaultSiteId TEXT, defaultPositionId TEXT, teamId TEXT,
                standardStartTime TEXT, standardEndTime TEXT, standardStartTime2 TEXT, standardEndTime2 TEXT,
                workDays TEXT, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            await run(`CREATE TABLE IF NOT EXISTS Shift (id TEXT PRIMARY KEY, employeeId TEXT NOT NULL, siteId TEXT NOT NULL, positionId TEXT, startTime DATETIME NOT NULL, endTime DATETIME NOT NULL, conflictStatus TEXT DEFAULT 'NONE', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            await run(`CREATE TABLE IF NOT EXISTS AbsenceType (code TEXT PRIMARY KEY, name TEXT NOT NULL, isPaid INTEGER DEFAULT 0, color TEXT, isActive INTEGER DEFAULT 1)`);
            await run(`CREATE TABLE IF NOT EXISTS EmployeeAbsence (id TEXT PRIMARY KEY, employeeId TEXT NOT NULL, typeCode TEXT NOT NULL, startDate DATE NOT NULL, endDate DATE NOT NULL, status TEXT DEFAULT 'PENDING', notes TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            await run(`CREATE TABLE IF NOT EXISTS EmployeeDocument (id TEXT PRIMARY KEY, employeeId TEXT NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL, fileUrl TEXT NOT NULL, expiryDate DATE, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            await run(`CREATE TABLE IF NOT EXISTS AuditLog (id TEXT PRIMARY KEY, entity TEXT NOT NULL, entityId TEXT NOT NULL, action TEXT NOT NULL, details TEXT, performedBy TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
            await run(`CREATE TABLE IF NOT EXISTS SystemConfiguration (id TEXT PRIMARY KEY DEFAULT '1', companyName TEXT NOT NULL, city TEXT, smlmv REAL DEFAULT 1300000, transportAid REAL DEFAULT 162000, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);

            await run(`INSERT OR IGNORE INTO SystemConfiguration (id, companyName, city, smlmv, transportAid) VALUES ('1', 'Empresa Lidus', 'Bogotá', 1300000, 162000)`);
            await run(`INSERT OR IGNORE INTO AbsenceType (code, name, isPaid, color, isActive) VALUES ('VAC', 'Vacaciones', 1, '#3b82f6', 1), ('INC', 'Incapacidad', 1, '#ef4444', 1), ('PER', 'Permiso', 0, '#f59e0b', 1), ('LIC_MAT', 'Licencia Maternidad', 1, '#ec4899', 1), ('LIC_PAT', 'Licencia Paternidad', 1, '#8b5cf6', 1), ('LIC_LUT', 'Licencia Luto', 1, '#1f2937', 1)`);

            console.log(`✅ Estructura y datos base listos para ${companyId}`);
        } catch (e) {
            console.error(`❌ Error en ${companyId}:`, e.message);
        } finally {
            db.close();
        }
    }
    console.log('\n✨ Proceso finalizado.');
}

initHrDatabase();
