const Bitrix24Client = require('./bitrix24');
const db = require('../db/init');
const queries = require('../db/queries');

class SyncEngine {
  constructor(webhookUrl) {
    this.client = new Bitrix24Client(webhookUrl);
  }

  /**
   * Full sync - fetch all leads
   */
  async fullSync() {
    const startTime = new Date();
    console.log('[SYNC] Starting full sync...');

    try {
      const leads = await this.client.fetchAllLeads();
      let saved = 0;

      for (const lead of leads) {
        this.saveLead(lead);
        saved++;
      }

      queries.logSync('full', saved, 'success');
      console.log(`[SYNC] Full sync completed: ${saved} leads in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
      return { success: true, count: saved, duration: Date.now() - startTime };
    } catch (error) {
      console.error('[SYNC] Full sync failed:', error.message);
      queries.logSync('full', 0, 'error', error.message);
      throw error;
    }
  }

  /**
   * Incremental sync - fetch only modified leads
   */
  async incrementalSync() {
    const startTime = new Date();
    console.log('[SYNC] Starting incremental sync...');

    try {
      // Get last sync time
      const lastSync = queries.getSyncStatus();
      let sinceDate;

      if (lastSync.status === 'success' && lastSync.finished_at) {
        sinceDate = lastSync.finished_at;
      } else {
        // First incremental - go back 24 hours
        sinceDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19);
      }

      const leads = await this.client.fetchModifiedLeads(sinceDate);
      let saved = 0;

      for (const lead of leads) {
        this.saveLead(lead);
        saved++;
      }

      queries.logSync('incremental', saved, 'success');
      console.log(`[SYNC] Incremental sync completed: ${saved} leads in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
      return { success: true, count: saved, duration: Date.now() - startTime };
    } catch (error) {
      console.error('[SYNC] Incremental sync failed:', error.message);
      queries.logSync('incremental', 0, 'error', error.message);
      throw error;
    }
  }

  /**
   * Save/update a single lead in database
   */
  saveLead(lead) {
    const stmt = db.prepare(`
      INSERT INTO leads (
        bitrix_id, title, status_id, status_semantic_id,
        opportunity, currency_id, assigned_by_id,
        created_by_id, modify_by_id, source_id,
        contact_id, company_id, opened,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        date_create, date_modify, date_closed, synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(bitrix_id) DO UPDATE SET
        title = excluded.title,
        status_id = excluded.status_id,
        status_semantic_id = excluded.status_semantic_id,
        opportunity = excluded.opportunity,
        currency_id = excluded.currency_id,
        assigned_by_id = excluded.assigned_by_id,
        modify_by_id = excluded.modify_by_id,
        source_id = excluded.source_id,
        contact_id = excluded.contact_id,
        company_id = excluded.company_id,
        opened = excluded.opened,
        utm_source = excluded.utm_source,
        utm_medium = excluded.utm_medium,
        utm_campaign = excluded.utm_campaign,
        utm_content = excluded.utm_content,
        utm_term = excluded.utm_term,
        date_modify = excluded.date_modify,
        date_closed = excluded.date_closed,
        synced_at = excluded.synced_at
    `);

    // Map Bitrix24 fields to DB fields
    const dateCreate = lead.DATE_CREATE ? this.toSqlDate(lead.DATE_CREATE) : null;
    const dateModify = lead.DATE_MODIFY ? this.toSqlDate(lead.DATE_MODIFY) : null;
    const dateClosed = lead.DATE_CLOSED ? this.toSqlDate(lead.DATE_CLOSED) : null;

    stmt.run(
      lead.ID,
      lead.TITLE || null,
      lead.STATUS_ID || null,
      lead.STATUS_SEMANTIC_ID || null,
      lead.OPPORTUNITY ? parseFloat(lead.OPPORTUNITY) : 0,
      lead.CURRENCY_ID || null,
      lead.ASSIGNED_BY_ID || null,
      lead.CREATED_BY_ID || null,
      lead.MODIFY_BY_ID || null,
      lead.SOURCE_ID || null,
      lead.CONTACT_ID || null,
      lead.COMPANY_ID || null,
      lead.OPENED || null,
      lead.UF_CRM_Utm_Source || null,
      lead.UF_CRM_Utm_Medium || null,
      lead.UF_CRM_Utm_Campaign || null,
      lead.UF_CRM_Utm_Content || null,
      lead.UF_CRM_Utm_Term || null,
      dateCreate,
      dateModify,
      dateClosed,
      new Date().toISOString().replace('T', ' ').substring(0, 19)
    );
  }

  /**
   * Convert Bitrix24 date to SQL datetime format
   */
  toSqlDate(bitrixDate) {
    if (!bitrixDate) return null;
    const date = new Date(bitrixDate);
    if (isNaN(date)) return null;
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Run sync based on last sync status
   */
  async sync() {
    const lastSync = queries.getSyncStatus();
    
    if (lastSync.status === 'success') {
      return this.incrementalSync();
    } else {
      return this.fullSync();
    }
  }
}

module.exports = SyncEngine;
