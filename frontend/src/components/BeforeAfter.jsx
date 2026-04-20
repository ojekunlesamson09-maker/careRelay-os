export default function BeforeAfter() {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            The Difference CareRelay Makes
          </h2>
          <p className="text-gray-600">Same patient. Same shift change. Completely different outcome.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">😰</span>
              <div>
                <h3 className="font-black text-red-800 text-lg">Without CareRelay</h3>
                <p className="text-red-600 text-sm">Traditional handoff process</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                'Nurse spends 12+ minutes writing notes from memory',
                'Penicillin allergy buried in page 3 of chart',
                'Falling BP trend not noticed until crisis',
                'Pending blood cultures forgotten in handoff',
                'Receiving clinician gets verbal summary only',
                'No record of what was communicated',
                'Critical Warfarin interaction missed',
                'Patient deteriorates during shift change',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="text-red-500 shrink-0 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-red-100 rounded-xl p-3 text-center">
              <p className="text-red-800 font-black">Result: Patient harm risk HIGH</p>
            </div>
          </div>

          {/* After */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-black text-green-800 text-lg">With CareRelay OS</h3>
                <p className="text-green-600 text-sm">AI-powered handoff in 90 seconds</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                '4-agent AI reads entire FHIR record in seconds',
                '🚨 PENICILLIN ALLERGY flagged as CRITICAL immediately',
                '📉 Falling BP trend detected — sepsis risk scored 8/10',
                '🔬 Pending cultures listed in priority items',
                'Verified SBAR handoff sent to receiving clinician',
                'Full audit trail with timestamp and acknowledgment',
                '💊 Warfarin + infection interaction flagged automatically',
                'Clinician reviews, approves, and sends in 90 seconds',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-green-100 rounded-xl p-3 text-center">
              <p className="text-green-800 font-black">Result: Safe verified handoff ✅</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}