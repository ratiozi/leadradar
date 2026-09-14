$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Create fixed versions of the 4 broken files
$files = @{
    "src/components/AnalyticsCharts.jsx" = @"
import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

function AnalyticsCharts({ trends, growth, sources, utm, team, timeOfDay, newVsProcessed, summary, avgCloseTime, getStatusColor }) {
  const [trendGranularity, setTrendGranularity] = useState('day')

  const PIE_COLORS = ['#0088ff', '#00b894', '#8b5cf6', '#d946ef', '#ff8c00', '#ff2d55', '#06b6d4', '#84cc16', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#a855f7', '#e11d48', '#0ea5e9']

  const formatNumber = (n) => n?.toLocaleString('ru-RU') || '0'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Trends */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Динамика лидов</h3>
          <div className="flex gap-1">
            {['day', 'week', 'month'].map(g => (
              <button
                key={g}
                onClick={() => setTrendGranularity(g)}
                className={`px-2 py-1 text-xs rounded ${trendGranularity === g ? 'bg-brand-blue text-white' : 'bg-dark-700 text-gray-400'}`}
              >
                {g === 'day' ? 'Дни' : g === 'week' ? 'Недели' : 'Месяцы'}
              </button>
            ))}
          </div>
        </div>
        {trends?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="period" stroke="#4b5563" fontSize={11} />
              <YAxis stroke="#4b5563" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line type="monotone" dataKey="leads" stroke="#0088ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">Нет данных</div>
        )}
      </div>

      {/* Growth */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <h3 className="text-lg font-semibold mb-4">Рост / падение</h3>
        {growth ? (
          <div>
            <p className="text-sm text-gray-400 mb-3">сравнение с предыдущими 30 днями</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-xs text-gray-400">Текущий период</p>
                <p className="text-xl font-bold">{formatNumber(growth.current?.total)}</p>
                <p className="text-xs text-gray-500">лидов</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-xs text-gray-400">Прошлый период</p>
                <p className="text-xl font-bold">{formatNumber(growth.previous?.total)}</p>
                <p className="text-xs text-gray-500">лидов</p>
              </div>
            </div>
            {growth.changePercent !== undefined && (
              <div className={`mt-3 flex items-center gap-2 ${growth.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {growth.changePercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-bold">{growth.changePercent > 0 ? '+' : ''}{growth.changePercent}%</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[150px] flex items-center justify-center text-gray-500">Нет данных</div>
        )}
      </div>

      {/* Statuses Pie */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <h3 className="text-lg font-semibold mb-4">Лиды по статусам</h3>
        {summary?.byStatus?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summary.byStatus}
                dataKey="count"
                nameKey="status_id"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                strokeWidth={0}
              >
                {summary.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">Нет данных</div>
        )}
      </div>

      {/* Conversion by Status */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <h3 className="text-lg font-semibold mb-4">Конверсия по статусам</h3>
        {summary?.conversion?.length > 0 ? (
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {summary.conversion.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-20 truncate">{getStatusColor(item.status_id) ? item.status_id : 'UNKNOWN'}</span>
                <div className="flex-1 bg-dark-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: getStatusColor(item.status_id) || '#6b7280' }}
                  />
                </div>
                <span className="text-xs text-gray-300 w-12 text-right">{item.percentage}%</span>
                <span className="text-xs text-gray-500 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">Нет данных</div>
        )}
      </div>

      {/* Sources */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <h3 className="text-lg font-semibold mb-4">Лиды по источникам</h3>
        <p className="text-xs text-gray-400 mb-3">Топ-5 источников</p>
        {sources?.top5?.length > 0 ? (
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {sources.top5.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-32 truncate">Источник {s.source_id}</span>
                <div className="flex-1 bg-dark-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-brand-blue"
                    style={{ width: `${(s.count / (sources.total || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-300 w-8 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">Нет данных</div>
        )}
      </div>

      {/* UTM */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <h3 className="text-lg font-semibold mb-4">UTM-аналитика</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm text-gray-400 mb-2">По source</h4>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {utm?.source?.slice(0, 5)?.map((u, i) => (
                <div key={i} className="text-xs flex justify-between">
                  <span className="text-gray-300 truncate">{u.source || '—'}</span>
                  <span className="text-gray-500">{u.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-400 mb-2">По campaign</h4>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {utm?.campaign?.slice(0, 5)?.map((u, i) => (
                <div key={i} className="text-xs flex justify-between">
                  <span className="text-gray-300 truncate">{u.campaign || '—'}</span>
                  <span className="text-gray-500">{u.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts
"@
    "src/components/Header.jsx" = @"
import { Search, Plus, Download, Phone, Mail } from 'lucide-react'

function Header({ onSearch }) {
  return (
    <header className="bg-dark-800 border-b border-dark-600 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Лиды CRM</h1>
            <p className="text-xs text-gray-400">Управление и аналитика</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск лидов"
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-dark-700 hover:bg-dark-600 px-3 py-2 rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" />
              <span>Новый</span>
            </button>
            <button className="flex items-center gap-1 bg-dark-700 hover:bg-dark-600 px-3 py-2 rounded-lg text-sm transition-colors">
              <Download className="w-4 h-4" />
              <span>Экспорт</span>
            </button>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Звонок">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Почта">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
"@
    "src/components/ActivityWidget.jsx" = @"
import { UserPlus, CheckCircle, FileText, PhoneOff } from 'lucide-react'

function ActivityWidget() {
  const activities = [
    { icon: UserPlus, text: 'Новый лид: Елена Козлова в Telegram', time: '12:41', color: 'text-brand-blue' },
    { icon: CheckCircle, text: 'Сделка с Иваном Петровым закрыта на 156 000 ₽', time: '11:58', color: 'text-brand-green' },
    { icon: FileText, text: 'Отправлено КП: Сергей Смирнов на 210 000 ₽', time: '11:20', color: 'text-brand-cyan' },
    { icon: PhoneOff, text: 'Пропущенный звонок: +7 912 345-67-89', time: '10:47', color: 'text-brand-red' }
  ]

  const IconComponent = ({ icon: Icon }) => <Icon className={`w-4 h-4 ${Icon === CheckCircle ? 'text-brand-green' : Icon === PhoneOff ? 'text-brand-red' : 'text-brand-blue'}`} />

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Активность</h3>
        <span className="text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-full">СЕГОДНЯ</span>
      </div>
      <div className="space-y-3">
        {activities.map((a, i) => {
          const Icon = a.icon
          return (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-dark-700/50 transition-colors">
              <div className={`mt-0.5 ${a.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">{a.text}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityWidget
"@
    "src/components/SourcesWidget.jsx" = @"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

function SourcesWidget({ sources }) {
  const data = sources?.top5?.slice(0, 6)?.map((s, idx) => ({
    name: `Источник ${s.source_id}`,
    value: s.count,
    opportunity: s.opportunity
  })) || []

  const COLORS = ['#0088ff', '#00b894', '#8b5cf6', '#d946ef', '#ff8c00', '#ff2d55']

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
      <h3 className="text-lg font-semibold mb-4">Источники</h3>
      {data.length > 0 ? (
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-xs text-gray-300 truncate flex-1">{s.name}</span>
                <span className="text-xs text-gray-500">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-500">Нет данных</div>
      )}
    </div>
  )
}

export default SourcesWidget
"@
}

# Upload each file via VibeCode exec
foreach ($entry in $files.GetEnumerator()) {
    $path = $entry.Key
    $content = $entry.Value
    
    # Create python script to write file
    $escapedContent = $content -replace "'", "'\"'\"'"
    $pythonScript = @"
import os
os.makedirs(os.path.dirname('$path'), exist_ok=True)
with open('$path', 'w', encoding='utf-8') as f:
    f.write('''$(($content -replace "'''", "'\"'\"'\"'\"'\"'"))''')
print('Written:', '$path')
"@
    
    Write-Output "Uploading: $path"
    
    $body = @{
        command = "cd /opt/app/frontend && python3 << 'HEREDOC'
$pythonScript
HEREDOC"
        timeout = 30
    } | ConvertTo-Json
    
    try {
        $resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $body
        Write-Output "OK: $($resp.data.stdout.Trim())"
    } catch {
        Write-Error "Failed: $path - $_"
    }
}

Write-Output "`n=== Rebuilding ==="
$buildBody = @{
    command = "cd /opt/app/frontend && npm run build 2>&1 && echo BUILD_SUCCESS"
    timeout = 120
} | ConvertTo-Json

$resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $buildBody
Write-Output "Build exit: $($resp.data.exitCode)"
Write-Output $resp.data.stdout

Write-Output "`n=== ALL DONE ==="
