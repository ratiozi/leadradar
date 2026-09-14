import { useState, useEffect } from 'react'

const API_BASE = '/api'

function RecentLeadsTable() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/leads/recent?limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeads(data.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusBadge = (statusId) => {
    const badges = {
      'NEW': { label: 'Новый', color: 'bg-brand-blue/20 text-brand-blue' },
      'IN_PROGRESS': { label: 'В работе', color: 'bg-brand-cyan/20 text-brand-cyan' },
      'SUCCESS': { label: 'Сделка', color: 'bg-brand-green/20 text-brand-green' },
      'CANCELLED': { label: 'Отклонён', color: 'bg-brand-red/20 text-brand-red' }
    }
    const badge = badges[statusId] || { label: statusId, color: 'bg-gray-500/20 text-gray-400' }
    return (
      <span className={`px-2 py-1 rounded text-xs ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const getSourceIcon = (sourceId) => {
    const icons = {
      '1': '🌐 Сайт',
      '2': '📧 Email',
      '3': '📱 Telegram',
      '4': '📷 Instagram',
      '5': '📞 Звонки'
    }
    return icons[sourceId] || '📋 Другое'
  }

  if (loading) {
    return (
      <div className="bg-dark-700 rounded-lg p-5">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-dark-600 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-700 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Последние лиды</h3>
        <span className="text-xs text-gray-400">{leads.length} из {leads.length}</span>
      </div>

      <div className="space-y-2">
        {leads.map((lead, idx) => (
          <div
            key={lead.id || idx}
            className="flex items-center justify-between p-3 bg-dark-600 rounded hover:bg-dark-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-sm">
                {(lead.assigned_by_id || '?').toString().slice(-2)}
              </div>
              <div>
                <div className="text-sm font-medium">{lead.title || `Лид #${lead.bitrix_id}`}</div>
                <div className="text-xs text-gray-400">
                  {getSourceIcon(lead.source_id)} · {new Date(lead.date_create).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">{lead.opportunity?.toLocaleString('ru-RU')} {lead.currency_id || 'RUB'}</div>
                <div className="mt-1">
                  {getStatusBadge(lead.status_id)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Лиды не найдены</p>
            <p className="text-xs mt-1">Настройте webhook URL в настройках</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentLeadsTable
