const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const sqlPath = path.join(__dirname, '..', 'prisma', 'schema.sql');

console.log('🔄 Creating database at:', dbPath);

// Ensure prisma directory exists
const prismaDir = path.dirname(dbPath);
if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
}

// Create database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error creating database:', err);
        process.exit(1);
    }
    console.log('✅ Database file created');
});

// Read SQL schema
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('🔄 Executing SQL schema...');

// Execute the SQL
db.exec(sql, (err) => {
    if (err) {
        console.error('❌ Error executing SQL:', err);
        db.close();
        process.exit(1);
    }

    console.log('✅ Database schema created successfully!');

    // Verify tables
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
        if (err) {
            console.error('❌ Error querying tables:', err);
        } else {
            console.log('\n📋 Created tables:');
            tables.forEach(table => console.log('  -', table.name));
        }

        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err);
            }
            console.log('\n🎉 Database initialization complete!');
            console.log('📍 Database location:', dbPath);
        });
    });
});
