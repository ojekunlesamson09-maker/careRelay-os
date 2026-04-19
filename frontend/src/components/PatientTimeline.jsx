export default function PatientTimeline({ context, patientName }) {
  if (!context) return null

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🟦 Patient Timeline</h2>

      {/* Patient Summary */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-800 leading-relaxed">{context.patient_summary}</p>
      </div>

      {/* Current Vitals */}
      {context.recent_vitals && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">📊 Recent Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(context.recent_vitals).map(([key, value]) => value && (
              <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Conditions */}
      {context.active_conditions?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">🏥 Active Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {context.active_conditions.map((condition, i) => (
              <span key={i} className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Medications */}
      {context.current_medications?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">💊 Current Medications</h3>
          <div className="flex flex-wrap gap-2">
            {context.current_medications.map((med, i) => (
              <span key={i} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                {med}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}