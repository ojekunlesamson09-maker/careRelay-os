import { useEffect, useState } from 'react'

const AGENTS = [
  {
    id: 1, name: 'Context Builder', icon: '🟦', color: 'blue',
    provider: 'Groq/Llama 3.3',
    steps: [
      { msg: 'Fetching Patient FHIR record...', type: 'fetch' },
      { msg: 'Reading Observations & Vitals...', type: 'fetch' },
      { msg: 'Reading Medications & Conditions...', type: 'fetch' },
      { msg: '✅ Unified patient timeline built', type: 'done' },
    ]
  },
  {
    id: 2, name: 'Risk Intelligence', icon: '🟥', color: 'red',
    provider: 'Groq/Llama 3.3',
    steps: [
      { msg: 'Analyzing vitals for deterioration signals...', type: 'think' },
      { msg: '🚨 CRITICAL: BP 88/54 — sepsis risk detected', type: 'alert' },
      { msg: '🚨 CRITICAL: Penicillin allergy on file', type: 'alert' },
      { msg: 'Requesting Context Agent for medication history...', type: 'a2a' },
      { msg: '✅ Risk score: 9/10 — CRITICAL urgency', type: 'done' },
    ]
  },
  {
    id: 3, name: 'Clinical Reasoning', icon: '🟨', color: 'yellow',
    provider: 'GPT-4o',
    steps: [
      { msg: 'Receiving risk flags from Risk Agent...', type: 'a2a' },
      { msg: 'Generating SBAR structure...', type: 'think' },
      { msg: 'Grounding every claim in FHIR data...', type: 'think' },
      { msg: 'Sending draft to Validation Agent...', type: 'a2a' },
      { msg: '✅ SBAR handoff generated', type: 'done' },
    ]
  },
  {
    id: 4, name: 'Handoff Validation', icon: '🟩', color: 'green',
    provider: 'GPT-4o',
    steps: [
      { msg: 'Receiving draft handoff from Reasoning Agent...', type: 'a2a' },
      { msg: 'Checking: "Patient on Penicillin" → FHIR source...', type: 'check' },
      { msg: '❌ HALLUCINATION CAUGHT: Claim removed — not in FHIR', type: 'caught' },
      { msg: 'Verifying all remaining claims...', type: 'check' },
      { msg: '✅ Validated. Safety score: 45/100. Clinician review required.', type: 'done' },
    ]
  },
]

const MSG_STYLES = {
  fetch: 'text-blue-300',
  think: 'text-yellow-300',
  alert: 'text-red-400 font-bold',
  a2a: 'text-purple-300 italic',
  check: 'text-gray-300',
  caught: 'text-red-500 font-black',
  done: 'text-green-400 font-bold',
}

