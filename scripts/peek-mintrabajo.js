const xlsx = require('xlsx');
const fs = require('fs');

function peek(file) {
    const wb = xlsx.readFile(file);
    console.log('Sheets:', wb.SheetNames);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log('First 40 rows of first sheet:');
    data.slice(0, 40).forEach((row, i) => console.log(i, row));
}

peek('temp/CHECK LIST LABORAL ( MINISTERIO DE TRABAJO) (1).xlsx');
