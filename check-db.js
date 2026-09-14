const db = require('./db/init');
const r = db.prepare('SELECT COUNT(*) as count FROM leads').get();
console.log('Total leads:', r.count);
const l = db.prepare('SELECT id, bitrix_id, title, status_id FROM leads LIMIT 5').all();
l.forEach(lead => console.log(lead));
