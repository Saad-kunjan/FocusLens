// Lightweight JSON file datastore.
// Keeps the project dependency-free (no native database drivers to install).
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "focuslens.json");

const EMPTY_DB = {
  logs: {},       // { "2026-10-22": { "github.com": 1240, "youtube.com": 600 } }  (seconds)
  categories: {}, // user overrides: { "reddit.com": "distracting" }
};

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

let db = load();

module.exports = {
  addTime(date, domain, seconds) {
    db.logs[date] = db.logs[date] || {};
    db.logs[date][domain] = (db.logs[date][domain] || 0) + seconds;
    save(db);
  },
  getDay(date) {
    return db.logs[date] || {};
  },
  getUserCategories() {
    return db.categories;
  },
  setCategory(domain, category) {
    db.categories[domain] = category;
    save(db);
  },
  replaceAll(newDb) {
    db = newDb;
    save(db);
  },
};
