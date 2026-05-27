const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Intento de cargar DATABASE_URL del entorno o de un .env manual si existiera
const databaseUrl = process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/lidus'; 

async function fixLocalDatabase() {
    let pool;
    try {
        console.log('🚀 Iniciando reparación de títulos ISO 9001 en base de datos local...');
        
        // Configuración manual si DATABASE_URL falla por el error isServer anterior
        // El error "Cannot read properties of undefined (reading 'isServer')" ocurre cuando se pasa un objeto inválido o undefined a createPool.
        // Vamos a usar la URL directamente.
        pool = mysql.createPool(databaseUrl);

        const filePath = path.join(process.cwd(), 'src/data/iso9001_criteria.json');
        if (!fs.existsSync(filePath)) {
            console.error('❌ No se encontró src/data/iso9001_criteria.json');
            return;
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // 1. Obtener ID del estándar ISO9001
        const [stdRows] = await pool.query('SELECT id FROM AuditStandard WHERE code = "ISO9001"');
        if (!stdRows || stdRows.length === 0) {
            console.error('❌ Estándar ISO9001 no encontrado en la base de datos.');
            return;
        }
        const stdId = stdRows[0].id;

        let updated = 0;
        let created = 0;

        console.log(`✅ Procesando requisitos para Standard ID: ${stdId}...`);

        for (const [code, content] of Object.entries(data)) {
            const title = content.title;
            if (!title) continue;

            // Buscar si ya existe el requisito
            const [reqRows] = await pool.query(`
                SELECT r.id 
                FROM AuditRequirement r
                JOIN AuditChapter c ON r.chapterId = c.id
                WHERE c.standardId = ? AND r.code = ?
            `, [stdId, code]);

            if (reqRows && reqRows.length > 0) {
                await pool.query('UPDATE AuditRequirement SET title = ? WHERE id = ?', [title, reqRows[0].id]);
                updated++;
            } else {
                // Si falta (como el 4.4), insertarlo
                const chapterNum = code.split('.')[0];
                const [chRows] = await pool.query('SELECT id FROM AuditChapter WHERE standardId = ? AND chapterNumber = ?', [stdId, chapterNum]);
                
                if (chRows && chRows.length > 0) {
                    await pool.query(`
                        INSERT INTO AuditRequirement (chapterId, code, title, description, isAuditable, weight)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [chRows[0].id, code, title, '', 1, 0]);
                    created++;
                    console.log(`+ Creado requisito faltante: ${code} - ${title}`);
                }
            }
        }

        console.log(`\n🎉 Proceso completado:`);
        console.log(`   - Actualizados: ${updated}`);
        console.log(`   - Creados: ${created}`);

    } catch (e) {
        console.error('❌ Error fatal:', e.message);
        console.log('\n💡 Tip: Asegúrate de tener la variable de entorno DATABASE_URL configurada o edita este script con tus credenciales locales.');
    } finally {
        if (pool) await pool.end();
        process.exit(0);
    }
}

fixLocalDatabase();
