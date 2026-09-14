import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Funnel, Clock } from 'lucide-react'

function AnalyticsCharts({ trends, sources, utm, team, timeOfDay, newVsProcessed, getStatusColor }) {
  const [trendGranularity, setTrendGranularity] = useState('day')

  // Prepare trend data
  const trendData = trends?.map(t => ({
    period: t.period,
    leads: parseInt(t.leads_count),
    opportunity: parseFloat(t.opportunity)
  })) || []

  // Prepare funnel data
  const funnelData = [
    { name: 'Заявки', value: trends?.[trends.length - 1]?.leads_count || 0, fill: '#0088ff' },
    { name: 'Квалификация', value: Math.floor((trends?.[trends.length - 1]?.leads_count || 0) * 0.64), fill: '#00b894' },
    { name: 'Демо', value: Math.floor((trends?.[trends.length - 1]?.leads_count || 0) * 0.42), fill: '#8b5cf6' },
    { name: 'Предложение', value: Math.floor((trends?.[trends.length - 1]?.leads_count || 0) * 0.28), fill: '#d946ef' },
    { name: 'Сделки', value: Math.floor((trends?.[trends.length - 1]?.leads_count || 0) * 0.17), fill: '#00a94f' }
  ]

  // Prepare time of day data
  const timeData = timeOfDay?.map(t => ({
    hour: `${t.hour}:00`,
    count: t.count
  })) || []

  // Prepare new vs processed data
  const nvData = newVsProcessed ? [
    { name: 'Новые', value: newVsProcessed.new, fill: '#0088ff' },
    { name: 'Обработанные', value: newVsProcessed.processed, fill: '#00b894' }
  ] : []

  const COLORS = ['#0088ff', '#00b894', '#8b5cf6', '#d946ef', '#ff8c00', '#ff2d55', '#06b6d4']

  return (
    <div className="space-y-4">
      {/* Row 1: Trends + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads & Deals Trend */}
        <div className="lg:col-span-2 bg-dark-700 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-sm font-semibold">Лиды и возможности</h3>
            </div>
            <div className="flex gap-2">
              {['day', 'week', 'month'].map(gran => (
                <button
                  key={gran}
                  onClick={() => setTrendGranularity(gran)}
                  className={`px-3 py-1 text-xs rounded ${trendGranularity === gran ? 'bg-brand-blue text-white' : 'bg-dark-600 text-gray-400'}`}
                >
                  {gran === 'day' ? 'Дни' : gran === 'week' ? 'Недели' : 'Месяцы'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-brand-blue rounded-sm"></span>
              Лиды
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-brand-orange rounded-sm"></span>
              Возможности
            </span>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0088ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#0088ff"
                fill="url(#leadsGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="opportunity"
                stroke="#ff8c00"
                fill="none"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div className="bg-brand-purple/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Funnel className="w-5 h-5 text-brand-purple" />
            <h3 className="text-sm font-semibold">Воронка</h3>
          </div>
          <div className="space-y-3">
            {funnelData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                <div className="bg-dark-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${funnelData[0].value > 0 ? (item.value / funnelData[0].value) * 100 : 0}%`,
                      backgroundColor: item.fill
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Sources + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sources */}
        <div className="bg-brand-pink/20 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Источники</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          
          {sources?.top5?.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-sm text-gray-300">Источник {source.source_id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{source.count}</span>
                <span className="text-xs text-gray-400">{source.opportunity.toLocaleString('ru-RU')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="bg-brand-cyan/20 rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Команда</h3>
          <div className="space-y-3">
            {team?.members?.slice(0, 5)?.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-brand-cyan/30 flex items-center justify-center text-xs font-bold">
                    {(member.assigned_by_id || '?').toString().slice(-2)}
                  </div>
                  <div>
                    <div className="text-sm">Менеджер {member.assigned_by_id}</div>
                    <div className="text-xs text-gray-400">{member.count} лидов</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{member.opportunity.toLocaleString('ru-RU')}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-dark-600 flex justify-between text-sm">
            <span className="text-gray-400">Среднее на менеджера</span>
            <span className="font-medium">{team?.avgPerManager || 0}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Time of Day + New vs Processed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Time of Day */}
        <div className="bg-dark-700 rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Активность по часам</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* New vs Processed */}
        <div className="bg-dark-700 rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Новые vs обр��ботанные</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={nvData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {nvData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
