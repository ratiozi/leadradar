import { TrendingUp, TrendingDown } from 'lucide-react'

function OverviewCards({ summary, growth, avgCloseTime, team, getStatusColor }) {
  if (!summary) return <OverviewSkeleton />

  const totalLeads = summary.total || 0
  const currency = summary.currency || 'RUB'
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '�' : '?'
  const totalOpp = summary.totalOpportunity || 0

  const conversion = summary.conversion || []
  const successCount = conversion.find(c => c.status_id === 'SUCCESS')?.count || 0
  const successPercent = totalLeads > 0 ? ((successCount / totalLeads) * 100).toFixed(1) : '0.0'

  const growthPercent = growth?.leadsGrowth || 0
  const prevPeriod = growth?.previousPeriod?.leads || 0

  const avgDays = avgCloseTime?.avgDays || 0
  const avgHours = Math.floor((avgDays % 1) * 24)
  const avgDaysInt = Math.floor(avgDays)

  const avgPerManager = team?.avgPerManager || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Leads */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm text-gray-400">����� �����</span>
        </div>
        <div className="text-3xl font-bold mb-2">{totalLeads.toLocaleString('ru-RU')}</div>
        {prevPeriod > 0 && (
          <div className="flex items-center gap-2">
            {growthPercent < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
            <span className={`text-sm ${growthPercent < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {growthPercent > 0 ? '+' : ''}{growthPercent}%
            </span>
            <span className="text-xs text-gray-500">���� {prevPeriod.toLocaleString('ru-RU')}</span>
          </div>
        )}
      </div>

      {/* Card 2: Conversion */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm text-gray-400">��������� � ������</span>
        </div>
        <div className="text-3xl font-bold mb-2">{successPercent}%</div>
        <div className="text-xs text-gray-500">
          {successCount} ������ �� {totalLeads} �����
        </div>
      </div>

      {/* Card 3: Avg Close Time */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-400">������� ����� ��������</span>
        </div>
        <div className="text-3xl font-bold mb-2">
          {avgDaysInt} � {avgHours} �
        </div>
        <div className="text-xs text-gray-500">
          �� �������� ���� �� ������
        </div>
      </div>

      {/* Card 4: Leads per Manager */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-gray-400">����� �� ���������</span>
        </div>
        <div className="text-3xl font-bold mb-2">{avgPerManager}</div>
        <div className="text-xs text-gray-500">
          � ������� �� {team?.totalManagers || 0} ����������
        </div>
      </div>
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-[#111] border border-gray-800 rounded-xl p-5 h-32 animate-pulse" />
      ))}
    </div>
  )
}

export default OverviewCards
