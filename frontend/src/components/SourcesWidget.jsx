import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function SourcesWidget({ sources }) {
  const data = sources?.all?.slice(0, 6)?.map((s, idx) => ({
    name: `�������� ${s.source_id}`,
    value: s.count,
    opportunity: s.opportunity
  })) || []

  const COLORS = ['#0088ff', '#00b894', '#8b5cf6', '#d946ef', '#ff8c00', '#ff2d55']

  if (!sources || sources.all.length === 0) {
    return (
      <div className="bg-brand-pink/20 rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">���������</h3>
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          ��� ������
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-pink/20 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">���������</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-gray-300">{source.name}</span>
              </div>
              <span className="text-white font-medium">{source.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SourcesWidget
