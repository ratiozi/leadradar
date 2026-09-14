const https = require('https');
const url = require('url');

class Bitrix24Client {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Make a REST API call to Bitrix24
   */
  async call(method, params = {}) {
    const parsedUrl = new URL(this.webhookUrl);
    const fullPath = parsedUrl.pathname + parsedUrl.search;

    return new Promise((resolve, reject) => {
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: fullPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              reject(new Error(`Bitrix24 API error: ${parsed.error}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${data}`));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(JSON.stringify(params));
      req.end();
    });
  }

  /**
   * Fetch leads with pagination
   * @param {Object} filter - Filter object
   * @param {string} order - Order object
   * @param {number} limit - Items per page (max 50)
   * @param {number} start - Pagination offset
   */
  async fetchLeads(filter = {}, order = { 'ID': 'ASC' }, limit = 50, start = 0) {
    const result = await this.call('crm.lead.list', {
      order: JSON.stringify(order),
      filter,
      select: [
        'ID', 'TITLE', 'STATUS_ID', 'STATUS_SEMANTIC_ID',
        'OPPORTUNITY', 'CURRENCY_ID', 'ASSIGNED_BY_ID',
        'CREATED_BY_ID', 'MODIFY_BY_ID', 'SOURCE_ID',
        'CONTACT_ID', 'COMPANY_ID', 'OPENED',
        'DATE_CREATE', 'DATE_MODIFY', 'DATE_CLOSED',
        'UF_CRM_Utm_Source', 'UF_CRM_Utm_Medium',
        'UF_CRM_Utm_Campaign', 'UF_CRM_Utm_Content',
        'UF_CRM_Utm_Term'
      ],
      limit,
      start
    });

    return result;
  }

  /**
   * Fetch all leads (with pagination and rate limiting)
   * @param {Object} filter - Optional filter
   */
  async fetchAllLeads(filter = {}) {
    const allLeads = [];
    let start = 0;
    const batchSize = 50;

    while (true) {
      const result = await this.fetchLeads(filter, { 'ID': 'ASC' }, batchSize, start);
      const leads = result.result || [];

      if (leads.length === 0) {
        break;
      }

      allLeads.push(...leads);
      start += leads.length;

      // Rate limiting: ~2 req/sec
      await this.sleep(500);
    }

    return allLeads;
  }

  /**
   * Fetch leads modified since a specific date
   */
  async fetchModifiedLeads(sinceDate) {
    const allLeads = [];
    let start = 0;
    const batchSize = 50;

    while (true) {
      const result = await this.fetchLeads(
        { '>DATE_MODIFY': sinceDate },
        { 'ID': 'ASC' },
        batchSize,
        start
      );
      const leads = result.result || [];

      if (leads.length === 0) {
        break;
      }

      allLeads.push(...leads);
      start += leads.length;

      await this.sleep(500);
    }

    return allLeads;
  }

  /**
   * Get a single lead by ID
   */
  async getLead(id) {
    const result = await this.call('crm.lead.get', { id });
    return result.result;
  }

  /**
   * Get available lead fields
   */
  async getFields() {
    const result = await this.call('crm.lead.fields');
    return result.result;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = Bitrix24Client;
