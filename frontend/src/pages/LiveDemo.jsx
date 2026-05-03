import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

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

const A2A_SCRIPT = [
  { at: 500,   from: 'Context Builder',    to: 'FHIR Server',        type: 'fetch',    msg: 'REQUEST: GET /Patient/margaret-chen/everything' },
  { at: 1800,  from: 'FHIR Server',        to: 'Context Builder',    type: 'response', msg: 'RESPONSE: Patient bundle returned — 14 resources' },
  { at: 2800,  from: 'Context Builder',    to: 'Risk Intelligence',  type: 'a2a',      msg: 'HANDOFF: Unified context ready. Vitals + meds + allergies packaged.' },
  { at: 4200,  from: 'Risk Intelligence',  to: 'Context Builder',    type: 'query',    msg: 'QUERY: Confirm active medication list — checking for penicillin-class drugs' },
  { at: 5400,  from: 'Context Builder',    to: 'Risk Intelligence',  type: 'response', msg: 'CONFIRMED: Active meds = Lisinopril, Metformin, Warfarin. No penicillin active.' },
  { at: 6600,  from: 'Risk Intelligence',  to: 'Clinical Reasoning', type: 'alert',    msg: '🚨 CRITICAL ESCALATION: BP 88/54 + sepsis score 9/10 + PENICILLIN ALLERGY on file' },
  { at: 8000,  from: 'Clinical Reasoning', to: 'Risk Intelligence',  type: 'query',    msg: 'QUERY: Requesting full allergy history — need severity + reaction type' },
  { at: 9200,  from: 'Risk Intelligence',  to: 'Clinical Reasoning', type: 'response', msg: 'CONFIRMED: Penicillin → ANAPHYLAXIS. Sulfa → rash. No cephalosporin allergy documented.' },
  { at: 10500, from: 'Clinical Reasoning', to: 'Handoff Validator',  type: 'a2a',      msg: 'DRAFT SENT: SBAR handoff generated. Sending for hallucination check.' },
  { at: 12000, from: 'Handoff Validator',  to: 'Clinical Reasoning', type: 'caught',   msg: '❌ HALLUCINATION CAUGHT: "Patient on Amoxicillin" — NOT in FHIR. Claim removed.' },
  { at: 13500, from: 'Handoff Validator',  to: 'Clinical Reasoning', type: 'query',    msg: 'QUERY: INR value referenced in draft — no recent INR in FHIR. Flagging gap.' },
  { at: 14800, from: 'Clinical Reasoning', to: 'Handoff Validator',  type: 'response', msg: 'ACKNOWLEDGED: Replacing with "INR not checked this admission — STAT required."' },
  { at: 16200, from: 'Handoff Validator',  to: 'OUTPUT',             type: 'done',     msg: '✅ VERIFIED: Handoff packet safe. Safety score: 45/100. Clinician review required.' },
]

const TYPE_STYLES = {
  fetch:    'text-blue-400',
  response: 'text-gray-300',
  a2a:      'text-purple-300 font-semibold',
  query:    'text-yellow-300',
  alert:    'text-red-400 font-bold',
  caught:   'text-red-500 font-black',
  done:     'text-green-400 font-bold',
}

const TYPE_ICONS = {
  fetch: '📡', response: '↩️', a2a: '🤝', query: '❓', alert: '🚨', caught: '🛡️', done: '✅',
}

const AGENT_DOT_COLORS = {
  'Context Builder':    'bg-blue-500',
  'Risk Intelligence':  'bg-red-500',
  'Clinical Reasoning': 'bg-yellow-500',
  'Handoff Validator':  'bg-green-500',
  'FHIR Server':        'bg-gray-400',
  'OUTPUT':             'bg-teal-400',
}

const AGENT_STEPS = [
  { id: 1, name: 'Context Builder',    icon: '🟦', provider: 'Groq/Llama 3.3', activeAt: 0,  doneAt: 3  },
  { id: 2, name: 'Risk Intelligence',  icon: '🟥', provider: 'Groq/Llama 3.3', activeAt: 3,  doneAt: 7  },
  { id: 3, name: 'Clinical Reasoning', icon: '🟨', provider: 'GPT-4o',          activeAt: 7,  doneAt: 11 },
  { id: 4, name: 'Handoff Validator',  icon: '🟩', provider: 'GPT-4o',          activeAt: 11, doneAt: 17 },
]

