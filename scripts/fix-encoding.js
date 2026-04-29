const fs = require('fs');

const file = 'src/data/schema_auditoria.sql';
let content = fs.readFileSync(file, 'utf8');

// Fix common mangled UTF-8 characters
content = content.replace(/Ã³/g, 'ó')
                 .replace(/Ã¡/g, 'á')
                 .replace(/Ã©/g, 'é')
                 .replace(/Ã­/g, 'í')
                 .replace(/Ãº/g, 'ú')
                 .replace(/Ã±/g, 'ñ')
                 .replace(/Ã“/g, 'Ó')
                 .replace(/Ã /g, 'À')
                 .replace(/Ã‰/g, 'É')
                 .replace(/Ã /g, 'Í')
                 .replace(/Ãš/g, 'Ú')
                 .replace(/Ã‘/g, 'Ñ');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed encoding in schema_auditoria.sql');
