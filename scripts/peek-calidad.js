const xlsx = require('xlsx');
const fs = require('fs');

function peek(file) {
    const wb = xlsx.readFile(file);
    console.log('Sheets:', wb.SheetNames);
    const sheet = wb.Sheets['4 CONTEXTO'];
    if (!sheet) {
        console.log('Sheet 4 CONTEXTO not found');
        return;
    }
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log('First 40 rows of 4 CONTEXTO sheet:');
    data.slice(0, 40).forEach((row, i) => console.log(i, row));
}

peek('temp/Diagnostico y auditoria Calidad.xlsx');
