const db = require('./init');

/**
 * Analytics queries for the 15 selected metrics
 */

/**
 * Metric 1: Total leads count
 * Metric 2: Leads by status
 */
function getSummary(dateFrom, dateTo) {
  const whereClause = buildDateWhere(dateFrom, dateTo);
  
  // Total leads
  const totalResult = db.prepare(`
    SELECT COUNT(*) as total
    FROM leads
    ${whereClause ? `WHERE ${whereClause}` : ''}
  `).get();

  // Leads by status
  const byStatus = db.prepare(`
    SELECT 
      status_id,
      COUNT(*) as count
    FROM leads
    ${whereClause ? `WHERE ${whereClause}` : ''}
    GROUP BY status_id
    ORDER BY count DESC
  `).all();

  // Conversion rate by status
  const conversion = byStatus.map(s => ({
    ...s,
    percentage: totalResult.total > 0 
      ? ((s.count / totalResult.total) * 100).toFixed(1) 
      : 0
  }));

  // Total opportunity
  const opportunityResult = db.prepare(`
    SELECT 
      COALESCE(SUM(opportunity), 0) as total_opportunity,
      currency_id
    FROM leads
    ${whereClause ? `WHERE ${whereClause}` : ''}
  `).get();

  return {
    total: totalResult.total,
    byStatus,
    conversion,
    totalOpportunity: opportunityResult.total_opportunity,
    currency: opportunityResult.currency_id || 'RUB'
  };
}

/**
 * Metric 10: Growth/decline (compare with previous period)
 */
function getGrowth(dateFrom, dateTo) {
  const periodMs = new Date(dateTo) - new Date(dateFrom);
  const prevFrom = new Date(new Date(dateFrom).getTime() - periodMs);
  const prevTo = new Date(new Date(dateTo).getTime() - periodMs);

  const current = db.prepare(`
    SELECT COUNT(*) as count, COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
  `).get(dateFrom, dateTo);

  const previous = db.prepare(`
    SELECT COUNT(*) as count, COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
  `).get(prevFrom.toISOString(), prevTo.toISOString());

  const leadsGrowth = previous.count > 0
    ? (((current.count - previous.count) / previous.count) * 100).toFixed(1)
    : 0;

  const oppGrowth = previous.opportunity > 0
    ? (((current.opportunity - previous.opportunity) / previous.opportunity) * 100).toFixed(1)
    : 0;

  return {
    currentPeriod: {
      leads: current.count,
      opportunity: current.opportunity
    },
    previousPeriod: {
      leads: previous.count,
      opportunity: previous.opportunity
    },
    leadsGrowth: parseFloat(leadsGrowth),
    oppGrowth: parseFloat(oppGrowth)
  };
}

/**
 * Metrics 6, 7, 8: Trends by day/week/month
 */
function getTrends(granularity, dateFrom, dateTo) {
  let dateField, formatClause;
  
  switch (granularity) {
    case 'week':
      dateField = 'strftime(\'%Y-W%W\', date_create)';
      break;
    case 'month':
      dateField = 'strftime(\'%Y-%m\', date_create)';
      break;
    default: // day
      dateField = 'strftime(\'%Y-%m-%d\', date_create)';
  }

  const rows = db.prepare(`
    SELECT 
      ${dateField} as period,
      COUNT(*) as leads_count,
      COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
    GROUP BY ${dateField}
    ORDER BY period ASC
  `).all(dateFrom, dateTo);

  return rows;
}

/**
 * Metrics 11, 13: Leads by source
 */
function getSources(dateFrom, dateTo) {
  const rows = db.prepare(`
    SELECT 
      COALESCE(source_id, 0) as source_id,
      COUNT(*) as count,
      COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
    GROUP BY source_id
    ORDER BY count DESC
    LIMIT 20
  `).all(dateFrom, dateTo);

  // Top 5
  const top5 = rows.slice(0, 5);

  return {
    all: rows,
    top5
  };
}

/**
 * Metric 12: Leads by UTM
 */
function getUTM(dateFrom, dateTo) {
  const utmSource = db.prepare(`
    SELECT 
      COALESCE(utm_source, \'(direct)\') as utm_value,
      COUNT(*) as count,
      COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ? AND utm_source IS NOT NULL AND utm_source != \'\'
    GROUP BY utm_source
    ORDER BY count DESC
  `).all(dateFrom, dateTo);

  const utmCampaign = db.prepare(`
    SELECT 
      COALESCE(utm_campaign, \'(direct)\') as utm_value,
      COUNT(*) as count,
      COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ? AND utm_campaign IS NOT NULL AND utm_campaign != \'\'
    GROUP BY utm_campaign
    ORDER BY count DESC
  `).all(dateFrom, dateTo);

  return {
    source: utmSource,
    campaign: utmCampaign
  };
}

/**
 * Metrics 15, 16: Leads by team member
 */
