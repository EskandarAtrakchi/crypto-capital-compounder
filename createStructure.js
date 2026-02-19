const fs = require('fs');
const path = require('path');

const structure = {
  "trade-compound-tracker": {
    "index.html": "",
    "README.md": "# Trade Compounding Tracker",
    "favicon.png": "",
    "css": { "style.css": "" },
    "js": { "main.js": "" },
    "assets": { 
      "icons": {},
      "images": {}
    },
    "data": { "example-trades.json": "[]" },
    "docs": {}
  }
};

function createFolder(base, obj) {
  for (let key in obj) {
    const fullPath = path.join(base, key);
    if (typeof obj[key] === 'string') {
      fs.writeFileSync(fullPath, obj[key]);
    } else {
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      createFolder(fullPath, obj[key]);
    }
  }
}

createFolder('.', structure);
console.log('Folder structure created!');
