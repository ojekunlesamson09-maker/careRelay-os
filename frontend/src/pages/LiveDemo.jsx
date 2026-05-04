import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

const SAMPLE_PATIENT = {
  name: 'Margaret Chen',
  age: '67',
  gender: 'Female',
  diagnosis: 'Community-acquired pneumonia, Type 2 Diabetes, Hypertension',
  medications: 'Lisinopril 10mg, Metformin 1000mg, Warfarin 5mg',
  vitals: 'BP 88/54 (FALLING), SpO2 91%, Temp 39.2C, HR 118bpm, RR 24',
  allergies: 'PENICILLIN (anaphylaxis), Sulfa drugs',
  notes: 'Admitted 6hrs ago with productive cough and fever. Responding poorly to initial treatment. Blood cultures pending x2. Chest CT ordered but not yet done. Family reports increased confusion since yesterday. Last INR not checked this admission.',
  pending_labs: 'Blood cultures x2, Chest CT, INR level, BMP, Procalcitonin'
}

const A2A_SCRIPT = [
  { at: 500,   agent: 'ContextAgent',   level: 'INFO',     msg: 'GET /fhir/r4/Patient/margaret-chen → 200 OK' },
  { at: 1200,  agent: 'ContextAgent',   level: 'INFO',     msg: 'GET /fhir/r4/Observation → 200 OK [6 records]' },
  { at: 1900,  agent: 'ContextAgent',   level: 'INFO',     msg: 'GET /fhir/r4/MedicationRequest → 200 OK [3 records]' },
  { at: 2600,  agent: 'ContextAgent',   level: 'INFO',     msg: 'GET /fhir/r4/AllergyIntolerance → 200 OK [2 records]' },
  { at: 3300,  agent: 'ContextAgent',   level: 'A2A',      msg: 'EMIT → RiskAgent | patient_context_ready | 14 resources packaged' },
  { at: 4500,  agent: 'RiskAgent',      level: 'QUERY',    msg: 'QUERY → ContextAgent | confirm: no penicillin-class MedicationRequest active?' },
  { at: 5800,  agent: 'ContextAgent',   level: 'INFO',     msg: 'REPLY → RiskAgent | confirmed: Lisinopril, Metformin, Warfarin only. No penicillin.' },
  { at: 6800,  agent: 'RiskAgent',      level: 'WARN',     msg: 'RECHECK | BP trend: 102/68 (admission) → 88/54 (now) | trajectory: FALLING' },
  { at: 7500,  agent: 'RiskAgent',      level: 'INFO',     msg: 'confidence_score: 0.34 | analyzing vitals + allergy cross-reference...' },
  { at: 8200,  agent: 'RiskAgent',      level: 'CRITICAL', msg: 'ESCALATE → ReasoningAgent | sepsis_risk: 9/10 | allergy_conflict: PENICILLIN-ANAPHYLAXIS' },
  { at: 9600,  agent: 'ReasoningAgent', level: 'QUERY',    msg: 'QUERY → RiskAgent | allergy severity required before SBAR generation' },
  { at: 10800, agent: 'RiskAgent',      level: 'INFO',     msg: 'REPLY | AllergyIntolerance[0]: Penicillin → ANAPHYLAXIS | criticality: high' },
  { at: 11500, agent: 'ReasoningAgent', level: 'INFO',     msg: 'confidence_score: 0.34 → 0.67 | grounding SBAR claims in FHIR source...' },
  { at: 12000, agent: 'ReasoningAgent', level: 'A2A',      msg: 'EMIT → ValidatorAgent | sbar_draft_ready | requesting hallucination_check' },
  { at: 13500, agent: 'ValidatorAgent', level: 'CRITICAL', msg: 'HALLUCINATION_DETECTED | claim: "Amoxicillin 500mg active" | FHIR source: NOT FOUND | action: REMOVED' },
  { at: 15000, agent: 'ValidatorAgent', level: 'WARN',     msg: 'DATA_GAP | INR referenced in draft | no recent INR in FHIR | flagged as missing' },
  { at: 16200, agent: 'ReasoningAgent', level: 'INFO',     msg: 'PATCH applied | "INR not checked this admission — STAT required"' },
  { at: 16800, agent: 'ValidatorAgent', level: 'INFO',     msg: 'confidence_score: 0.67 → 0.91 | hallucination removed | safety_score computed' },
  { at: 17500, agent: 'ValidatorAgent', level: 'SUCCESS',  msg: 'VERIFIED | safety_score: 45/100 | handoff_status: READY_FOR_CLINICIAN_REVIEW' },
]

