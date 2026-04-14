const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/Diagnostico y auditoria Seguridad (1).xlsx');
const sheets = ['10 o menos T. - R. I,II,III', ' 11 a 50 T. - R. I,II,III', 'Más de 50 T ó R IV, V'];

const results = {};

sheets.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    data.forEach(row => {
        if (!row || row.length === 0) return;
        const code = String(row[0] || '').trim();
        // Look for typical Res 0312 codes like 1.1.1, 1.1.2, 2.1.1, etc.
        if (code.match(/^\d+\.\d+\.\d+$/)) {
            // The second column is usually the requirement title in this form
            // But where are the criteria? In column 3 (index 2) or 4 (index 3)?
            // We saw earlier: [ '1.1.1', 'Asignación de...', <8 empty>, '* Designado.\r\n* Perfil...', <8 empty>, 'Acta...' ]
            // So the criteria are in the cell that has '* Designado...'
            let criteriaText = '';
            for(let i=1; i<row.length; i++) {
                const cell = String(row[i] || '').trim();
                if (cell.includes('* ') || cell.includes('-\r\n') || cell.split('\n').length > 1) {
                    criteriaText = cell;
                    break;
                }
            }
            if (!criteriaText && String(row[1] || '').length > 0) {
                // fallback to the description if no specific criteria list
                criteriaText = String(row[1] || '').trim();
            }

            if (!results[code]) {
                results[code] = [];
            }
            
            const lines = criteriaText.split(/\r?\n/);
            lines.forEach(line => {
                const clean = line.replace(/^[\*\-\•]\s*/, '').trim();
                if (clean && !results[code].includes(clean)) {
                    results[code].push(clean);
                }
            });
        }
    });
});

fs.writeFileSync('src/data/res0312_extracted.json', JSON.stringify(results, null, 2));
console.log('Total RES 0312 criteria extracted:', Object.values(results).reduce((acc, curr) => acc + curr.length, 0));
