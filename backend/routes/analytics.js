const express = require('express');
const queries = require('../db/queries');

const router = express.Router();

/**
 * GET /api/analytics/summary
 * Metrics: 1 (total), 2 (by status), 4 (conversion), + opportunity
 */
router.get('/summary', (req, res) => {
  try {
    const { from, to } = req.query;
    const summary = queries.getSummary(from, to);
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('[API] Summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/growth
 * Metric: 10 (growth/decline)
 */
router.get('/growth', (req, res) => {
  try {
    const { from, to } = req.query;
    const growth = queries.getGrowth(from, to);
    res.json({ success: true, data: growth });
  } catch (error) {
    console.error('[API] Growth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/trends
 * Metrics: 6 (day), 7 (week), 8 (month)
 */
router.get('/trends', (req, res) => {
  try {
    const { granularity = 'day', from, to } = req.query;
    const validGranularities = ['day', 'week', 'month'];
    const gran = validGranularities.includes(granularity) ? granularity : 'day';
    const trends = queries.getTrends(gran, from, to);
    res.json({ success: true, data: trends });
  } catch (error) {
    console.error('[API] Trends error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/sources
 * Metrics: 11 (by source), 13 (top 5)
 */
router.get('/sources', (req, res) => {
  try {
    const { from, to } = req.query;
    const sources = queries.getSources(from, to);
    res.json({ success: true, data: sources });
  } catch (error) {
    console.error('[API] Sources error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/utm
 * Metric: 12 (by UTM)
 */
router.get('/utm', (req, res) => {
  try {
    const { from, to } = req.query;
    const utm = queries.getUTM(from, to);
    res.json({ success: true, data: utm });
  } catch (error) {
    console.error('[API] UTM error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/team
 * Metrics: 15 (by member), 16 (avg per manager)
 */
router.get('/team', (req, res) => {
  try {
    const { from, to } = req.query;
    const team = queries.getTeam(from, to);
    res.json({ success: true, data: team });
  } catch (error) {
    console.error('[API] Team error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/avg-close-time
 * Metric: 18 (avg close time)
 */
router.get('/avg-close-time', (req, res) => {
  try {
    const { from, to } = req.query;
    const avgClose = queries.getAvgCloseTime(from, to);
    res.json({ success: true, data: avgClose });
  } catch (error) {
    console.error('[API] Avg close time error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/time-of-day
 * Metric: 19 (leads by hour)
 */
router.get('/time-of-day', (req, res) => {
  try {
    const { from, to } = req.query;
    const tod = queries.getTimeOfDay(from, to);
    res.json({ success: true, data: tod });
  } catch (error) {
    console.error('[API] Time of day error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/analytics/new-vs-processed
 * Metric: 20 (new vs processed)
 */
router.get('/new-vs-processed', (req, res) => {
  try {
    const { from, to } = req.query;
    const newVsProcessed = queries.getNewVsProcessed(from, to);
    res.json({ success: true, data: newVsProcessed });
  } catch (error) {
    console.error('[API] New vs processed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
