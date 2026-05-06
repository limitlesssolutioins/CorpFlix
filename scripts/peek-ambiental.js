const xlsx = require('xlsx');
const fs = require('fs');

function peek(file) {
    const wb = xlsx.readFile(file);
    console.log('Sheets:', wb.SheetNames);
    const sheet = wb.Sheets['CONTEXTO'];
    if (!sheet) {
        console.log('Sheet CONTEXTO not found');
        return;
    }
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log('First 40 rows of CONTEXTO sheet:');
    data.slice(0, 40).forEach((row, i) => console.log(i, row));
}

peek('temp/DIAGNOSTICO ALUTRAFICLED AMBIENTAL ISO 14001.xlsx');
