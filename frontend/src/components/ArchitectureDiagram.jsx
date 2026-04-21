export default function ArchitectureDiagram() {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            System Architecture
          </h2>
          <p className="text-gray-500">
            How CareRelay OS connects EHR data to verified clinical handoffs
          </p>
        </div>

        {/* Diagram */}
        <div className="bg-gray-950 rounded-2xl p-8 overflow-x-auto">
          <div className="min-w-max mx-auto">

            {/* Row 1 — EHR */}
            <div className="flex justify-center mb-4">
              <div className="bg-blue-900 border-2 border-blue-400 rounded-xl px-8 py-4 text-center">
                <p className="text-2xl mb-1">🏥</p>
                <p className="text-white font-black">EHR System</p>
                <p className="text-blue-300 text-xs">Patient Records</p>
              </div>
            </div>

            <div className="flex justify-center text-blue-400 text-2xl mb-4">↓</div>

            {/* Row 2 — FHIR */}
            <div className="flex justify-center mb-4">
              <div className="bg-purple-900 border-2 border-purple-400 rounded-xl px-8 py-4 text-center">
                <p className="text-2xl mb-1">📊</p>
                <p className="text-white font-black">FHIR R4 API</p>
                <p className="text-purple-300 text-xs">Patient · Observation · Condition · Medication</p>
              </div>
            </div>

            <div className="flex justify-center text-purple-400 text-2xl mb-4">↓</div>

            {/* Row 3 — Node Gateway */}
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-900 border-2 border-yellow-400 rounded-xl px-8 py-4 text-center">
                <p className="text-2xl mb-1">🔌</p>
                <p className="text-white font-black">Node.js API Gateway</p>
                <p className="text-yellow-300 text-xs">SHARP Context · MCP Tools · Route Handler</p>
              </div>
            </div>

            <div className="flex justify-center text-yellow-400 text-2xl mb-4">↓</div>

            {/* Row 4 — 4 Agents */}
            <div className="flex gap-3 mb-4 justify-center">
              {[
                { icon: '🟦', name: 'Context Builder', sub: 'Groq/Llama 3.3', border: 'border-blue-400', bg: 'bg-blue-900' },
                { icon: '🟥', name: 'Risk Intelligence', sub: 'Groq/Llama 3.3', border: 'border-red-400', bg: 'bg-red-900' },
                { icon: '🟨', name: 'Clinical Reasoning', sub: 'GPT-4o', border: 'border-yellow-400', bg: 'bg-yellow-900' },
                { icon: '🟩', name: 'Handoff Validation', sub: 'GPT-4o 🔑', border: 'border-green-400', bg: 'bg-green-900' },
              ].map((agent, i) => (
                <div key={i} className={`${agent.bg} border-2 ${agent.border} rounded-xl px-4 py-3 text-center w-36`}>
                  <p className="text-xl mb-1">{agent.icon}</p>
                  <p className="text-white font-black text-xs">{agent.name}</p>
                  <p className="text-gray-300 text-xs mt-1">{agent.sub}</p>
                  {i < 3 && <p className="text-purple-400 text-xs mt-1">→ A2A →</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-center text-green-400 text-2xl mb-4">↓</div>

            {/* Row 5 — Output */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="bg-green-900 border-2 border-green-400 rounded-xl px-6 py-3 text-center">
                <p className="text-white font-black text-sm">✅ Verified Handoff Packet</p>
                <p className="text-green-300 text-xs">SBAR · Risk Flags · Audit Trail</p>
              </div>
            </div>

            <div className="flex justify-center text-blue-400 text-2xl mb-4">↓</div>

            {/* Row 6 — Prompt Opinion */}
            <div className="flex justify-center gap-4">
              <div className="bg-blue-950 border-2 border-blue-300 rounded-xl px-6 py-3 text-center">
                <p className="text-white font-black text-sm">🏆 Prompt Opinion Marketplace</p>
                <p className="text-blue-300 text-xs">MCP Tools · A2A Agent · SHARP Context</p>
              </div>
              <div className="bg-gray-900 border-2 border-gray-500 rounded-xl px-6 py-3 text-center">
                <p className="text-white font-black text-sm">⚛️ React Clinician UI</p>
                <p className="text-gray-300 text-xs">Dashboard · Live Demo · Audit Trail</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { color: 'bg-purple-500', label: 'A2A Communication' },
            { color: 'bg-blue-500', label: 'FHIR Data Flow' },
            { color: 'bg-green-500', label: 'Verified Output' },
            { color: 'bg-yellow-500', label: 'MCP Tools' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-gray-600 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}