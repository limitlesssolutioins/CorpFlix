const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function initHrDatabase() {
    console.log('🔄 Iniciando creación de la base de datos de Recursos Humanos (hr.db)...');

    // Directorio de la empresa por defecto (ajustar si tienes múltiples empresas)
    const companyDir = path.join(process.cwd(), 'src', 'data', 'companies', 'lidus-1');
    
    if (!fs.existsSync(companyDir)) {
        console.log(`⚠️  El directorio de la empresa no existe: ${companyDir}`);
        console.log('   Creándolo ahora...');
        fs.mkdirSync(companyDir, { recursive: true });
    }

    const dbPath = path.join(companyDir, 'hr.db');
    console.log(`📍 Ruta de la base de datos: ${dbPath}`);

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('❌ Error al conectar/crear la base de datos:', err.message);
            process.exit(1);
        }
        console.log('✅ Conectado a la base de datos SQLite.');
    });

    const run = (sql) => {
        return new Promise((resolve, reject) => {
            db.run(sql, function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    try {
        // Tablas Catálogo
        await run(`CREATE TABLE IF NOT EXISTS Site (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            city TEXT,
            country TEXT DEFAULT 'Colombia',
            isActive INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        await run(`CREATE TABLE IF NOT EXISTS Position (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            department TEXT,
            description TEXT,
            isActive INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        await run(`CREATE TABLE IF NOT EXISTS Team (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            managerId TEXT,
            isActive INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabla Principal: Empleados
        await run(`CREATE TABLE IF NOT EXISTS Employee (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            identification TEXT UNIQUE NOT NULL,
            email TEXT,
            phone TEXT,
            contractType TEXT NOT NULL,
            salaryAmount REAL DEFAULT 0,
            salaryScheme TEXT DEFAULT 'FIJO',
            startDate DATE,
            epsEntity TEXT,
            arlEntity TEXT,
            pensionEntity TEXT,
            defaultSiteId TEXT,
            defaultPositionId TEXT,
            teamId TEXT,
            standardStartTime TEXT,
            standardEndTime TEXT,
            standardStartTime2 TEXT,
            standardEndTime2 TEXT,
            workDays TEXT,
            isActive INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(defaultSiteId) REFERENCES Site(id),
            FOREIGN KEY(defaultPositionId) REFERENCES Position(id),
            FOREIGN KEY(teamId) REFERENCES Team(id)
        )`);

        // Tablas Secundarias: Turnos, Ausencias, Documentos
        await run(`CREATE TABLE IF NOT EXISTS Shift (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            siteId TEXT NOT NULL,
            positionId TEXT,
            startTime DATETIME NOT NULL,
            endTime DATETIME NOT NULL,
            conflictStatus TEXT DEFAULT 'NONE',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(employeeId) REFERENCES Employee(id),
            FOREIGN KEY(siteId) REFERENCES Site(id),
            FOREIGN KEY(positionId) REFERENCES Position(id)
        )`);

        await run(`CREATE TABLE IF NOT EXISTS AbsenceType (
            code TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            isPaid INTEGER DEFAULT 0,
            color TEXT,
            isActive INTEGER DEFAULT 1
        )`);

        await run(`CREATE TABLE IF NOT EXISTS EmployeeAbsence (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            typeCode TEXT NOT NULL,
            startDate DATE NOT NULL,
            endDate DATE NOT NULL,
            status TEXT DEFAULT 'PENDING',
            notes TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(employeeId) REFERENCES Employee(id),
            FOREIGN KEY(typeCode) REFERENCES AbsenceType(code)
        )`);

        await run(`CREATE TABLE IF NOT EXISTS EmployeeDocument (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            fileUrl TEXT NOT NULL,
            expiryDate DATE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(employeeId) REFERENCES Employee(id)
        )`);

        await run(`CREATE TABLE IF NOT EXISTS AuditLog (
            id TEXT PRIMARY KEY,
            entity TEXT NOT NULL,
            entityId TEXT NOT NULL,
            action TEXT NOT NULL,
            details TEXT,
            performedBy TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        await run(`CREATE TABLE IF NOT EXISTS SystemConfiguration (
            id TEXT PRIMARY KEY DEFAULT '1',
            companyName TEXT NOT NULL,
            city TEXT,
            smlmv REAL DEFAULT 1300000,
            transportAid REAL DEFAULT 162000,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Datos Semilla (Iniciales Básicos)
        await run(`INSERT OR IGNORE INTO SystemConfiguration (id, companyName, city, smlmv, transportAid) VALUES ('1', 'Empresa Lidus', 'Bogotá', 1300000, 162000)`);
        
        await run(`INSERT OR IGNORE INTO AbsenceType (code, name, isPaid, color, isActive) VALUES 
            ('VAC', 'Vacaciones', 1, '#3b82f6', 1),
            ('INC', 'Incapacidad', 1, '#ef4444', 1),
            ('PER', 'Permiso', 0, '#f59e0b', 1),
            ('LIC_MAT', 'Licencia Maternidad', 1, '#ec4899', 1),
            ('LIC_PAT', 'Licencia Paternidad', 1, '#8b5cf6', 1),
            ('LIC_LUT', 'Licencia Luto', 1, '#1f2937', 1)
        `);

        console.log('✅ Estructura de tablas creada con éxito.');
        console.log('✅ Datos base (Tipos de Ausencia y Configuración) insertados.');

    } catch (error) {
        console.error('❌ Error ejecutando SQL:', error);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('❌ Error cerrando la base de datos:', err.message);
            } else {
                console.log('🎉 Inicialización de hr.db completada. La base de datos está lista para usarse.');
            }
        });
    }
}

initHrDatabase();
