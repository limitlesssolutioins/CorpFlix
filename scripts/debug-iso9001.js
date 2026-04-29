const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/Diagnostico y auditoria Calidad.xlsx');
const sheet = wb.Sheets['5 LIDERAZGO'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log("--- 5 LIDERAZGO RAW ROWS ---");
data.slice(0, 50).forEach((row, i) => {
    if (row[0]) console.log(`Row ${i}: ${JSON.stringify(row[0])}`);
});
