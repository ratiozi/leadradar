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
          <h1 className="text-xl font-bold">���� <span className="text-brand-blue text-sm bg-brand-blue/10 px-2 py-1 rounded">CRM</span></h1>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xl mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="����� �����"
              className="w-full bg-dark-700 border border-dark-500 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium">10:03</div>
            <div className="text-xs text-gray-400">��, 14 ��������</div>
          </div>
          <button className="text-gray-400 hover:text-white relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded bg-brand-purple/30 flex items-center justify-center text-brand-purple text-sm font-bold">
            ��
          </div>
        </div>
      </div>
    </header>
  )
}

function ActionButtons() {
  const actions = [
    { icon: Plus, label: '����� ���', sublabel: '������ ����', color: 'bg-brand-blue' },
    { icon: Download, label: '�������', sublabel: 'CSV � Excel', color: 'bg-dark-700' },
    { icon: Phone, label: '������', sublabel: 'IP-���������', color: 'bg-brand-orange' },
    { icon: Mail, label: '�����', sublabel: '��������', color: 'bg-brand-cyan' }
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action, idx) => (
        <button
          key={idx}
          className={`${action.color} rounded-lg p-4 hover:opacity-90 transition-opacity text-left`}
        >
          <action.icon className="w-5 h-5 mb-2" />
          <div className="text-sm font-medium">{action.label}</div>
          <div className="text-xs opacity-70">{action.sublabel}</div>
        </button>
      ))}
    </div>
  )
}

export { Header, ActionButtons }
