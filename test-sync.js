const SyncEngine = require('./sync/sync');

const webhookUrl = process.env.BITRIX_WEBHOOK_URL || 'https://nskstroy.bitrix24.ru/rest/4321/0xawnyavofz5jl4r/';
console.log('Webhook URL:', webhookUrl);

const sync = new SyncEngine(webhookUrl);

sync.fullSync()
  .then(result => {
    console.log('Sync result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Sync error:', error);
    process.exit(1);
  });