const LEVEL_CONFIG = {
  INFO:     { labelClass: 'text-slate-500', msgClass: 'text-slate-400',         label: 'INFO' },
  WARN:     { labelClass: 'text-amber-500', msgClass: 'text-amber-400',         label: 'WARN' },
  CRITICAL: { labelClass: 'text-red-500',   msgClass: 'text-red-400 font-bold', label: 'CRIT' },
  A2A:      { labelClass: 'text-blue-500',  msgClass: 'text-blue-400',          label: 'A2A'  },
  QUERY:    { labelClass: 'text-sky-500',   msgClass: 'text-sky-400',           label: 'QURY' },
  SUCCESS:  { labelClass: 'text-green-500', msgClass: 'text-green-400 font-bold', label: 'DONE' },
}

const AGENT_CONFIG = {
  ContextAgent:   { color: 'text-blue-400',  short: 'CTX' },
  RiskAgent:      { color: 'text-red-400',   short: 'RSK' },
  ReasoningAgent: { color: 'text-amber-400', short: 'RSN' },
  ValidatorAgent: { color: 'text-green-400', short: 'VAL' },
}

const AGENT_STEPS = [
  { id: 1, name: 'ContextAgent',   sub: 'Groq/Llama', activeAt: 0,  doneAt: 4  },
  { id: 2, name: 'RiskAgent',      sub: 'Groq/Llama', activeAt: 4,  doneAt: 9  },
  { id: 3, name: 'ReasoningAgent', sub: 'GPT-4o',     activeAt: 9,  doneAt: 13 },
  { id: 4, name: 'ValidatorAgent', sub: 'GPT-4o',     activeAt: 13, doneAt: 18 },
]