function getTeam(dateFrom, dateTo) {
  const rows = db.prepare(`
    SELECT 
      assigned_by_id,
      COUNT(*) as count,
      COALESCE(SUM(opportunity), 0) as opportunity
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
    GROUP BY assigned_by_id
    ORDER BY count DESC
  `).all(dateFrom, dateTo);

  const totalLeads = rows.reduce((sum, r) => sum + r.count, 0);
  const avgPerManager = rows.length > 0 
    ? (totalLeads / rows.length).toFixed(1) 
    : 0;

  return {
    members: rows,
    totalManagers: rows.length,
    avgPerManager: parseFloat(avgPerManager)
  };
}

/**
 * Metric 18: Average close time
 */
function getAvgCloseTime(dateFrom, dateTo) {
  const result = db.prepare(`
    SELECT 
      AVG(julianday(date_closed) - julianday(date_create)) as avg_days,
      COUNT(*) as closed_count
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
      AND date_closed IS NOT NULL
      AND date_closed != ''
  `).get(dateFrom, dateTo);

  return {
    avgDays: result.avg_days ? parseFloat(result.avg_days.toFixed(1)) : 0,
    closedCount: result.closed_count || 0
  };
}

/**
 * Metric 19: Leads by time of day
 */
function getTimeOfDay(dateFrom, dateTo) {
  const rows = db.prepare(`
    SELECT 
      CAST(strftime(\'%H\', date_create) AS INTEGER) as hour,
      COUNT(*) as count
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
    GROUP BY hour
    ORDER BY hour ASC
  `).all(dateFrom, dateTo);

  // Fill missing hours with 0
  const fullData = Array.from({ length: 24 }, (_, i) => {
    const found = rows.find(r => r.hour === i);
    return {
      hour: i,
      count: found ? found.count : 0
    };
  });

  return fullData;
}

/**
 * Metric 20: New vs processed leads
 */
function getNewVsProcessed(dateFrom, dateTo) {
  const newLeads = db.prepare(`
    SELECT COUNT(*) as count
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
      AND status_id = \'NEW\'
  `).get(dateFrom, dateTo);

  const processedLeads = db.prepare(`
    SELECT COUNT(*) as count
    FROM leads
    WHERE date_create >= ? AND date_create <= ?
      AND status_id IN (\'IN_PROGRESS\', \'SUCCESS\', \'CANCELLED\')
  `).get(dateFrom, dateTo);

  return {
    new: newLeads.count,
    processed: processedLeads.count
  };
}

/**
 * Get last N leads for the table
 */
function getRecentLeads(limit = 10) {
  return db.prepare(`
    SELECT 
      id, bitrix_id, title, status_id, opportunity,
      assigned_by_id, source_id,
      date_create,
      currency_id
    FROM leads
    ORDER BY date_create DESC
    LIMIT ?
  `).all(limit);
}

/**
 * Search leads by title
 */
function searchLeads(query, limit = 20) {
  return db.prepare(`
    SELECT 
      id, bitrix_id, title, status_id, opportunity,
      assigned_by_id, source_id, date_create, currency_id
    FROM leads
    WHERE title LIKE ?
    ORDER BY date_create DESC
    LIMIT ?
  `).all(`%${query}%`, limit);
}

/**
 * Get sync status
 */
function getSyncStatus() {
  const lastSync = db.prepare(`
    SELECT * FROM sync_log
    ORDER BY started_at DESC
    LIMIT 1
  `).get();

  return lastSync || { status: 'never' };
}

/**
 * Log sync
 */
function logSync(syncType, leadsSynced, status, error = null) {
  db.prepare(`
    INSERT INTO sync_log (sync_type, started_at, finished_at, leads_synced, status)
    VALUES (?, datetime(\'now\'), datetime(\'now\'), ?, ?)
  `).run(syncType, leadsSynced, status);
}

/**
 * Save config
 */
function saveConfig(key, value) {
  db.prepare(`
    INSERT OR REPLACE INTO config (key, value)
    VALUES (?, ?)
  `).run(key, value);
}

/**
 * Get config
 */
function getConfig(key) {
  return db.prepare(`
    SELECT value FROM config WHERE key = ?
  `).get(key);
}

function buildDateWhere(dateFrom, dateTo) {
  const conditions = [];
  if (dateFrom) conditions.push('date_create >= ?');
  if (dateTo) conditions.push('date_create <= ?');
  if (conditions.length === 0) return null;
  return conditions.join(' AND ');
}

module.exports = {
  getSummary,
  getGrowth,
  getTrends,
  getSources,
  getUTM,
  getTeam,
  getAvgCloseTime,
  getTimeOfDay,
  getNewVsProcessed,
  getRecentLeads,
  searchLeads,
  getSyncStatus,
  logSync,
  saveConfig,
  getConfig,
  buildDateWhere
};
