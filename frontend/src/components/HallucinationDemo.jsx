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
    <div className="bg-gray-950 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8 sm:mb-10">
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-3">
            Validator Agent — Live Demonstration
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Watch Agent 4 Catch a Hallucination
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Real-time fact verification against FHIR source data —
            what no rule-based system can do
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 items-start">

          {/* Left — Draft */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="mb-4">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">
                ReasoningAgent Output
              </p>
              <h3 className="text-red-400 font-black text-sm sm:text-base">
                Draft Handoff — Unverified
              </h3>
            </div>

            <div className={`bg-red-950/60 border border-red-900 rounded-xl p-4 transition-all
              ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
              <p className="text-red-300 text-xs sm:text-sm font-mono leading-relaxed">
                {EXAMPLE.claim}
              </p>
              {step >= 2 && (
                <div className="mt-3 pt-3 border-t border-red-900">
                  <p className="text-yellow-400 text-xs font-mono animate-pulse">
                    {EXAMPLE.fhirCheck}
                  </p>
                </div>
              )}
            </div>

            {step >= 3 && (
              <div className="mt-4 bg-red-950 border-2 border-red-600 rounded-xl p-4">
                <p className="text-red-400 font-black text-xs font-mono mb-2">
                  HALLUCINATION_DETECTED
                </p>
                <p className="text-red-300 text-xs leading-relaxed">{EXAMPLE.result}</p>
              </div>
            )}
          </div>

          {/* Right — Validated */}
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="mb-4">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">
                ValidatorAgent Output
              </p>
              <h3 className="text-green-400 font-black text-sm sm:text-base">
                Validated Handoff — Verified
              </h3>
            </div>

            {step < 4 ? (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 opacity-30">
                <p className="text-gray-500 text-xs font-mono">
                  // awaiting validation...
                </p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 border-2 border-red-700 rounded-xl p-4 mb-4">
                  <p className="text-red-400 font-black text-xs font-mono mb-2">
                    CLAIM_REMOVED
                  </p>
                  <p className="text-gray-500 text-xs font-mono line-through opacity-60">
                    {EXAMPLE.claim}
                  </p>
                  <p className="text-amber-400 text-xs mt-2 font-semibold">
                    {EXAMPLE.action}
                  </p>
                </div>

                {step >= 5 && (
                  <div className="bg-slate-900 border border-green-800 rounded-xl p-4">
                    <p className="text-green-400 text-xs font-mono leading-relaxed">
                      {EXAMPLE.safe}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-slate-800 text-gray-300 text-xs px-2 py-1 rounded font-mono">
                        safety_score: 45/100
                      </span>
                      <span className="bg-slate-800 text-amber-300 text-xs px-2 py-1 rounded font-mono">
                        clinician_review: required
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-8">
          <button
            onClick={run}
            disabled={running}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-600
                       text-white font-bold px-8 py-4 rounded-xl transition-all text-sm sm:text-base
                       font-mono"
          >
            {running
              ? '// validator running...'
              : step >= 5
                ? '> run_again()'
                : '> run_hallucination_check()'}
          </button>
          <p className="text-gray-600 text-xs font-mono mt-3">
            ValidatorAgent cross-checks every claim against FHIR source data
          </p>
        </div>
      </div>
    </div>
  )
}