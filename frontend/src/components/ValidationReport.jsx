export default function ValidationReport({ validation }) {
  if (!validation) return null

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🟩 Validation Report</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          validation.validation_status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
          validation.validation_status === 'PARTIALLY_VERIFIED' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {validation.validation_status}
        </span>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{validation.safety_score}</p>
          <p className="text-sm text-gray-600">Safety Score</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{validation.completeness_score}</p>
          <p className="text-sm text-gray-600">Completeness Score</p>
        </div>
      </div>

      {/* Hallucination Flags */}
      {validation.hallucination_flags?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">🚨 Hallucination Flags Caught</h3>
          <div className="space-y-2">
            {validation.hallucination_flags.map((flag, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-800">{flag.claim}</p>
                <p className="text-xs text-red-600 mt-1">{flag.reason}</p>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {flag.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Warnings */}
      {validation.final_warnings?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">⚠️ Final Warnings</h3>
          <ul className="space-y-1">
            {validation.final_warnings.map((warning, i) => (
              <li key={i} className="text-sm text-yellow-800 bg-yellow-50 rounded px-3 py-2">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}