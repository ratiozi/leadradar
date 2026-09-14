const db = require('./db/init');
const stmt = db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)");
stmt.run('BITRIX_WEBHOOK_URL', process.env.WEBHOOK_URL);
console.log('Webhook saved:', process.env.WEBHOOK_URL);
