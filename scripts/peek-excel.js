const xlsx = require('xlsx');

function peekSheet(file) {
    const workbook = xlsx.readFile(file);
    console.log(`\n=== File: ${file} ===`);
    console.log(`Sheet Names: ${workbook.SheetNames.join(', ')}`);
    
    // Check first data sheet
    const sheetName = workbook.SheetNames[0];
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    data.slice(10, 30).forEach((row, i) => {
        console.log(`Row ${i + 10}:`, row);
    });
}

peekSheet('src/documentacion/Diagnostico y auditoria Seguridad.xlsx');