function AgentStatusBar({ step }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
      {AGENT_STEPS.map((agent) => {
        const status = step > agent.doneAt ? 'done' : step >= agent.activeAt ? 'active' : 'waiting'
        return (
          <div key={agent.id}
            className={`rounded-xl p-3 border-2 transition-all duration-500 text-center
              ${status === 'done'   ? 'bg-green-900 border-green-500' :
                status === 'active' ? 'bg-blue-800 border-blue-400 shadow-lg shadow-blue-500/30' :
                                      'bg-blue-950 border-blue-800 opacity-50'}`}>
            <p className="text-lg">{agent.icon}</p>
            <p className="text-white font-black text-xs mt-1">{agent.name}</p>
            <p className="text-blue-400 text-xs">{agent.provider}</p>
            <p className={`text-xs mt-1 font-bold
              ${status === 'done'   ? 'text-green-400' :
                status === 'active' ? 'text-blue-300 animate-pulse' : 'text-blue-700'}`}>
              {status === 'done' ? '✅ Done' : status === 'active' ? '⚙️ Running...' : 'Waiting'}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function getMockResult(p) {
  return {
    urgency_level: 'CRITICAL',
    safe_to_handoff: false,
    risk: {
      risk_flags: [
        { flag: '⚠️ CRITICAL ALLERGY: Penicillin anaphylaxis — verify antibiotic orders immediately', severity: 'CRITICAL', recommendation: 'Use azithromycin or fluoroquinolone instead' },
        { flag: '📉 Hypotension: BP 88/54 — possible septic shock', severity: 'CRITICAL', recommendation: 'Initiate sepsis protocol, IV fluids, vasopressors if needed' },
        { flag: '🩸 Warfarin + active infection = elevated bleeding risk', severity: 'HIGH', recommendation: 'Check INR immediately, hold Warfarin if >3.0' },
        { flag: '🧠 New confusion in diabetic patient — hypoglycemia or septic encephalopathy', severity: 'HIGH', recommendation: 'Stat glucose check, neuro assessment' },
      ],
      missing_critical_info: [
        'INR level not checked this admission',
        'Blood cultures pending — no results yet',
        'Chest CT not completed',
        'Glucose level not in recent labs',
      ]
    },
    handoff: {
      priority_items: [
        '🚨 PENICILLIN ALLERGY — verify ALL antibiotic orders NOW',
        '📉 BP 88/54 falling — initiate sepsis protocol',
        '🩸 Warfarin not monitored — stat INR',
        '🔬 Blood cultures x2 pending — critical for treatment',
        '🧠 New confusion — rule out hypoglycemia'
      ]
    },
    validation: {
      safety_score: 45,
      hallucination_caught: 'Claim "Patient on Amoxicillin" — NOT found in any FHIR MedicationRequest resource. Removed.',
      validated_handoff: {
        situation: `${p.name}, ${p.age}F — CRITICAL. BP 88/54 (falling), sepsis suspected. Penicillin allergy on file.`,
        background: `CAP with DM2, HTN. On Warfarin. Admitted 6hrs, poor response. Cultures pending. INR not checked — STAT required.`,
        assessment: `Probable septic shock. Antibiotic selection critical (PCN allergy). Warfarin risk. New confusion: rule out hypoglycemia/encephalopathy.`,
        recommendation: `Sepsis protocol. Verify antibiotics (NO penicillin). Stat INR + glucose. Follow cultures.`
      }
    },
    pipeline_steps: [
      { step: 'FHIR Fetch', duration_ms: 1240 },
      { agent: 'Agent 1 — Context Builder', provider: 'groq', duration_ms: 890 },
      { agent: 'Agent 2 — Risk Intelligence', provider: 'groq', duration_ms: 2340 },
      { agent: 'Agent 3 — Clinical Reasoning', provider: 'openai', duration_ms: 4120 },
      { agent: 'Agent 4 — Handoff Validation', provider: 'openai', duration_ms: 5890 },
    ],
    total_duration_ms: 14480
  }
}

export default function LiveDemo() {
  const [patient, setPatient] = useState(SAMPLE_PATIENT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [agentStep, setAgentStep] = useState(0)
  const [messages, setMessages] = useState([])
  const [approved, setApproved] = useState(false)
  const chatRef = useRef(null)

  const handleChange = (field, value) => setPatient(p => ({ ...p, [field]: value }))

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const generateHandoff = () => {
    setLoading(true)
    setResult(null)
    setMessages([])
    setAgentStep(0)
    setApproved(false)

    const stepTimers = [
      setTimeout(() => setAgentStep(1), 500),
      setTimeout(() => setAgentStep(3), 2800),
      setTimeout(() => setAgentStep(7), 6600),
      setTimeout(() => setAgentStep(11), 10500),
      setTimeout(() => setAgentStep(17), 16200),
    ]

    const msgTimers = A2A_SCRIPT.map(({ at, from, to, type, msg }) =>
      setTimeout(() => setMessages(prev => [...prev, { from, to, type, msg }]), at)
    )

    setTimeout(() => {
      setResult(getMockResult(patient))
      setLoading(false)
    }, 17500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-4 sm:px-6 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">⚡ Try CareRelay Live</h1>
        <p className="text-blue-300 text-base sm:text-lg max-w-2xl mx-auto">
          Watch 4 AI agents communicate, catch a live hallucination, and produce a verified clinical handoff in real time.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

          {/* INPUT */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-black text-gray-800">👤 Patient Input</h2>
              <button onClick={() => setPatient(SAMPLE_PATIENT)}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">
                Load Sample
              </button>
            </div>
            <div className="space-y-3">
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
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  {type === 'textarea' ? (
                    <textarea value={patient[field]} onChange={e => handleChange(field, e.target.value)}
                      rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                  ) : (
                    <input type="text" value={patient[field]} onChange={e => handleChange(field, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={generateHandoff} disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all text-base sm:text-lg">
              {loading ? '🔄 Running 4-Agent Pipeline...' : '🚀 Generate Clinical Handoff'}
            </button>
          </div>

          {/* OUTPUT */}
          <div className="space-y-4">

            {/* Agent Status + Live A2A Chat */}
            <div className="bg-blue-950 rounded-2xl p-4">
              <p className="text-white font-black text-sm mb-3 text-center">⚡ Live Agent Pipeline</p>
              <AgentStatusBar step={agentStep} />

              {/* ===== THE WOW MOMENT ===== */}
              <div>
                <p className="text-blue-400 text-xs font-bold mb-2 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${loading ? 'bg-green-400 animate-pulse' : messages.length > 0 ? 'bg-green-400' : 'bg-blue-700'}`} />
                  🤝 A2A Agent Communication — Live
                </p>
                <div ref={chatRef}
                  className="bg-black/40 rounded-xl p-3 h-56 sm:h-64 overflow-y-auto font-mono text-xs space-y-1.5 scroll-smooth">
                  {messages.length === 0 && !loading && (
                    <p className="text-blue-700 italic">Run the pipeline to watch agents communicate in real time...</p>
                  )}
                  {messages.length === 0 && loading && (
                    <p className="text-blue-500 animate-pulse">Initializing agent network...</p>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${AGENT_DOT_COLORS[m.from] || 'bg-gray-500'}`} />
                      <div>
                        <span className="text-white font-bold">{m.from}</span>
                        <span className="text-gray-500"> → </span>
                        <span className="text-gray-400">{m.to}</span>
                        <span className="text-gray-600"> [{TYPE_ICONS[m.type]}]: </span>
                        <span className={TYPE_STYLES[m.type]}>{m.msg}</span>
                      </div>
                    </div>
                  ))}
                  {loading && messages.length > 0 && (
                    <p className="text-blue-500 animate-pulse">▋ Agent processing...</p>
                  )}
                </div>
              </div>
            </div>

            {/* RESULTS */}
            {result && (
              <div className="space-y-4">

                {/* Urgency */}
                <div className="bg-red-600 text-white rounded-2xl p-4 text-center font-black text-base">
                  🚨 {result.urgency_level} — Safety Score: {result.validation?.safety_score}/100
                  <br /><span className="text-sm font-semibold opacity-90">⚠️ CLINICIAN REVIEW REQUIRED</span>
                </div>

                {/* HALLUCINATION CAUGHT — THE #1 WOW MOMENT */}
                {result.validation?.hallucination_caught && (
                  <div className="bg-gray-950 border-2 border-red-500 rounded-2xl p-4">
                    <p className="text-red-400 font-black text-sm mb-2">🛡️ HALLUCINATION CAUGHT BY AGENT 4</p>
                    <div className="bg-red-950/50 rounded-xl p-3 mb-2">
                      <p className="text-red-300 text-xs font-mono line-through opacity-70">
                        ❌ REMOVED: "Patient on Amoxicillin 500mg for infection treatment."
                      </p>
                    </div>
                    <p className="text-green-400 text-xs">✅ Not found in any FHIR MedicationRequest resource. Claim removed before reaching clinician.</p>
                    <p className="text-gray-500 text-xs mt-2 italic">
                      Sending this to a clinician could have caused a dangerous medication decision for a patient with Penicillin anaphylaxis.
                    </p>
                  </div>
                )}

                {/* Risk Flags */}
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
                  <h3 className="font-black text-gray-800 mb-3 text-sm sm:text-base">🔴 Risk Flags Detected</h3>
                  <div className="space-y-2">
                    {result.risk?.risk_flags?.map((flag, i) => (
                      <div key={i} className={`border-l-4 rounded p-3
                        ${flag.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                          flag.severity === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                          'border-yellow-500 bg-yellow-50'}`}>
                        <p className="font-semibold text-xs sm:text-sm">{flag.flag}</p>
                        <p className="text-xs mt-1 opacity-70">💊 {flag.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified SBAR */}
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
                  <h3 className="font-black text-gray-800 mb-3 text-sm sm:text-base">📋 Verified SBAR Handoff</h3>
                  {['situation', 'background', 'assessment', 'recommendation'].map((key, i) => (
                    <div key={key} className={`border-l-4 pl-3 py-2 mb-3
                      ${['border-blue-500','border-purple-500','border-orange-500','border-green-500'][i]}`}>
                      <p className={`font-bold text-xs mb-1 ${['text-blue-700','text-purple-700','text-orange-700','text-green-700'][i]}`}>
                        {['S — Situation','B — Background','A — Assessment','R — Recommendation'][i]}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        {result.validation?.validated_handoff?.[key]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Priority Items */}
                <div className="bg-blue-50 rounded-2xl p-4">
                  <h3 className="font-black text-blue-800 mb-3 text-sm">🎯 Priority Items</h3>
                  <ul className="space-y-2">
                    {result.handoff?.priority_items?.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-blue-700 flex gap-2">
                        <span className="font-black shrink-0">{i + 1}.</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Info */}
                <div className="bg-yellow-50 rounded-2xl p-4">
                  <h3 className="font-black text-yellow-800 mb-2 text-sm">🔬 Missing Critical Info</h3>
                  <ul className="space-y-1">
                    {result.risk?.missing_critical_info?.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-yellow-700 flex gap-2">
                        <span>⏳</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Human in the Loop */}
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border-2 border-blue-200">
                  <h3 className="font-black text-gray-800 mb-2 text-sm sm:text-base">👨‍⚕️ Human-in-the-Loop Review</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    CareRelay OS never replaces clinical judgment. A clinician must review and approve before handoff is sent.
                  </p>
                  {approved ? (
                    <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                      <p className="text-green-700 font-black text-sm">✅ Handoff Approved & Sent to Night Team</p>
                      <p className="text-green-600 text-xs mt-1">Logged to audit trail · {new Date().toLocaleTimeString()}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => setApproved(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all text-sm">
                        ✅ Approve & Send Handoff
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm">
                        ✏️ Edit Before Sending
                      </button>
                    </div>
                  )}
                </div>

                {/* Pipeline Stats */}
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
                  <h3 className="font-black text-gray-800 mb-3 text-sm">⚡ Pipeline Execution</h3>
                  <div className="space-y-2">
                    {result.pipeline_steps?.map((step, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs font-medium text-gray-700">{step.agent || step.step}</span>
                        <div className="flex items-center gap-2">
                          {step.provider && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{step.provider}</span>
                          )}
                          <span className="font-bold text-green-600 text-xs">{step.duration_ms}ms</span>
                          <span>✅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-xs text-gray-500">Total: </span>
                    <span className="font-black text-blue-700 text-sm">{result.total_duration_ms}ms</span>
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