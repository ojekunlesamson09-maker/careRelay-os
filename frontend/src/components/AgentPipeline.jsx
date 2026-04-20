import { useEffect, useState } from 'react'

const AGENTS = [
  {
    id: 1,
    name: 'Context Builder',
    icon: '🟦',
    color: 'blue',
    job: 'Reading FHIR records...',
    done: 'Patient timeline built',
    provider: 'Groq/Llama 3.3'
  },
  {
    id: 2,
    name: 'Risk Intelligence',
    icon: '🟥',
    color: 'red',
    job: 'Detecting risk signals...',
    done: 'Risk flags identified',
    provider: 'Groq/Llama 3.3'
  },
  {
    id: 3,
    name: 'Clinical Reasoning',
    icon: '🟨',
    color: 'yellow',
    job: 'Generating SBAR...',
    done: 'Handoff generated',
    provider: 'GPT-4o'
  },
  {
    id: 4,
    name: 'Handoff Validation',
    icon: '🟩',
    color: 'green',
    job: 'Validating facts...',
    done: 'Hallucinations removed',
    provider: 'GPT-4o'
  },
]

export default function AgentPipeline({ running = false, currentStep = 0, completed = false }) {
  const [animStep, setAnimStep] = useState(0)

  useEffect(() => {
    if (!running && !completed) {
      const interval = setInterval(() => {
        setAnimStep(s => (s + 1) % 5)
      }, 1200)
      return () => clearInterval(interval)
    }
    if (running) setAnimStep(currentStep)
    if (completed) setAnimStep(5)
  }, [running, currentStep, completed])

  return (
    <div className="bg-blue-950 rounded-2xl p-6 my-6">
      <h3 className="text-white font-black text-lg mb-6 text-center">
        ⚡ Live Agent Pipeline
      </h3>

      {/* FHIR Source */}
      <div className="flex flex-col items-center gap-2">
        <div className={`w-full max-w-xs rounded-xl p-3 text-center border-2 transition-all duration-500
          ${animStep >= 0 ? 'bg-blue-800 border-blue-400 text-white' : 'bg-blue-900 border-blue-700 text-blue-400'}`}>
          <p className="font-bold text-sm">📊 FHIR R4 Server</p>
          <p className="text-xs opacity-70">Patient data source</p>
        </div>

        {/* Arrow */}
        <div className={`text-2xl transition-all duration-300 ${animStep >= 1 ? 'text-blue-300' : 'text-blue-700'}`}>↓</div>

        {/* Agents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {AGENTS.map((agent, i) => (
            <div key={agent.id} className="flex flex-col items-center gap-1">
              <div className={`w-full rounded-xl p-3 text-center border-2 transition-all duration-700
                ${animStep > i
                  ? 'bg-green-900 border-green-400 scale-105'
                  : animStep === i
                    ? 'bg-blue-700 border-blue-300 animate-pulse'
                    : 'bg-blue-900 border-blue-700 opacity-50'
                }`}>
                <p className="text-xl mb-1">{agent.icon}</p>
                <p className="text-white font-bold text-xs">{agent.name}</p>
                <p className={`text-xs mt-1 ${animStep > i ? 'text-green-300' : 'text-blue-300'}`}>
                  {animStep > i ? `✅ ${agent.done}` : animStep === i ? agent.job : agent.provider}
                </p>
              </div>
              {/* Connector arrows between agents */}
              {i < 3 && (
                <div className="hidden md:block absolute" />
              )}
            </div>
          ))}
        </div>

        {/* Arrow down */}
        <div className={`text-2xl transition-all duration-300 ${animStep >= 5 ? 'text-green-300' : 'text-blue-700'}`}>↓</div>

        {/* Output */}
        <div className={`w-full max-w-xs rounded-xl p-3 text-center border-2 transition-all duration-500
          ${animStep >= 5
            ? 'bg-green-900 border-green-400 text-white'
            : 'bg-blue-900 border-blue-700 text-blue-400'}`}>
          <p className="font-bold text-sm">
            {animStep >= 5 ? '✅ Verified Safe Handoff Packet' : '📤 Clinician Handoff Output'}
          </p>
          <p className="text-xs opacity-70">
            {animStep >= 5 ? 'Ready for receiving clinician' : 'Awaiting pipeline completion'}
          </p>
        </div>
      </div>
    </div>
  )
}