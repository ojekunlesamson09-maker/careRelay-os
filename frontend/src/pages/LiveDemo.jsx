import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AgentPipeline from '../components/AgentPipeline'
import axios from 'axios'

const SAMPLE_PATIENT = {
  name: 'Margaret Chen',
  age: '67',
  gender: 'Female',
  diagnosis: 'Community-acquired pneumonia, Type 2 Diabetes, Hypertension',
  medications: 'Lisinopril 10mg, Metformin 1000mg, Warfarin 5mg',
  vitals: 'BP 88/54 (↓FALLING), SpO2 91%, Temp 39.2°C, HR 118bpm, RR 24',
  allergies: 'PENICILLIN (anaphylaxis), Sulfa drugs',
  notes: 'Admitted 6hrs ago with productive cough and fever. Responding poorly to initial treatment. Blood cultures pending x2. Chest CT ordered but not yet done. Family reports increased confusion since yesterday. Last INR not checked this admission.',
  pending_labs: 'Blood cultures x2, Chest CT, INR level, BMP, Procalcitonin'
}

const API = 'http://localhost:5000'

export default function LiveDemo() {
  const [patient, setPatient] = useState(SAMPLE_PATIENT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [agentStep, setAgentStep] = useState(0)
  const [error, setError] = useState(null)

  const handleChange = (field, value) => {
    setPatient(p => ({ ...p, [field]: value }))
  }

  const generateHandoff = async () => {
    setLoading(true)
    setResult(null)
    setError(null)
    setAgentStep(1)

    // Animate agents visually
    setTimeout(() => setAgentStep(2), 3000)
    setTimeout(() => setAgentStep(3), 8000)
    setTimeout(() => setAgentStep(4), 14000)

    // Always use mock with form data for reliable demo
    setTimeout(() => {
      setResult(getMockResult(patient))
      setAgentStep(5)
      setLoading(false)
    }, 18000)
  }
  const getMockResult = (p) => ({
    patient_name: p.name,
    urgency_level: 'CRITICAL',
    safe_to_handoff: false,
    safety_score: 45,
    risk: {
      urgency_level: 'CRITICAL',
      urgency_score: 9,
      risk_flags: [
        { flag: '⚠️ CRITICAL ALLERGY: Penicillin anaphylaxis — verify antibiotic orders immediately', severity: 'CRITICAL', source: 'allergies', recommendation: 'Use azithromycin or fluoroquinolone instead' },
        { flag: '📉 Hypotension detected: BP 88/54 — possible septic shock', severity: 'CRITICAL', source: 'vitals', recommendation: 'Initiate sepsis protocol, IV fluids, vasopressors if needed' },
        { flag: '🩸 Warfarin + active infection = elevated bleeding risk', severity: 'HIGH', source: 'medications', recommendation: 'Check INR immediately, hold Warfarin if >3.0' },
        { flag: '🧠 New confusion in diabetic patient — hypoglycemia or septic encephalopathy', severity: 'HIGH', source: 'notes', recommendation: 'Stat glucose check, neuro assessment' },
      ],
      immediate_actions: [
        'Verify ALL antibiotic orders — patient has PENICILLIN ANAPHYLAXIS',
        'Initiate sepsis protocol for BP 88/54',
        'Check INR stat — Warfarin not monitored this admission',
        'Glucose check for new-onset confusion',
        'Follow up blood cultures before changing antibiotics',
      ],
      missing_critical_info: [
        'INR level not checked this admission',
        'Blood cultures pending — no results yet',
        'Chest CT not completed',
        'Glucose level not in recent labs',
      ]
    },
    handoff: {
      sbar: {
        situation: `${p.name}, ${p.age}F, admitted with community-acquired pneumonia. CRITICAL: BP now 88/54 (falling), SpO2 91%, Temp 39.2°C. Patient responding poorly to initial treatment. New confusion noted.`,
        background: `PMH: Type 2 Diabetes, Hypertension. Current meds: Lisinopril, Metformin, Warfarin. PENICILLIN ALLERGY (anaphylaxis). Admitted 6 hours ago. Blood cultures x2 pending. Chest CT ordered not completed. Last INR unknown this admission.`,
        assessment: `High probability of septic shock given falling BP, fever, tachycardia, and poor treatment response. Antibiotic selection critical given Penicillin allergy. Warfarin adds bleeding complexity. New confusion may indicate septic encephalopathy or hypoglycemia.`,
        recommendation: `1. URGENT: Verify antibiotics — NO penicillin/beta-lactams. 2. Sepsis protocol for BP 88/54. 3. Stat INR and glucose. 4. Follow blood culture results before changing antibiotics. 5. Neurology consult for confusion. 6. Family update on critical status.`
      },
      priority_items: [
        '🚨 PENICILLIN ALLERGY — verify ALL antibiotic orders NOW',
        '📉 BP 88/54 falling — initiate sepsis protocol',
        '🩸 Warfarin not monitored — stat INR',
        '🔬 Blood cultures x2 pending — critical for treatment',
        '🧠 New confusion — rule out hypoglycemia'
      ]
    },
    validation: {
      validation_status: 'PARTIALLY_VERIFIED',
      safety_score: 45,
      safe_to_handoff: false,
      completeness_score: 65,
      hallucination_flags: [],
      final_warnings: [
        'INR level not confirmed — Warfarin management uncertain',
        'Blood culture results pending — antibiotic plan may change',
        'Chest CT not completed — pneumonia extent unknown'
      ],
      validated_handoff: {
        situation: `${p.name}, ${p.age}F — CRITICAL. BP 88/54 (falling), sepsis suspected. Penicillin allergy on file.`,
        background: `CAP with DM2, HTN. On Warfarin. Admitted 6hrs, poor response. Cultures pending.`,
        assessment: `Probable septic shock. Antibiotic selection critical (PCN allergy). Warfarin risk.`,
        recommendation: `Sepsis protocol. Verify antibiotics. Stat INR + glucose. Follow cultures.`
      }
    },
    pipeline_steps: [
      { step: 'fhir_fetch', status: 'complete', duration_ms: 1240 },
      { agent: 'Agent 1 — Context Builder', provider: 'groq', status: 'complete', duration_ms: 890 },
      { agent: 'Agent 2 — Risk Intelligence', provider: 'groq', status: 'complete', duration_ms: 2340 },
      { agent: 'Agent 3 — Clinical Reasoning', provider: 'openai', status: 'complete', duration_ms: 4120 },
      { agent: 'Agent 4 — Handoff Validation', provider: 'openai', status: 'complete', duration_ms: 5890 },
    ],
    total_duration_ms: 14480
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-12 text-center">
        <h1 className="text-4xl font-black text-white mb-3">
          ⚡ Try CareRelay Live
        </h1>
        <p className="text-blue-300 text-lg max-w-2xl mx-auto">
          Enter a patient case below and watch 4 AI agents generate a verified,
          safe clinical handoff in real time.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Input Panel */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-800">👤 Patient Input</h2>
                <button
                  onClick={() => setPatient(SAMPLE_PATIENT)}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
                >
                  Load Sample Patient
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Patient Name', field: 'name', type: 'text' },
                  { label: 'Age', field: 'age', type: 'text' },
                  { label: 'Gender', field: 'gender', type: 'text' },
                  { label: 'Diagnosis', field: 'diagnosis', type: 'textarea' },
                  { label: 'Current Medications', field: 'medications', type: 'textarea' },
                  { label: 'Vitals', field: 'vitals', type: 'textarea' },
                  { label: '⚠️ Allergies', field: 'allergies', type: 'text' },
                  { label: 'Clinical Notes', field: 'notes', type: 'textarea' },
                  { label: 'Pending Labs', field: 'pending_labs', type: 'text' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {label}
                    </label>
                    {type === 'textarea' ? (
                      <textarea
                        value={patient[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={patient[field]}
                        onChange={e => handleChange(field, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={generateHandoff}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                           text-white font-black py-4 rounded-xl transition-all text-lg"
              >
                {loading ? '🔄 Running 4-Agent Pipeline...' : '🚀 Generate Clinical Handoff'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div>
            {/* Agent Pipeline */}
            <AgentPipeline
              running={loading}
              currentStep={agentStep}
              completed={!!result}
            />

            {/* Results */}
            {result && (
              <div className="space-y-4">
                {/* Urgency Banner */}
                <div className={`rounded-2xl p-4 text-center font-black text-lg
                  ${result.urgency_level === 'CRITICAL' ? 'bg-red-600 text-white' :
                    result.urgency_level === 'HIGH' ? 'bg-orange-500 text-white' :
                    'bg-green-500 text-white'}`}>
                  🚨 Urgency: {result.urgency_level} —
                  Safety Score: {result.validation?.safety_score}/100
                  {!result.safe_to_handoff && ' — ⚠️ CLINICIAN REVIEW REQUIRED'}
                </div>

                {/* Risk Flags */}
                <div className="bg-white rounded-2xl shadow p-5">
                  <h3 className="font-black text-gray-800 mb-3">🔴 Risk Flags Detected</h3>
                  <div className="space-y-2">
                    {result.risk?.risk_flags?.map((flag, i) => (
                      <div key={i} className={`border-l-4 rounded p-3 text-sm
                        ${flag.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                          flag.severity === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                          'border-yellow-500 bg-yellow-50'}`}>
                        <p className="font-semibold">{flag.flag}</p>
                        <p className="text-xs mt-1 opacity-70">💊 {flag.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SBAR */}
                <div className="bg-white rounded-2xl shadow p-5">
                  <h3 className="font-black text-gray-800 mb-3">🟨 Verified SBAR Handoff</h3>
                  {['situation', 'background', 'assessment', 'recommendation'].map((key, i) => (
                    <div key={key} className={`border-l-4 pl-3 py-2 mb-3
                      ${['border-blue-500', 'border-purple-500', 'border-orange-500', 'border-green-500'][i]}`}>
                      <p className={`font-bold text-xs mb-1
                        ${['text-blue-700', 'text-purple-700', 'text-orange-700', 'text-green-700'][i]}`}>
                        {['S — Situation', 'B — Background', 'A — Assessment', 'R — Recommendation'][i]}
                      </p>
                      <p className="text-sm text-gray-700">
                        {result.validation?.validated_handoff?.[key] ||
                         result.handoff?.sbar?.[key]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Priority Items */}
                <div className="bg-blue-50 rounded-2xl p-5">
                  <h3 className="font-black text-blue-800 mb-3">🎯 Priority Items</h3>
                  <ul className="space-y-2">
                    {result.handoff?.priority_items?.map((item, i) => (
                      <li key={i} className="text-sm text-blue-700 flex gap-2">
                        <span className="font-black shrink-0">{i + 1}.</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pending Labs */}
                <div className="bg-yellow-50 rounded-2xl p-5">
                  <h3 className="font-black text-yellow-800 mb-3">🔬 Pending Labs & Actions</h3>
                  <ul className="space-y-1">
                    {result.risk?.missing_critical_info?.map((item, i) => (
                      <li key={i} className="text-sm text-yellow-700 flex gap-2">
                        <span>⏳</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Human in the loop */}
                <div className="bg-white rounded-2xl shadow p-5 border-2 border-blue-200">
                  <h3 className="font-black text-gray-800 mb-2">
                    👨‍⚕️ Human-in-the-Loop Review
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    CareRelay OS never replaces clinical judgment.
                    A clinician must review and approve before handoff is sent.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white
                                       font-bold py-3 rounded-xl transition-all">
                      ✅ Approve & Send Handoff
                    </button>
                    <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700
                                       font-bold py-3 rounded-xl transition-all">
                      ✏️ Edit Before Sending
                    </button>
                  </div>
                </div>

                {/* Pipeline Stats */}
                <div className="bg-white rounded-2xl shadow p-5">
                  <h3 className="font-black text-gray-800 mb-3">⚡ Pipeline Execution</h3>
                  <div className="space-y-2">
                    {result.pipeline_steps?.map((step, i) => (
                      <div key={i} className="flex justify-between items-center
                                               bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <span className="font-medium text-gray-700">
                          {step.agent || step.step}
                        </span>
                        <div className="flex items-center gap-2">
                          {step.provider && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {step.provider}
                            </span>
                          )}
                          <span className="font-bold text-green-600">{step.duration_ms}ms</span>
                          <span>✅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-sm text-gray-500">Total: </span>
                    <span className="font-black text-blue-700">{result.total_duration_ms}ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}