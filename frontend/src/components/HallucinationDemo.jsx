import { useState } from 'react'

const EXAMPLE = {
  claim: 'Patient is currently taking Amoxicillin 500mg for infection treatment.',
  fhirCheck: 'Searching MedicationRequest resources for Amoxicillin...',
  result: 'No Amoxicillin found in active medication list. Patient has PENICILLIN ALLERGY.',
  action: 'CLAIM REMOVED — would have caused dangerous drug recommendation',
  safe: 'Patient medications confirmed: Lisinopril, Metformin, Warfarin only.'
}

export default function HallucinationDemo() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const run = () => {
    if (running) return
    setRunning(true)
    setStep(0)
    setTimeout(() => setStep(1), 800)
    setTimeout(() => setStep(2), 2000)
    setTimeout(() => setStep(3), 3500)
    setTimeout(() => setStep(4), 5000)
    setTimeout(() => { setStep(5); setRunning(false) }, 6500)
  }

  return (
    <div className="bg-gray-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">
            🛡️ Watch Agent 4 Catch a Hallucination
          </h2>
          <p className="text-gray-400">
            This is what no traditional software can do — real-time fact
            verification against FHIR source data
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* Left — Before */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-red-400 font-black mb-4 flex items-center gap-2">
              <span>⚠️</span> Draft Handoff (Agent 3 Output)
            </h3>
            <div className={`bg-red-950 border border-red-800 rounded-xl p-4 transition-all
              ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <p className="text-red-300 text-sm font-mono leading-relaxed">
                {EXAMPLE.claim}
              </p>
              {step >= 2 && (
                <div className="mt-3 pt-3 border-t border-red-800">
                  <p className="text-yellow-400 text-xs font-mono animate-pulse">
                    🔍 {EXAMPLE.fhirCheck}
                  </p>
                </div>
              )}
            </div>

            {step >= 3 && (
              <div className="mt-4 bg-red-900 border-2 border-red-500 rounded-xl p-4">
                <p className="text-red-400 font-black text-sm mb-2">
                  ❌ HALLUCINATION DETECTED
                </p>
                <p className="text-red-300 text-xs">{EXAMPLE.result}</p>
              </div>
            )}
          </div>

          {/* Right — After */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-green-400 font-black mb-4 flex items-center gap-2">
              <span>✅</span> Validated Handoff (Agent 4 Output)
            </h3>

            {step < 4 ? (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-600 opacity-40">
                <p className="text-gray-500 text-sm">Awaiting validation...</p>
              </div>
            ) : (
              <>
                <div className="bg-green-950 border-2 border-green-500 rounded-xl p-4 mb-4">
                  <p className="text-green-400 font-black text-sm mb-2">
                    🗑️ CLAIM REMOVED
                  </p>
                  <p className="text-green-300 text-xs line-through opacity-60">
                    {EXAMPLE.claim}
                  </p>
                  <p className="text-red-400 text-xs mt-2 font-bold">
                    ⚠️ {EXAMPLE.action}
                  </p>
                </div>

                {step >= 5 && (
                  <div className="bg-green-900 border border-green-600 rounded-xl p-4">
                    <p className="text-green-300 text-sm font-mono">
                      ✅ {EXAMPLE.safe}
                    </p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="bg-green-700 text-green-100 text-xs px-2 py-1 rounded-full">
                        Safety Score: 45/100
                      </span>
                      <span className="bg-yellow-800 text-yellow-200 text-xs px-2 py-1 rounded-full">
                        Clinician Review Required
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Run button */}
        <div className="text-center mt-8">
          <button
            onClick={run}
            disabled={running}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                       text-white font-black px-8 py-4 rounded-xl
                       transition-all text-lg"
          >
            {running
              ? '🔍 Agent 4 Validating...'
              : step >= 5
                ? '🔄 Run Again'
                : '▶️ Watch Hallucination Get Caught'}
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Agent 4 checks every claim against FHIR source data in real time
          </p>
        </div>
      </div>
    </div>
  )
}