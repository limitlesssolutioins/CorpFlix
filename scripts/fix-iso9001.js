const fs = require('fs');
let content = fs.readFileSync('src/data/criteria_seed.sql', 'utf-8');
const map = {
    '5.1': '5.1.1',
    '5.2': '5.2.1',
    '7.1': '7.1.1',
    '7.5': '7.5.1',
    '8.7': '8.7.1',
    '9.3': '9.3.1',
    '8.2': '8.2.1',
    '8.3': '8.3.1',
    '8.4': '8.4.1',
    '8.5': '8.5.1',
    '9.1': '9.1.1',
    '9.2': '9.2.1',
    '10.2': '10.2.1',
    '6.1': '6.1.1',
    '6.2': '6.2.1',
    '4.4': '4.4.1'
};

for (const [oldC, newC] of Object.entries(map)) {
    const regex = new RegExp(`WHERE requirement_code = '${oldC}'\\s*\\nAND chapter_id IN \\(SELECT id FROM iso_chapters WHERE standard_id = \\(SELECT id FROM audit_standards WHERE code = 'ISO9001'\\)\\);`, 'g');
    const replacement = `WHERE requirement_code = '${newC}' \nAND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));`;
    content = content.replace(regex, replacement);
}

// Remove the erroneous 5 LIDERAZGO criteria from 4.4.2
content = content.replace(/INSERT OR IGNORE INTO requirement_variables \(requirement_id, variable_text, variable_order\)\s*SELECT id, '5 LIDERAZGO', 3\s*FROM iso_requirements\s*WHERE requirement_code = '4.4.2'\s*AND chapter_id IN \(SELECT id FROM iso_chapters WHERE standard_id = \(SELECT id FROM audit_standards WHERE code = 'ISO9001'\)\);/g, '');

fs.writeFileSync('src/data/criteria_seed.sql', content);
console.log('Fixed ISO 9001 criteria mapping.');
