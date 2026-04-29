const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function migrateHR() {
    const companiesDir = path.join(process.cwd(), 'src', 'data', 'companies');
    if (!fs.existsSync(companiesDir)) {
        console.error("❌ Companies directory not found.");
        return;
    }
    const companies = fs.readdirSync(companiesDir).filter(f => fs.statSync(path.join(companiesDir, f)).isDirectory());

    for (const companyId of companies) {
        const dbPath = path.join(companiesDir, companyId, 'hr.db');
        
        console.log(`\n🚀 MIGRANDO/INICIALIZANDO BASE DE DATOS HR: ${companyId}`);
        const db = new sqlite3.Database(dbPath);
        const run = (sql) => new Promise((res, rej) => db.run(sql, (err) => err ? rej(err) : res()));

        try {
            // 1. Tablas Maestras
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

            // 2. Tabla Employee con el esquema completo solicitado
            await run(`CREATE TABLE IF NOT EXISTS Employee (
                id TEXT PRIMARY KEY,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                identification TEXT UNIQUE NOT NULL,
                documentType TEXT DEFAULT 'CC',
                documentExpeditionCity TEXT,
                birthDate DATE,
                gender TEXT,
                bloodType TEXT,
                email TEXT,
                phone TEXT,
                address TEXT,
                city TEXT,
                
                -- Información Bancaria
                bankName TEXT,
                bankAccountType TEXT, -- Ahorros, Corriente
                bankAccountNumber TEXT,
                
                -- Contacto Emergencia
                emergencyContactName TEXT,
                emergencyContactPhone TEXT,

                -- Información Laboral
                contractType TEXT NOT NULL, -- FIJO, INDEFINIDO, OBRA_LABOR, APRENDIZAJE
                contractNumber TEXT,
                startDate DATE,
                contractEndDate DATE,
                isIntegralSalary INTEGER DEFAULT 0,
                salaryAmount REAL DEFAULT 0,
                salaryScheme TEXT DEFAULT 'FIJO',
                payrollGroup TEXT,
                costCenter TEXT,
                
                -- Seguridad Social y PILA
                contributorType TEXT DEFAULT '01',
                contributorSubtype TEXT DEFAULT '00',
                healthFund TEXT,
                healthFundPercentage REAL DEFAULT 4,
                pensionFund TEXT,
                pensionFundPercentage REAL DEFAULT 4,
                severanceFund TEXT,
                compensationFund TEXT,
                arl TEXT,
                riskClass TEXT DEFAULT 'I',
                ciiuCode TEXT,
                
                -- Configuración de Jornada
                standardStartTime TEXT,
                standardEndTime TEXT,
                standardStartTime2 TEXT,
                standardEndTime2 TEXT,
                workDays TEXT,
                
                -- Relaciones
                defaultSiteId TEXT,
                defaultPositionId TEXT,
                teamId TEXT,
                
                isActive INTEGER DEFAULT 1,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(defaultSiteId) REFERENCES Site(id),
                FOREIGN KEY(defaultPositionId) REFERENCES Position(id),
                FOREIGN KEY(teamId) REFERENCES Team(id)
            )`);

            // 3. Tablas de Novedades y Ausencias
            await run(`CREATE TABLE IF NOT EXISTS AbsenceType (
                code TEXT PRIMARY KEY, 
                name TEXT NOT NULL, 
                isPaid INTEGER DEFAULT 0, 
                color TEXT, 
                isActive INTEGER DEFAULT 1
            )`);

            await run(`CREATE TABLE IF NOT EXISTS Absence (
                id TEXT PRIMARY KEY,
                employeeId TEXT NOT NULL,
                absenceTypeCode TEXT NOT NULL,
                startDate DATE NOT NULL,
                endDate DATE NOT NULL,
                diagnosisCode TEXT,
                medicalCertificateUrl TEXT,
                status TEXT DEFAULT 'PENDING_APPROVAL',
                notes TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(employeeId) REFERENCES Employee(id),
                FOREIGN KEY(absenceTypeCode) REFERENCES AbsenceType(code)
            )`);

            // 4. Tablas de Historial (ya creadas en paso previo pero aseguramos integridad)
            await run(`CREATE TABLE IF NOT EXISTS SalaryHistory (
                id TEXT PRIMARY KEY,
                employeeId TEXT NOT NULL,
                amount REAL NOT NULL,
                changeDate DATE NOT NULL,
                reason TEXT,
                notes TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(employeeId) REFERENCES Employee(id)
            )`);

            await run(`CREATE TABLE IF NOT EXISTS PositionHistory (
                id TEXT PRIMARY KEY,
                employeeId TEXT NOT NULL,
                positionId TEXT NOT NULL,
                changeDate DATE NOT NULL,
                reason TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(employeeId) REFERENCES Employee(id),
                FOREIGN KEY(positionId) REFERENCES Position(id)
            )`);

            await run(`CREATE TABLE IF NOT EXISTS DisciplinaryRecord (
                id TEXT PRIMARY KEY,
                employeeId TEXT NOT NULL,
                type TEXT NOT NULL,
                incidentDate DATE NOT NULL,
                description TEXT NOT NULL,
                sanctionDetails TEXT,
                fileUrl TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(employeeId) REFERENCES Employee(id)
            )`);

            await run(`CREATE TABLE IF NOT EXISTS PerformanceEvaluation (
                id TEXT PRIMARY KEY,
                employeeId TEXT NOT NULL,
                evaluatorId TEXT NOT NULL,
                evaluationDate DATE NOT NULL,
                score REAL,
                feedback TEXT,
                strengths TEXT,
                areasToImprove TEXT,
                fileUrl TEXT,
                status TEXT DEFAULT 'COMPLETED',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(employeeId) REFERENCES Employee(id)
            )`);

            // 5. Gestión Documental
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

            // 6. Asistencia y Turnos
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
                FOREIGN KEY(siteId) REFERENCES Site(id)
            )`);

            await run(`CREATE TABLE IF NOT EXISTS AttendanceLog (
                id TEXT PRIMARY KEY,
                employeeId TEXT NOT NULL,
                clockIn DATETIME NOT NULL,
                clockOut DATETIME,
                latitudeIn REAL,
                longitudeIn REAL,
                latitudeOut REAL,
                longitudeOut REAL,
                locationName TEXT,
                method TEXT DEFAULT 'MANUAL', -- MANUAL, GPS, BIOMETRIC
                notes TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(employeeId) REFERENCES Employee(id)
            )`);

            // 7. Configuración de Sistema (SMLMV, Auxilio Transporte)
            await run(`CREATE TABLE IF NOT EXISTS SystemConfiguration (
                id TEXT PRIMARY KEY DEFAULT '1', 
                companyName TEXT NOT NULL, 
                city TEXT, 
                smlmv REAL DEFAULT 1300000, 
                transportAid REAL DEFAULT 162000, 
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Datos Iniciales
            await run(`INSERT OR IGNORE INTO SystemConfiguration (id, companyName, city, smlmv, transportAid) VALUES ('1', '${companyId}', 'Bogotá', 1300000, 162000)`);
            await run(`INSERT OR IGNORE INTO AbsenceType (code, name, isPaid, color, isActive) VALUES 
                ('VAC', 'Vacaciones', 1, '#3b82f6', 1), 
                ('INC', 'Incapacidad', 1, '#ef4444', 1), 
                ('PER', 'Permiso', 0, '#f59e0b', 1), 
                ('LIC_MAT', 'Licencia Maternidad', 1, '#ec4899', 1), 
                ('LIC_PAT', 'Licencia Paternidad', 1, '#8b5cf6', 1), 
                ('LIC_LUT', 'Licencia Luto', 1, '#1f2937', 1)`);

            console.log(`✅ Base de datos HR robusta lista para ${companyId}`);
        } catch (e) {
            console.error(`❌ Error migrando ${companyId}:`, e.message);
        } finally {
            db.close();
        }
    }
}

migrateHR();
