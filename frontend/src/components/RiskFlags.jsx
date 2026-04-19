const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-100 border-red-500 text-red-800',
  HIGH: 'bg-orange-100 border-orange-500 text-orange-800',
  MEDIUM: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  LOW: 'bg-green-100 border-green-500 text-green-800',
}

const URGENCY_BADGE = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-500 text-white',
  LOW: 'bg-green-500 text-white',
}

export default function RiskFlags({ risk }) {
  if (!risk) return null

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🔴 Risk Intelligence</h2>
        <span className={`px-4 py-1 rounded-full text-sm font-bold ${URGENCY_BADGE[risk.urgency_level] || 'bg-gray-400 text-white'}`}>
          {risk.urgency_level} — Score {risk.urgency_score}/10
        </span>
      </div>

      {/* Risk Flags */}
      {risk.risk_flags?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Risk Flags</h3>
          <div className="space-y-2">
            {risk.risk_flags.map((flag, i) => (
              <div key={i} className={`border-l-4 rounded p-3 ${SEVERITY_STYLES[flag.severity] || 'bg-gray-100 border-gray-400'}`}>
                <div className="flex justify-between items-start">
                  <p className="font-semibold">{flag.flag}</p>
                  <span className="text-xs font-bold ml-2 shrink-0">{flag.severity}</span>
                </div>
                <p className="text-sm mt-1 opacity-80">📍 {flag.source}</p>
                <p className="text-sm mt-1">💊 {flag.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Actions */}
      {risk.immediate_actions?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">⚡ Immediate Actions</h3>
          <ul className="space-y-1">
            {risk.immediate_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 font-bold shrink-0">→</span> {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Critical Info */}
      {risk.missing_critical_info?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">⚠️ Missing Critical Info</h3>
          <ul className="space-y-1">
            {risk.missing_critical_info.map((item, i) => (
              <li key={i} className="text-sm text-yellow-800 bg-yellow-50 rounded px-3 py-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}