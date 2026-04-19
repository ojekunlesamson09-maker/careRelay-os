export default function SBARHandoff({ handoff, validation }) {
  if (!handoff) return null

  const sbar = validation?.validated_handoff || handoff.sbar
  const safeToHandoff = validation?.safe_to_handoff
  const safetyScore = validation?.safety_score

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🟨 SBAR Clinical Handoff</h2>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${safeToHandoff ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {safeToHandoff ? '✅ Safe to Handoff' : '⚠️ Review Required'}
          </span>
          {safetyScore && (
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
              Safety: {safetyScore}/100
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'S — Situation', key: 'situation', color: 'blue' },
          { label: 'B — Background', key: 'background', color: 'purple' },
          { label: 'A — Assessment', key: 'assessment', color: 'orange' },
          { label: 'R — Recommendation', key: 'recommendation', color: 'green' },
        ].map(({ label, key, color }) => (
          <div key={key} className={`border-l-4 border-${color}-500 pl-4 py-2`}>
            <h3 className={`font-bold text-${color}-700 mb-1`}>{label}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{sbar?.[key] || 'Not available'}</p>
          </div>
        ))}
      </div>

      {/* Priority Items */}
      {handoff.priority_items?.length > 0 && (
        <div className="mt-4 bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">🎯 Priority Items for Receiving Clinician</h3>
          <ul className="space-y-1">
            {handoff.priority_items.map((item, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="font-bold shrink-0">{i + 1}.</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}