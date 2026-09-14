const db = require('./db/init');
const stmt = db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)");
stmt.run('BITRIX_WEBHOOK_URL', 'https://nskstroy.bitrix24.ru/rest/4321/fwil84p6i00dbcgp/');
console.log('Webhook saved successfully');
