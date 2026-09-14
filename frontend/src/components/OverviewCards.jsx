import { TrendingUp, TrendingDown } from 'lucide-react'

function OverviewCards({ summary, growth, avgCloseTime }) {
  if (!summary) return <OverviewSkeleton />

  const totalLeads = summary.total || 0
  const totalOpp = summary.totalOpportunity || 0
  const currency = summary.currency || 'RUB'
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₽'

  const conversion = summary.conversion || []
  const successRate = conversion.find(c => c.status_id === 'SUCCESS')
  const successPercent = successRate ? successRate.percentage : 0

  const growthPercent = growth?.leadsGrowth || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Last Lead / Total */}
      <div className="bg-brand-blue rounded-lg p-5 relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/10 p-2 rounded">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-white/60 text-xs">● LIVE</span>
        </div>
        <div className="text-white/70 text-sm mb-1">Всего лидов</div>
        <div className="text-3xl font-bold text-white">{totalLeads.toLocaleString('ru-RU')}</div>
        <div className="text-white/80 text-sm mt-2">{currencySymbol} {(totalOpp / 1000).toFixed(0)}K {currency}</div>
      </div>

      {/* Card 2: Conversion */}
      <div className="bg-brand-teal rounded-lg p-5 relative overflow-hidden">
        <div className="bg-white/10 p-2 rounded w-fit mb-4">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-4xl font-bold text-white mb-1">{successPercent}%</div>
        <div className="text-white/70 text-sm mb-3">Конверсия в сделку</div>
        <div className="flex items-center gap-1">
          {growthPercent >= 0 ? (
            <TrendingUp className="w-4 h-4 text-white/80" />
          ) : (
            <TrendingDown className="w-4 h-4 text-white/80" />
          )}
          <span className="text-white/80 text-sm">{growthPercent >= 0 ? '+' : ''}{growthPercent}%</span>
        </div>
      </div>

      {/* Card 3: Revenue */}
      <div className="bg-brand-green rounded-lg p-5 relative overflow-hidden">
        <div className="bg-white/10 p-2 rounded w-fit mb-4">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{currencySymbol} {totalOpp.toLocaleString('ru-RU')}</div>
        <div className="text-white/70 text-sm">Выручка</div>
        {growth && (
          <div className="text-white/80 text-sm mt-2">
            {growth.currentPeriod.opportunity.toLocaleString('ru-RU')} / {growth.previousPeriod.opportunity.toLocaleString('ru-RU')}
          </div>
        )}
      </div>

      {/* Card 4: Stats */}
      <div className="grid grid-rows-2 gap-2">
        <div className="bg-brand-orange rounded-lg p-4 flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{summary.byStatus?.find(s => s.status_id === 'IN_PROGRESS')?.count || 0}</div>
            <div className="text-white/70 text-xs">В работе</div>
          </div>
        </div>
        <div className="bg-brand-red rounded-lg p-4 flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{summary.byStatus?.find(s => s.status_id === 'CANCELLED')?.count || 0}</div>
            <div className="text-white/70 text-xs">Отклонено</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-dark-700 rounded-lg p-5 h-32 animate-pulse" />
      ))}
    </div>
  )
}

export default OverviewCards
