const express = require('express');
const queries = require('../db/queries');

const router = express.Router();

/**
 * GET /api/leads/recent
 * Get recent leads for the table
 */
router.get('/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leads = queries.getRecentLeads(limit);
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error('[API] Recent leads error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/leads/search
 * Search leads by title
 */
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }
    const leads = queries.searchLeads(q);
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error('[API] Search leads error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