function AgentStatusBar({ step }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
      {AGENT_STEPS.map((agent) => {
        const status = step > agent.doneAt ? 'done' : step >= agent.activeAt ? 'active' : 'idle'
        return (
          <div key={agent.id}
            className={`rounded-lg p-2 border transition-all duration-500 text-center
              ${status === 'done'   ? 'bg-slate-800 border-green-700' :
                status === 'active' ? 'bg-slate-700 border-blue-600 ring-1 ring-blue-500/30' :
                                      'bg-slate-900 border-slate-800 opacity-40'}`}>
            <p className="text-white font-mono text-xs font-semibold truncate">{agent.name}</p>
            <p className="text-slate-500 text-xs mt-0.5">{agent.sub}</p>
            <p className={`text-xs mt-1 font-mono
              ${status === 'done'   ? 'text-green-500' :
                status === 'active' ? 'text-blue-400 animate-pulse' :
                                      'text-slate-600'}`}>
              {status === 'done' ? '● done' : status === 'active' ? '● running' : '○ idle'}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function LogLine({ m }) {
  if (!m) return null
  const lvl = LEVEL_CONFIG[m.level] || LEVEL_CONFIG.INFO
  const agt = AGENT_CONFIG[m.agent] || { color: 'text-slate-400', short: '???' }
  return (
    <div className="flex items-start gap-1 leading-relaxed min-w-0">
      <span className="text-slate-600 shrink-0 text-xs select-none">{m.ts}</span>
      <span className={`shrink-0 text-xs font-bold ${lvl.labelClass}`}>[{lvl.label}]</span>
      <span className={`shrink-0 text-xs ${agt.color}`}>{agt.short}</span>
      <span className={`text-xs break-words min-w-0 flex-1 ${lvl.msgClass}`}>{m.msg}</span>
    </div>
  )
}

function getMockResult(p) {
  return {
    urgency_level: 'CRITICAL',
    safe_to_handoff: false,
    risk: {
      risk_flags: [
        { flag: 'ALLERGY CONFLICT: Penicillin anaphylaxis — verify antibiotic orders immediately', severity: 'CRITICAL', recommendation: 'Use azithromycin or fluoroquinolone instead' },
        { flag: 'HYPOTENSION: BP 88/54 falling — septic shock probability high', severity: 'CRITICAL', recommendation: 'Initiate sepsis protocol, IV fluids, vasopressors if needed' },
        { flag: 'DRUG INTERACTION: Warfarin + active infection = elevated bleeding risk', severity: 'HIGH', recommendation: 'Check INR immediately, hold Warfarin if >3.0' },
        { flag: 'NEURO CHANGE: New confusion in diabetic patient — rule out hypoglycemia', severity: 'HIGH', recommendation: 'Stat glucose check, neuro assessment' },
      ],
      missing_critical_info: [
        'INR level not checked this admission — STAT required',
        'Blood cultures pending — no results yet',
        'Chest CT not completed',
        'Glucose level not in recent labs',
      ]
    },
    handoff: {
      priority_items: [
        'PENICILLIN ALLERGY — verify ALL antibiotic orders before administration',
        'BP 88/54 falling — initiate sepsis protocol immediately',
        'Warfarin not monitored this admission — stat INR required',
        'Blood cultures x2 pending — do not change antibiotics until results',
        'New confusion — rule out hypoglycemia, consider septic encephalopathy'
      ]
    },
    validation: {
      safety_score: 45,
      hallucination_caught: true,
      validated_handoff: {
        situation:      `${p.name}, ${p.age}F — CRITICAL. BP 88/54 falling, sepsis suspected. Penicillin anaphylaxis documented.`,
        background:     `CAP with DM2, HTN. On Warfarin. Admitted 6hrs, poor response. Cultures pending. INR not checked — STAT required.`,
        assessment:     `Probable septic shock. NO penicillin/beta-lactams. Warfarin risk elevated. New confusion: rule out hypoglycemia or encephalopathy.`,
        recommendation: `1. Sepsis protocol NOW. 2. NO penicillin antibiotics. 3. Stat INR + glucose. 4. Await cultures before changing antibiotics. 5. Neuro assessment.`
      }
    },
    pipeline_steps: [
      { step: 'FHIR Fetch — 4 resource types', duration_ms: 1240 },
      { agent: 'ContextAgent',   provider: 'groq',   duration_ms: 890  },
      { agent: 'RiskAgent',      provider: 'groq',   duration_ms: 2340 },
      { agent: 'ReasoningAgent', provider: 'openai', duration_ms: 4120 },
      { agent: 'ValidatorAgent', provider: 'openai', duration_ms: 5890 },
    ],
    total_duration_ms: 14480
  }
}

export default function LiveDemo() {
  const [patient, setPatient]     = useState(SAMPLE_PATIENT)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [agentStep, setAgentStep] = useState(0)
  const [messages, setMessages]   = useState([])
  const [approved, setApproved]   = useState(false)
  const chatRef   = useRef(null)
  const timersRef = useRef([])

  const handleChange = (field, value) =>
    setPatient(p => ({ ...p, [field]: value }))

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  const generateHandoff = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setLoading(true)
    setResult(null)
    setMessages([])
    setAgentStep(0)
    setApproved(false)

    const push = (fn, ms) => {
      const t = setTimeout(fn, ms)
      timersRef.current.push(t)
    }

    push(() => setAgentStep(1),  500)
    push(() => setAgentStep(4),  3300)
    push(() => setAgentStep(9),  8200)
    push(() => setAgentStep(13), 12000)
    push(() => setAgentStep(18), 17500)

    A2A_SCRIPT.forEach(({ at, agent, level, msg }) => {
      push(() => {
        const ts = new Date().toLocaleTimeString('en-GB', { hour12: false })
        setMessages(prev => [...prev, { agent, level, msg, ts }])
      }, at)
    })

    push(() => {
      setResult(getMockResult(patient))
      setLoading(false)
    }, 18500)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
          Live Agent Pipeline
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Watch 4 specialized AI agents communicate via A2A protocol,
          catch a hallucination, and produce a verified clinical handoff.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* INPUT */}
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-mono">// patient_input</h2>
              <button onClick={() => setPatient(SAMPLE_PATIENT)}
                className="text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg
                           hover:bg-slate-600 font-mono border border-slate-600">
                load_sample()
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'name',         field: 'name',         type: 'text'     },
                { label: 'age',          field: 'age',          type: 'text'     },
                { label: 'gender',       field: 'gender',       type: 'text'     },
                { label: 'diagnosis',    field: 'diagnosis',    type: 'textarea' },
                { label: 'medications',  field: 'medications',  type: 'textarea' },
                { label: 'vitals',       field: 'vitals',       type: 'textarea' },
                { label: 'allergies',    field: 'allergies',    type: 'text'     },
                { label: 'notes',        field: 'notes',        type: 'textarea' },
                { label: 'pending_labs', field: 'pending_labs', type: 'text'     },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-xs font-mono text-slate-400 mb-1">{label}:</label>
                  {type === 'textarea' ? (
                    <textarea value={patient[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                                 text-xs text-slate-200 font-mono focus:outline-none
                                 focus:ring-1 focus:ring-blue-500 resize-none" />
                  ) : (
                    <input type="text" value={patient[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
                                 text-xs text-slate-200 font-mono focus:outline-none
                                 focus:ring-1 focus:ring-blue-500" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={generateHandoff} disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                         text-white font-bold py-3 rounded-lg transition-all text-sm font-mono">
              {loading ? '// running pipeline...' : '> generate_clinical_handoff()'}
            </button>
          </div>

          {/* OUTPUT */}
          <div className="space-y-4">

            {/* Pipeline Panel */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold text-sm font-mono">// agent_pipeline</p>
                <span className={`text-xs font-mono px-2 py-1 rounded
                  ${loading ? 'bg-blue-900/60 text-blue-400 animate-pulse' :
                    result  ? 'bg-green-900/60 text-green-400' :
                              'bg-slate-800 text-slate-500'}`}>
                  {loading ? '● RUNNING' : result ? '● COMPLETE' : '○ IDLE'}
                </span>
              </div>

              <AgentStatusBar step={agentStep} />

              {/* FHIR strip */}
              <div className="bg-slate-950 rounded-lg px-3 py-2 mb-3 border border-slate-800 font-mono text-xs overflow-x-auto whitespace-nowrap">
                <span className="text-slate-600">fhir: </span>
                {['Patient','Observation','MedicationRequest','AllergyIntolerance'].map((r, i) => (
                  <span key={i}>
                    <span className={agentStep >= 1 ? 'text-green-500' : 'text-slate-700'}>{r}</span>
                    {i < 3 && <span className="text-slate-700 mx-1">·</span>}
                  </span>
                ))}
              </div>

              {/* LOG */}
              <p className="text-slate-600 text-xs font-mono mb-1">// a2a_log</p>
              <div ref={chatRef}
                className="bg-slate-950 rounded-lg p-3 h-56 sm:h-64 overflow-y-auto
                           space-y-1 scroll-smooth border border-slate-800">
                {messages.length === 0 && !loading && (
                  <p className="text-slate-700 font-mono text-xs italic">
                    // awaiting pipeline execution...
                  </p>
                )}
                {messages.length === 0 && loading && (
                  <p className="text-blue-600 font-mono text-xs animate-pulse">
                    // initializing agent network...
                  </p>
                )}
                {messages.map((m, i) => <LogLine key={i} m={m} />)}
                {loading && messages.length > 0 && (
                  <p className="text-slate-600 font-mono text-xs animate-pulse">▋</p>
                )}
              </div>
            </div>

            {/* RESULTS */}
            {result && (
              <div className="space-y-4">

                {/* Status */}
                <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 text-center">
                  <p className="font-bold text-red-400 text-sm font-mono">
                    STATUS: CRITICAL — safety_score: {result.validation?.safety_score}/100
                  </p>
                  <p className="text-red-300/70 text-xs mt-1 font-mono">
                    clinician_review_required: true
                  </p>
                </div>

                {/* HALLUCINATION CAUGHT — ALARM MOMENT */}
{result.validation?.hallucination_caught && (
  <div className="rounded-xl overflow-hidden border-2 border-red-600">
    {/* alarm header */}
    <div className="bg-red-600 px-4 py-3 flex items-center gap-3">
      <span className="w-3 h-3 rounded-full bg-white animate-pulse shrink-0" />
      <p className="text-white font-black text-sm font-mono tracking-wide">
        HALLUCINATION_DETECTED — ValidatorAgent
      </p>
    </div>
    {/* body */}
    <div className="bg-slate-900 p-4 space-y-3">
      <div className="bg-slate-950 rounded-lg p-3 border border-red-900">
        <p className="text-slate-500 text-xs font-mono mb-1">// draft claim from ReasoningAgent:</p>
        <p className="text-red-400 text-xs font-mono line-through opacity-70">
          "Patient on Amoxicillin 500mg for infection treatment."
        </p>
      </div>
      <div className="bg-slate-950 rounded-lg p-3 border border-green-900">
        <p className="text-slate-500 text-xs font-mono mb-1">// fhir_source_check result:</p>
        <p className="text-green-400 text-xs font-mono">
          MedicationRequest query → 0 results for Amoxicillin
        </p>
        <p className="text-green-400 text-xs font-mono">
          action: CLAIM_REMOVED before clinician delivery
        </p>
      </div>
      <div className="bg-red-950/40 rounded-lg p-3 border border-red-900/50">
        <p className="text-red-300 text-xs font-bold mb-1">Why this matters:</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          Amoxicillin is a penicillin-class antibiotic. This patient has documented
          penicillin anaphylaxis. If this claim reached a clinician and was acted on,
          it could have caused a fatal allergic reaction.
          <span className="text-white font-bold"> CareRelay stopped it.</span>
        </p>
      </div>
    </div>
  </div>
)}

                {/* Risk Flags */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <p className="font-bold text-white text-sm mb-3">Risk Assessment</p>
                  <div className="space-y-2">
                    {result.risk?.risk_flags?.map((flag, i) => (
                      <div key={i} className={`rounded-lg p-3 border-l-2
                        ${flag.severity === 'CRITICAL'
                          ? 'bg-red-950/30 border-red-600'
                          : 'bg-amber-950/30 border-amber-600'}`}>
                        <p className={`text-xs font-semibold
                          ${flag.severity === 'CRITICAL' ? 'text-red-300' : 'text-amber-300'}`}>
                          [{flag.severity}] {flag.flag}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">rec: {flag.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SBAR */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-white text-sm">Verified SBAR Handoff</p>
                    <span className="text-xs text-green-600 font-mono">fhir_verified</span>
                  </div>
                  {['situation','background','assessment','recommendation'].map((key, i) => (
                    <div key={key} className={`border-l-2 pl-3 py-2 mb-3
                      ${['border-blue-600','border-slate-600','border-amber-600','border-green-600'][i]}`}>
                      <p className={`font-bold text-xs mb-1 font-mono
                        ${['text-blue-400','text-slate-400','text-amber-400','text-green-400'][i]}`}>
                        {['S — Situation','B — Background','A — Assessment','R — Recommendation'][i]}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {result.validation?.validated_handoff?.[key]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Priority Items */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <p className="font-bold text-white text-sm mb-3">Priority Actions</p>
                  <ul className="space-y-2">
                    {result.handoff?.priority_items?.map((item, i) => (
                      <li key={i} className="flex gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="text-slate-500 font-mono shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Info */}
                <div className="bg-amber-950/20 rounded-xl border border-amber-900/50 p-4">
                  <p className="font-bold text-amber-400 text-sm mb-2">Missing Critical Data</p>
                  <ul className="space-y-1">
                    {result.risk?.missing_critical_info?.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-amber-300 flex gap-2">
                        <span className="shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Human in the Loop */}
                <div className="bg-slate-900 rounded-xl border border-blue-800 p-4">
                  <p className="font-bold text-white text-sm mb-2">Clinician Review Required</p>
                  <p className="text-xs sm:text-sm text-slate-400 mb-4">
                    CareRelay OS does not transmit handoffs autonomously.
                    A clinician must review and approve before sending.
                  </p>
                  {approved ? (
                    <div className="bg-green-950/60 border border-green-800 rounded-lg p-4 text-center">
                      <p className="text-green-400 font-bold text-sm font-mono">
                        handoff_status: APPROVED
                      </p>
                      <p className="text-green-600 text-xs mt-1 font-mono">
                        audit_logged: true · timestamp: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => setApproved(true)}
                        className="flex-1 bg-green-700 hover:bg-green-600 text-white
                                   font-bold py-3 rounded-lg transition-all text-sm">
                        Approve & Transmit
                      </button>
                      <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200
                                         font-bold py-3 rounded-lg transition-all text-sm">
                        Edit Before Sending
                      </button>
                    </div>
                  )}
                </div>

                {/* Pipeline Stats */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <p className="text-white font-bold text-sm mb-3 font-mono">// execution_summary</p>
                  <div className="space-y-2">
                    {result.pipeline_steps?.map((step, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-950
                                              rounded-lg px-3 py-2 border border-slate-800">
                        <span className="text-xs font-mono text-slate-400 truncate mr-2">
                          {step.agent || step.step}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {step.provider && (
                            <span className="hidden sm:block text-xs bg-slate-800 text-slate-500
                                             px-2 py-0.5 rounded font-mono">
                              {step.provider}
                            </span>
                          )}
                          <span className="font-mono text-green-500 text-xs">{step.duration_ms}ms</span>
                          <span className="text-green-500 text-xs">✓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-2 font-mono">
                    <span className="text-xs text-slate-500">total: </span>
                    <span className="font-bold text-blue-400 text-sm">{result.total_duration_ms}ms</span>
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