export default function AgentPipeline({ running = false, currentStep = 0, completed = false }) {
  const [animStep, setAnimStep] = useState(0)
  const [msgIndexes, setMsgIndexes] = useState([0, 0, 0, 0])
  const [activeAgent, setActiveAgent] = useState(null)

  useEffect(() => {
    if (!running && !completed) {
      // Idle animation — cycle through agents
      const interval = setInterval(() => {
        setAnimStep(s => {
          const next = (s + 1) % 5
          setActiveAgent(next < 4 ? next : null)
          return next
        })
      }, 1800)
      return () => clearInterval(interval)
    }
    if (running) {
      setAnimStep(currentStep)
      setActiveAgent(currentStep - 1)
    }
    if (completed) {
      setAnimStep(5)
      setActiveAgent(null)
    }
  }, [running, currentStep, completed])

  // Animate messages within active agent
  useEffect(() => {
    if (activeAgent === null) return
    const agent = AGENTS[activeAgent]
    if (!agent) return

    setMsgIndexes(prev => {
      const updated = [...prev]
      updated[activeAgent] = 0
      return updated
    })

    let msgIdx = 0
    const msgInterval = setInterval(() => {
      msgIdx++
      if (msgIdx >= agent.steps.length) {
        clearInterval(msgInterval)
        return
      }
      setMsgIndexes(prev => {
        const updated = [...prev]
        updated[activeAgent] = msgIdx
        return updated
      })
    }, 800)

    return () => clearInterval(msgInterval)
  }, [activeAgent])

  const getAgentStatus = (i) => {
    if (completed || animStep > i + 1) return 'done'
    if (animStep === i + 1 || activeAgent === i) return 'active'
    return 'waiting'
  }

  return (
    <div className="bg-blue-950 rounded-2xl p-6">
      <h3 className="text-white font-black text-lg mb-2 text-center">
        ⚡ Live Agent Pipeline
      </h3>
      <p className="text-blue-400 text-xs text-center mb-6">
        Watch agents communicate via A2A protocol in real time
      </p>

      {/* FHIR Source */}
      <div className="flex justify-center mb-3">
        <div className="bg-blue-700 border-2 border-blue-400 rounded-xl px-6 py-3 text-center">
          <p className="text-white font-bold text-sm">📊 FHIR R4 Server</p>
          <p className="text-blue-300 text-xs">Patient data source</p>
        </div>
      </div>
      <div className="flex justify-center text-blue-400 text-xl mb-3">↓</div>

      {/* 4 Agents */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {AGENTS.map((agent, i) => {
          const status = getAgentStatus(i)
          return (
            <div key={agent.id}
              className={`rounded-xl p-3 border-2 transition-all duration-500
                ${status === 'done'
                  ? 'bg-green-900 border-green-400'
                  : status === 'active'
                    ? 'bg-blue-700 border-blue-300 shadow-lg shadow-blue-500/30'
                    : 'bg-blue-900 border-blue-700 opacity-60'
                }`}>
              <p className="text-lg mb-1 text-center">{agent.icon}</p>
              <p className="text-white font-black text-xs text-center mb-1">{agent.name}</p>
              <p className="text-blue-400 text-xs text-center mb-2">{agent.provider}</p>

              {/* Live message feed */}
              <div className="bg-black/30 rounded-lg p-2 min-h-12 font-mono">
                {status === 'active' && agent.steps.slice(0, msgIndexes[i] + 1).map((step, j) => (
                  <p key={j} className={`text-xs leading-tight mb-0.5 ${MSG_STYLES[step.type]}`}>
                    {step.msg}
                  </p>
                ))}
                {status === 'done' && (
                  <p className="text-green-400 text-xs font-bold">
                    ✅ {agent.steps[agent.steps.length - 1].msg.replace('✅ ', '')}
                  </p>
                )}
                {status === 'waiting' && (
                  <p className="text-blue-600 text-xs">Waiting...</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* A2A Communication indicators */}
      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {[
          { from: 'Risk Agent', to: 'Context Agent', msg: 'Requesting medication history' },
          { from: 'Reasoning Agent', to: 'Validation Agent', msg: 'Sending draft handoff' },
          { from: 'Validation Agent', to: 'Reasoning Agent', msg: 'Hallucination removed' },
        ].map((comm, i) => (
          <div key={i} className={`text-xs px-3 py-1 rounded-full border transition-all
            ${animStep >= i + 2
              ? 'border-purple-400 bg-purple-900/50 text-purple-300'
              : 'border-blue-800 bg-blue-950 text-blue-700'}`}>
            🤝 {comm.from} → {comm.to}: {comm.msg}
          </div>
        ))}
      </div>

      <div className="flex justify-center text-blue-400 text-xl mb-3">↓</div>

      {/* Output */}
      <div className="flex justify-center">
        <div className={`rounded-xl px-6 py-3 text-center border-2 transition-all duration-500
          ${completed || animStep >= 5
            ? 'bg-green-900 border-green-400'
            : 'bg-blue-900 border-blue-700 opacity-60'}`}>
          <p className="font-bold text-sm text-white">
            {completed || animStep >= 5
              ? '✅ Verified Safe Handoff Packet'
              : '📤 Clinician Handoff Output'}
          </p>
          <p className="text-xs text-blue-300">
            {completed || animStep >= 5
              ? 'Ready for receiving clinician'
              : 'Awaiting pipeline completion'}
          </p>
        </div>
      </div>
    </div>
  )
}