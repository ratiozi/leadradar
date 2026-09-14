$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Write correct server.js using python
Write-Output "=== Write server.js via Python ==="
$writeServer = @{
    command = @"
python3 << 'PYEND'
content = '''require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const queries = require('./db/queries');
const SyncEngine = require('./sync/sync');
const analyticsRoutes = require('./routes/analytics');
const configRoutes = require('./routes/config');
const leadsRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
console.log('Serving frontend from:', frontendDist);

app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

let syncEngine = null;
let syncCron = null;

async function initSync() {
  const config = queries.getConfig('BITRIX_WEBHOOK_URL');
  
  if (config) {
    syncEngine = new SyncEngine(config.value);
    syncEngine.sync().catch(err => {
      console.error('[INIT] Initial sync failed:', err.message);
    });

    const intervalMinutes = parseInt(process.env.SYNC_INTERVAL) || 15;
    syncCron = cron.schedule('*/' + intervalMinutes + ' * * * *', async () => {
      console.log('[CRON] Starting scheduled sync...');
      syncEngine.sync().catch(err => {
        console.error('[CRON] Scheduled sync failed:', err.message);
      });
    });
    console.log('[INIT] Sync scheduled every ' + intervalMinutes + ' minutes');
  } else {
    console.log('[INIT] No webhook URL configured. Sync disabled.');
  }
}

app.listen(PORT, () => {
  console.log('[SERVER] LeadRadar running on port ' + PORT);
  initSync();
});

module.exports = app;
'''

with open('/opt/app/leadradar-master/backend/server.js', 'w') as f:
    f.write(content)
print('server.js written successfully')
PYEND
"@
    timeout = 15
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $writeServer
Write-Output $r.data.stdout

# Restart
Write-Output "`n=== Restart ==="
$restart = @{
    command = "pm2 restart leadradar-backend && sleep 3 && pm2 logs leadradar-backend --lines 5 --nostream"
    timeout = 30
} | ConvertTo-Json

$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $restart
Write-Output $r2.data.stdout

Write-Output "`n=== DONE ==="
