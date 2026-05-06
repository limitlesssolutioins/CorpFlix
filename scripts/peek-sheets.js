const xlsx = require('xlsx');
const fs = require('fs');

function peek(file) {
    const wb = xlsx.readFile(file);
    console.log('Sheets:', wb.SheetNames);
}

peek('src/documentacion/Diagnostico y auditoria Seguridad.xlsx');
peek('temp/Diagnostico y auditoria Seguridad (1).xlsx');
