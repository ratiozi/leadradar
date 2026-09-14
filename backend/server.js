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

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/leads', leadsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  
  // Catch-all: serve index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

// Initialize sync
let syncEngine = null;
let syncCron = null;

async function initSync() {
  const config = queries.getConfig('BITRIX_WEBHOOK_URL');
  
  if (config) {
    syncEngine = new SyncEngine(config.value);
    
    // Run initial sync in background
    syncEngine.sync().catch(err => {
      console.error('[INIT] Initial sync failed:', err.message);
    });

    // Schedule periodic sync (default every 15 minutes)
    const intervalMinutes = parseInt(process.env.SYNC_INTERVAL) || 15;
    syncCron = cron.schedule(`*/${intervalMinutes} * * * *`, async () => {
      console.log('[CRON] Starting scheduled sync...');
      syncEngine.sync().catch(err => {
        console.error('[CRON] Scheduled sync failed:', err.message);
      });
    });

    console.log(`[INIT] Sync scheduled every ${intervalMinutes} minutes`);
  } else {
    console.log('[INIT] No webhook URL configured. Sync disabled.');
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] LeadRadar backend running on port ${PORT}`);
  initSync();
});

module.exports = app;
