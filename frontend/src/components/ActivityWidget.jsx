import { UserPlus, CheckCircle, FileText, PhoneOff } from 'lucide-react'

function ActivityWidget() {
  const activities = [
    { icon: UserPlus, text: '����� ���: ������� ������� � Telegram', time: '12:41', color: 'text-brand-blue' },
    { icon: CheckCircle, text: '������ � ������ ���������� ������� � 156 000 ?', time: '11:58', color: 'text-brand-green' },
    { icon: FileText, text: '���������� ��: ����� ������ � 210 000 ?', time: '11:20', color: 'text-brand-cyan' },
    { icon: PhoneOff, text: '����������� ������: +7 912 345-67-89', time: '10:47', color: 'text-brand-red' }
  ]

  return (
    <div className="bg-brand-cyan/20 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">����������</h3>
        <span className="text-xs text-gray-400">? �������</span>
      </div>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
            <div className="flex-1">
              <p className="text-sm">{activity.text}</p>
            </div>
            <span className="text-xs text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityWidget
