const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const BACKUP_FILE = path.join(__dirname, 'data', 'db.backup.json');

let cache = null;

function loadData() {
  if (cache) return cache;
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('Database file does not exist: ' + DATA_FILE);
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    cache = JSON.parse(raw);
    return cache;
  } catch (err) {
    console.error('Error reading db.json, attempting backup:', err);
    if (fs.existsSync(BACKUP_FILE)) {
      const backupRaw = fs.readFileSync(BACKUP_FILE, 'utf8');
      cache = JSON.parse(backupRaw);
      return cache;
    }
    throw err;
  }
}

function saveData(data) {
  cache = data;
  const json = JSON.stringify(data, null, 2);
  const tempFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tempFile, json, 'utf8');
  if (fs.existsSync(DATA_FILE)) {
    fs.copyFileSync(DATA_FILE, BACKUP_FILE);
  }
  fs.renameSync(tempFile, DATA_FILE);
}

module.exports = {
  loadData,
  saveData
};
