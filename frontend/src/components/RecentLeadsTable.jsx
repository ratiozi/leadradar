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
      'NEW': { label: '�����', color: '#0088ff' },
      'IN_PROGRESS': { label: '� ������', color: '#00b8d4' },
      'SUCCESS': { label: '������', color: '#00a94f' },
      'CANCELLED': { label: '�����', color: '#ff2d55' }
    }
    const badge = badges[statusId] || { label: statusId, color: '#6b7280' }
    return (
      <span className="text-xs" style={{ color: badge.color }}>
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">��������� ����</h3>
        <span className="text-xs text-gray-400">{leads.length} �� {leads.length}</span>
      </div>

      <div className="space-y-2">
        {leads.map((lead, idx) => (
          <div
            key={lead.id || idx}
            className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-300">
                {lead.title?.charAt(0) || '?'}
              </div>
              <div>
                <div className="text-sm font-medium">{lead.title || `��� #${lead.bitrix_id}`}</div>
                <div className="text-xs text-gray-400">
                  {new Date(lead.date_create).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {lead.opportunity?.toLocaleString('ru-RU')} {lead.currency_id || '?'}
                </div>
                <div className="mt-1">
                  {getStatusBadge(lead.status_id)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">���� �� �������</p>
            <p className="text-xs mt-1">��������� webhook URL � ����������</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentLeadsTable
