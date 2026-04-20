import Navbar from '../components/Navbar'

const AUDIT_LOGS = [
  { time: '07:32:14 PM', event: 'Handoff Generated', patient: 'Margaret Chen', user: 'CareRelay OS', detail: '4-agent pipeline completed. Safety score: 45/100', status: 'system', icon: '🤖' },
  { time: '07:32:45 PM', event: 'Clinician Review', patient: 'Margaret Chen', user: 'Dr. Sarah Kim (Attending)', detail: 'Handoff reviewed. Risk flags acknowledged.', status: 'review', icon: '👁️' },
  { time: '07:33:12 PM', event: 'Allergy Alert Confirmed', patient: 'Margaret Chen', user: 'Dr. Sarah Kim', detail: 'Penicillin allergy verified. Antibiotic order changed to Azithromycin.', status: 'critical', icon: '🚨' },
  { time: '07:33:58 PM', event: 'Handoff Approved', patient: 'Margaret Chen', user: 'Dr. Sarah Kim', detail: 'Clinical handoff approved and sent to night team.', status: 'approved', icon: '✅' },
  { time: '07:34:22 PM', event: 'Handoff Received', patient: 'Margaret Chen', user: 'Dr. James Park (Night)', detail: 'Handoff acknowledged. Sepsis protocol initiated.', status: 'received', icon: '📥' },
  { time: '07:35:01 PM', event: 'Sepsis Protocol Started', patient: 'Margaret Chen', user: 'Dr. James Park', detail: 'IV fluids ordered. Vasopressors on standby. ICU consult requested.', status: 'action', icon: '💉' },
]

const STATUS_STYLES = {
  system: 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  critical: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  received: 'bg-teal-100 text-teal-800',
  action: 'bg-orange-100 text-orange-800',
}

export default function AuditTrail() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-10 text-center">
        <h1 className="text-4xl font-black text-white mb-3">📋 Audit Trail</h1>
        <p className="text-blue-300">
          Every handoff action logged, timestamped, and accountable
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Handoffs Today', value: '24', icon: '🏥' },
            { label: 'Avg Safety Score', value: '82/100', icon: '🛡️' },
            { label: 'Clinician Reviews', value: '100%', icon: '👨‍⚕️' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-5 text-center">
              <p className="text-3xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-black text-blue-700">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-black text-gray-800 mb-6">
            📅 Margaret Chen — Handoff Timeline
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />

            <div className="space-y-6">
              {AUDIT_LOGS.map((log, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-blue-950 flex items-center
                                  justify-center text-xl shrink-0 z-10 border-4 border-white shadow">
                    {log.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800">{log.event}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLES[log.status]}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{log.detail}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>🕐 {log.time}</span>
                      <span>👤 {log.user}</span>
                      <span>🏥 {log.patient}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance note */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-5 text-center">
          <p className="text-blue-800 font-semibold text-sm">
            🔒 All audit logs are immutable and HIPAA-compliant.
            Every handoff is traceable from generation to acknowledgment.
          </p>
        </div>
      </div>
    </div>
  )
}