import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

function AnalyticsCharts({ trends, growth, sources, utm, team, timeOfDay, newVsProcessed, summary, avgCloseTime, getStatusColor }) {
  const [trendGranularity, setTrendGranularity] = useState('day')

  // Prepare trend data
  const trendData = trends?.map(t => ({
    period: t.period,
    leads: parseInt(t.leads_count),
    opportunity: parseFloat(t.opportunity)
  })) || []

  // Prepare growth data
  const growthPercent = growth?.leadsGrowth || 0
  const currentPeriod = growth?.currentPeriod?.leads || 0
  const previousPeriod = growth?.previousPeriod?.leads || 0

  // Prepare sources data
  const sourcesData = sources?.all?.slice(0, 5)?.map((s, idx) => ({
    name: `�������� ${s.source_id}`,
    count: s.count,
    opportunity: s.opportunity,
    fill: ['#0088ff', '#00b8d4', '#8b5cf6', '#d946ef', '#00a94f'][idx % 5]
  })) || []

  // Prepare time of day data
  const timeData = timeOfDay?.map(t => ({
    hour: `${t.hour}:00`,
    count: t.count
  })) || []

  // Prepare status data for donut
  const statusData = summary?.conversion?.map(c => ({
    name: getStatusName(c.status_id),
    value: parseInt(c.count),
    color: getStatusColor(c.status_id)
  })) || []

  const COLORS = ['#0088ff', '#00b8d4', '#8b5cf6', '#00a94f', '#ff2d55']

  function getStatusName(statusId) {
    const names = {
      'NEW': '�����',
      'IN_PROGRESS': '� ������',
      'SUCCESS': '������',
      'CANCELLED': '�����'
    }
    return names[statusId] || statusId
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Trends + Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads Trend */}
        <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium">�������� �����</h3>
              <p className="text-xs text-gray-400 mt-1">
                {trendData.length > 0 ? `${trendData[0].period} � ${trendData[trendData.length - 1].period}` : ''}
              </p>
            </div>
            <div className="flex gap-1">
              {['day', 'week', 'month'].map(gran => (
                <button
                  key={gran}
                  onClick={() => setTrendGranularity(gran)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    trendGranularity === gran
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {gran === 'day' ? '���' : gran === 'week' ? '������' : '������'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0088ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid #2d2d2d', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#0088ff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#0088ff] rounded-sm"></span>
              ������� ������
            </span>
          </div>
        </div>

        {/* Growth */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-sm font-medium">���� / �������</h3>
          </div>
          <div className="mb-4">
            <div className={`text-4xl font-bold ${growthPercent < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {growthPercent > 0 ? '+' : ''}{growthPercent}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ��������� � ����������� 30 �����
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400">������� ������</div>
              <div className="text-lg font-bold mt-1">{currentPeriod}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-400">������� ������</div>
              <div className="text-lg font-bold mt-1">{previousPeriod}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Statuses + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads by Status */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-sm font-medium">���� �� ��������</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2">
              {statusData.map((status, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></span>
                    <span className="text-sm text-gray-300">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{status.value}</span>
                    <span className="text-xs text-gray-400">
                      {summary?.total > 0 ? ((status.value / summary.total) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion by Status */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            <h3 className="text-sm font-medium">��������� �� ��������</h3>
          </div>

          <div className="space-y-4">
            {summary?.conversion?.map((conv, idx) => {
              const percent = summary?.total > 0 ? ((conv.count / summary.total) * 100).toFixed(0) : 0
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{getStatusName(conv.status_id)}</span>
                    <span className="font-medium">{conv.count} {percent}%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: getStatusColor(conv.status_id)
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Sources + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sources */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <h3 className="text-sm font-medium">���� �� ����������</h3>
          </div>

          <div className="space-y-3">
            {sourcesData.map((source, idx) => {
              const percent = sources?.all?.reduce((sum, s) => sum + s.count, 0) > 0
                ? ((source.count / sources.all.reduce((sum, s) => sum + s.count, 0)) * 100).toFixed(0)
                : 0
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }}></span>
                      <span className="text-gray-300">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{source.count}</span>
                      <span className="text-xs text-gray-400">{percent}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: source.fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Team */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-sm font-medium">���-5 ����������</h3>
          </div>

          <div className="space-y-3">
            {sourcesData.slice(0, 5).map((source, idx) => {
              const percent = sources?.all?.reduce((sum, s) => sum + s.count, 0) > 0
                ? ((source.count / sources.all.reduce((sum, s) => sum + s.count, 0)) * 100).toFixed(0)
                : 0
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-4">{idx + 1}</span>
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{source.count}</span>
                    <span className="text-xs text-gray-400">{percent}% � ������</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
