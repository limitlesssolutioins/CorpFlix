const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'src', 'data');
const iso9001 = {};

fs.readdirSync(dataDir).forEach(file => {
    if (file.startsWith('iso9001_manual_ch') && file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        Object.assign(iso9001, data);
    }
});

// Convert to the { "4.1": { title: "...", criteria: [] } } format
const formatted = {};
for (const [code, criteria] of Object.entries(iso9001)) {
    // Try to find title from existing file if possible, or use a placeholder
    formatted[code] = {
        title: "", // This will be updated if we find it
        criteria: criteria
    };
}

// Try to preserve titles from the old file
const oldFile = path.join(dataDir, 'iso9001_criteria.json');
if (fs.existsSync(oldFile)) {
    const oldData = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
    for (const code in formatted) {
        if (oldData[code]) formatted[code].title = oldData[code].title;
    }
}

fs.writeFileSync(oldFile, JSON.stringify(formatted, null, 2), 'utf8');
console.log('Updated src/data/iso9001_criteria.json');
