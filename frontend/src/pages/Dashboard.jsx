import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [patientId, setPatientId] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientId.trim()) return
    setLoading(true)
    navigate(`/handoff/${patientId.trim()}`)
  }

  const demoPatients = [
    { id: '90274720', name: 'Nuñez Karla', condition: 'Complex case' },
    { id: 'example', name: 'Aseel Mustafa', condition: 'Test patient' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800">
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            🏥 CareRelay <span className="text-blue-300">OS</span>
          </h1>
          <p className="text-blue-300 text-sm mt-1">Clinical Handoff Intelligence Network</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            ● 4 Agents Online
          </span>
          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            FHIR R4
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center px-8 py-12">
        <h2 className="text-5xl font-black text-white mb-4 leading-tight">
          The Last Mile of<br />
          <span className="text-blue-300">Clinical Intelligence</span>
        </h2>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-12">
          A 4-agent AI system that transforms raw FHIR patient data into verified,
          safe clinical handoffs — eliminating the #1 cause of medical errors.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter FHIR Patient ID..."
              className="flex-1 px-5 py-4 rounded-xl text-gray-800 font-medium
                         focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg"
            />
            <button
              type="submit"
              disabled={loading || !patientId}
              className="bg-blue-400 hover:bg-blue-300 disabled:opacity-50
                         text-blue-950 font-black px-8 py-4 rounded-xl
                         transition-all duration-200 text-lg"
            >
              {loading ? '...' : 'Generate →'}
            </button>
          </div>
        </form>

        {/* Demo Patients */}
        <div className="mt-8">
          <p className="text-blue-300 text-sm mb-3">Quick test patients:</p>
          <div className="flex gap-3 justify-center">
            {demoPatients.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/handoff/${p.id}`)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2
                           rounded-xl text-sm transition-all duration-200 border border-white/20"
              >
                {p.name} <span className="text-blue-300">#{p.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="px-8 pb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: 1, name: 'Context Builder', desc: 'Unified patient timeline', color: 'blue', provider: 'Groq' },
            { num: 2, name: 'Risk Intelligence', desc: 'Deterioration signals', color: 'red', provider: 'Groq' },
            { num: 3, name: 'Clinical Reasoning', desc: 'SBAR generation', color: 'yellow', provider: 'Groq' },
            { num: 4, name: 'Handoff Validation', desc: 'Hallucination guard', color: 'green', provider: 'Groq' },
          ].map((agent) => (
            <div key={agent.num} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className={`w-8 h-8 rounded-lg bg-${agent.color}-500 flex items-center
                              justify-center text-white font-black text-sm mb-3`}>
                {agent.num}
              </div>
              <h3 className="text-white font-bold text-sm">{agent.name}</h3>
              <p className="text-blue-300 text-xs mt-1">{agent.desc}</p>
              <span className="text-xs text-white/50 mt-2 block">{agent.provider}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}