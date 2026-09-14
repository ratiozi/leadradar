$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Fix server.js to serve frontend from correct path
Write-Output "=== Fix server.js ==="
$fixServer = @{
    command = @"
cd /opt/app/leadradar-master/backend

# Create a new server.js that serves frontend from correct path
cat > server-fixed.js << 'SERVEREOF'
require('dotenv').config();
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

// API Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/leads', leadsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend from correct path
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
console.log('Serving frontend from:', frontendDist);

app.use(express.static(frontendDist));

// SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Initialize sync
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
    syncCron = cron.schedule(\`*/\${intervalMinutes} * * * *\`, async () => {
      console.log('[CRON] Starting scheduled sync...');
      syncEngine.sync().catch(err => {
        console.error('[CRON] Scheduled sync failed:', err.message);
      });
    });
    console.log(\`[INIT] Sync scheduled every \${intervalMinutes} minutes\`);
  } else {
    console.log('[INIT] No webhook URL configured. Sync disabled.');
  }
}

app.listen(PORT, () => {
  console.log(\`[SERVER] LeadRadar running on port \${PORT}\`);
  initSync();
});

module.exports = app;
SERVEREOF

# Replace old server.js
mv server-fixed.js server.js
echo "server.js updated"

# Verify frontend dist exists
ls -la /opt/app/leadradar-master/frontend/dist/index.html

# Kill old process
fuser -k 3000/tcp 2>/dev/null
sleep 2

# Start with PM2
cd /opt/app/leadradar-master/backend
pm2 restart leadradar-backend 2>/dev/null || pm2 start server.js --name leadradar-backend 2>/dev/null || node server.js &
sleep 3

# Check if running
curl -s http://localhost:3000/api/health
echo ""
curl -s http://localhost:3000/ | head -c 200
"@
    timeout = 60
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $fixServer
Write-Output "Exit: $($r.data.exitCode)"
Write-Output $r.data.stdout

Write-Output "`n=== DONE ==="
