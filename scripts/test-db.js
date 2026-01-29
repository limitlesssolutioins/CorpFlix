const db = require('../src/lib/db');

async function testConnection() {
    console.log('🔄 Testing database connection...\n');

    try {
        // Test basic queries
        const sites = await db.all('SELECT * FROM Site');
        const positions = await db.all('SELECT * FROM Position');
        const teams = await db.all('SELECT * FROM Team');
        const employees = await db.all('SELECT * FROM Employee WHERE isActive = 1');
        const absenceTypes = await db.all('SELECT * FROM AbsenceType');
        const config = await db.get('SELECT * FROM SystemConfiguration LIMIT 1');

        console.log('✅ Database connected successfully!\n');
        console.log('📊 Database Statistics:');
        console.log('  - Sites:', sites.length);
        console.log('  - Positions:', positions.length);
        console.log('  - Teams:', teams.length);
        console.log('  - Employees:', employees.length);
        console.log('  - Absence Types:', absenceTypes.length);

        if (config) {
            console.log('\n⚙️  System Configuration:');
            console.log('  - Company:', config.companyName);
            console.log('  - City:', config.city);
            console.log('  - SMLMV:', config.smlmv);
            console.log('  - Transport Aid:', config.transportAid);
        }

        console.log('\n📋 Absence Types:');
        absenceTypes.forEach(type => {
            console.log(`  - ${type.code}: ${type.name}`);
        });

        console.log('\n🎉 Database is ready for use!');
        console.log('🌐 Access Turnos at: http://localhost:3000/turnos/dashboard');

    } catch (error) {
        console.error('❌ Error testing connection:', error);
        throw error;
    } finally {
        db.close();
    }
}

testConnection()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
