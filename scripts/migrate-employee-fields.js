const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function migrateEmployeesTable() {
    const dataDir = path.join(process.cwd(), 'src', 'data', 'companies');
    
    if (!fs.existsSync(dataDir)) {
        console.log('No companies directory found. Nothing to migrate.');
        return;
    }

    const companies = fs.readdirSync(dataDir).filter(f => fs.statSync(path.join(dataDir, f)).isDirectory());

    for (const companyId of companies) {
        const dbPath = path.join(dataDir, companyId, 'hr.db');
        
        if (!fs.existsSync(dbPath)) {
             continue; // Skip if hr.db doesn't exist
        }
        
        console.log(`🚀 MIGRATING DATABASE: ${dbPath}`);

        const db = new sqlite3.Database(dbPath);
        
        const alterTable = (sql) => new Promise((res, rej) => {
            db.run(sql, (err) => {
                if (err) {
                    if (err.message.includes('duplicate column name')) {
                        console.log(`Column already exists: ${sql.split('ADD COLUMN ')[1]}`);
                        res();
                    } else if (err.message.includes('no such table: Employee')) {
                         console.log(`Employee table does not exist in ${companyId}, skipping.`);
                         res(); // Resolve rather than reject so we don't break the loop for other companies
                    } else {
                        rej(err);
                    }
                } else {
                    console.log(`Successfully added column: ${sql.split('ADD COLUMN ')[1]}`);
                    res();
                }
            });
        });

        try {
            const columnsToAdd = [
                'address TEXT',
                'contractEndDate DATE',
                'isIntegralSalary INTEGER DEFAULT 0',
                'contractNumber TEXT',
                'payrollGroup TEXT',
                'costCenter TEXT',
                'contributorType TEXT',
                'contributorSubtype TEXT',
                'healthFundPercentage REAL DEFAULT 4',
                'pensionFundPercentage REAL DEFAULT 4',
                'severanceFund TEXT',
                'compensationFund TEXT',
                'riskClass TEXT',
                'ciiuCode TEXT'
            ];

            for (const col of columnsToAdd) {
                await alterTable(`ALTER TABLE Employee ADD COLUMN ${col}`);
            }
        } catch (e) {
            console.error(`❌ Migration Error for ${companyId}:`, e.message);
        } finally {
            db.close();
        }
    }
    console.log('✅ Employee table migration process finished.');
}

migrateEmployeesTable();
