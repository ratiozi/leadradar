const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'leadradar.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

// Initialize schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bitrix_id INTEGER UNIQUE,
      title TEXT,
      status_id TEXT,
      status_semantic_id TEXT,
      opportunity REAL,
      currency_id TEXT,
      assigned_by_id INTEGER,
      created_by_id INTEGER,
      modify_by_id INTEGER,
      source_id INTEGER,
      contact_id INTEGER,
      company_id INTEGER,
      opened INTEGER,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      date_create TEXT,
      date_modify TEXT,
      date_closed TEXT,
      synced_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_status ON leads(status_id);
    CREATE INDEX IF NOT EXISTS idx_date_create ON leads(date_create);
    CREATE INDEX IF NOT EXISTS idx_assigned_by ON leads(assigned_by_id);
    CREATE INDEX IF NOT EXISTS idx_source ON leads(source_id);
    CREATE INDEX IF NOT EXISTS idx_date_closed ON leads(date_closed);

    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sync_type TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      leads_synced INTEGER DEFAULT 0,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

initSchema();

module.exports = db;
