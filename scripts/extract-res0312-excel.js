const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/Diagnostico y auditoria Seguridad (1).xlsx');
const sheets = ['10 o menos T. - R. I,II,III', ' 11 a 50 T. - R. I,II,III', 'Más de 50 T ó R IV, V'];

const results = {};

sheets.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        const code = String(row[0] || '').trim();
        
        // Match 1.1.1, 2.1.1 etc
        if (code.match(/^\d+\.\d+\.\d+$/)) {
            let criteriaText = '';
            
            // Check current row for criteria (usually index 1, 2 or 3)
            for(let j=1; j<row.length; j++) {
                const cell = String(row[j] || '').trim();
                if (cell.includes('* ') || cell.includes('-\r\n') || cell.split('\n').length > 1) {
                    criteriaText = cell;
                    break;
                }
            }
            
            // If not found, check NEXT row (specifically columns 1 and 2 which are usually criteria)
            if (!criteriaText && data[i+1]) {
                const nextRow = data[i+1];
                const col1 = String(nextRow[1] || '').trim();
                const col2 = String(nextRow[2] || '').trim();
                
                if (col1.includes('*') || col1.split('\n').length > 1) {
                    criteriaText = col1;
                } else if (col2.includes('*') || col2.split('\n').length > 1) {
                    criteriaText = col2;
                } else if (nextRow[0] && (String(nextRow[0]).includes('*') || String(nextRow[0]).split('\n').length > 1)) {
                    // Sometimes it's in col 0 if it's a merged cell or misaligned
                    criteriaText = String(nextRow[0]).trim();
                }
            }

            if (!criteriaText && String(row[1] || '').length > 0) {
                criteriaText = String(row[1] || '').trim();
            }

            if (!results[code]) {
                results[code] = [];
            }
            
            const lines = criteriaText.split(/\r?\n/);
            lines.forEach(line => {
                const clean = line.replace(/^[\*\-\•Ø]\s*/, '').trim();
                if (clean && !results[code].includes(clean) && clean !== 'EVIDENCIAS' && clean !== 'OBSERVACIONES') {
                    results[code].push(clean);
                }
            });
        }
    }
});

fs.writeFileSync('src/data/res0312_extracted.json', JSON.stringify(results, null, 2));
console.log('Total RES 0312 criteria extracted:', Object.values(results).reduce((acc, curr) => acc + curr.length, 0));
