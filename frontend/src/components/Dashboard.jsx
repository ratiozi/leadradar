import { useState, useEffect } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import OverviewCards from './components/OverviewCards'
import AnalyticsCharts from './components/AnalyticsCharts'
import SourcesWidget from './components/SourcesWidget'
import ActivityWidget from './components/ActivityWidget'
import RecentLeadsTable from './components/RecentLeadsTable'

function Dashboard() {
  const { formatDate, getSummary, getGrowth, getTrends, getSources, getUTM, getTeam, getAvgCloseTime, getTimeOfDay, getNewVsProcessed } = useAnalytics()
  const [summary, setSummary] = useState(null)
  const [growth, setGrowth] = useState(null)
  const [trends, setTrends] = useState(null)
  const [sources, setSources] = useState(null)
  const [utm, setUtm] = useState(null)
  const [team, setTeam] = useState(null)
  const [avgCloseTime, setAvgCloseTime] = useState(null)
  const [timeOfDay, setTimeOfDay] = useState(null)
  const [newVsProcessed, setNewVsProcessed] = useState(null)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : timeRange === '90d' ? 90 : 30
    const to = new Date().toISOString().split('T')[0]
    const from = formatDate(days)

    Promise.all([
      getSummary(from, to),
      getGrowth(from, to),
      getTrends('day', from, to),
      getSources(from, to),
      getUTM(from, to),
      getTeam(from, to),
      getAvgCloseTime(from, to),
      getTimeOfDay(from, to),
      getNewVsProcessed(from, to)
    ]).then(([s, g, t, src, ut, tm, act, tod, nvp]) => {
      setSummary(s)
      setGrowth(g)
      setTrends(t)
      setSources(src)
      setUtm(ut)
      setTeam(tm)
      setAvgCloseTime(act)
      setTimeOfDay(tod)
      setNewVsProcessed(nvp)
    })
  }, [timeRange])

  const getStatusColor = (statusId) => {
    const colors = {
      'NEW': 'bg-brand-blue',
      'IN_PROGRESS': 'bg-brand-cyan',
      'SUCCESS': 'bg-brand-green',
      'CANCELLED': 'bg-brand-red'
    }
    return colors[statusId] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Лиды <span className="text-brand-blue text-sm bg-brand-blue/10 px-2 py-1 rounded">CRM</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-dark-700 border border-dark-500 rounded px-3 py-1.5 text-sm"
            >
              <option value="7d">7 дней</option>
              <option value="14d">14 дней</option>
              <option value="30d">30 дней</option>
              <option value="90d">90 дней</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Overview Section */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Обзор</h2>
          <OverviewCards
            summary={summary}
            growth={growth}
            avgCloseTime={avgCloseTime}
          />
        </section>

        {/* Analytics Section */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Аналитика</h2>
          <AnalyticsCharts
            trends={trends}
            sources={sources}
            utm={utm}
            team={team}
            timeOfDay={timeOfDay}
            newVsProcessed={newVsProcessed}
            getStatusColor={getStatusColor}
          />
        </section>

        {/* Recent Leads */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Лиды</h2>
          <RecentLeadsTable />
        </section>
      </main>
    </div>
  )
}

export default Dashboard
