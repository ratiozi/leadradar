const express = require('express');
const queries = require('../db/queries');
const SyncEngine = require('../sync/sync');

const router = express.Router();

/**
 * GET /api/config
 * Get current configuration
 */
router.get('/', (req, res) => {
  try {
    const webhookUrl = queries.getConfig('BITRIX_WEBHOOK_URL');
    res.json({
      success: true,
      data: {
        webhookUrl: webhookUrl ? '***' + webhookUrl.value.slice(-8) : null,
        webhookConfigured: !!webhookUrl
      }
    });
  } catch (error) {
    console.error('[API] Config get error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/config
 * Update configuration (webhook URL)
 */
router.post('/', (req, res) => {
  try {
    const { webhookUrl } = req.body;

    if (!webhookUrl || !webhookUrl.includes('bitrix24')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Bitrix24 webhook URL'
      });
    }

    queries.saveConfig('BITRIX_WEBHOOK_URL', webhookUrl);
    console.log('[CONFIG] Webhook URL updated');

    res.json({ success: true, message: 'Configuration updated' });
  } catch (error) {
    console.error('[API] Config update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/sync/status
 * Get last sync status
 */
router.get('/status', (req, res) => {
  try {
    const status = queries.getSyncStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('[API] Sync status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/sync/refresh
 * Trigger manual sync
 */
router.post('/refresh', async (req, res) => {
  try {
    const config = queries.getConfig('BITRIX_WEBHOOK_URL');
    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'Webhook URL not configured'
      });
    }

    const syncEngine = new SyncEngine(config.value);
    const result = await syncEngine.sync();

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[API] Sync refresh error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
