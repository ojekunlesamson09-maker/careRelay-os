export default function TechStack() {
  return (
    <div className="py-16 px-6 bg-blue-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">
            Built on Open Standards
          </h2>
          <p className="text-blue-300">
            Fully compliant with MCP, A2A, and FHIR R4 — no vendor lock-in
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: '🔌',
              title: 'MCP — Model Context Protocol',
              desc: 'CareRelay exposes 3 MCP tools natively compatible with the Prompt Opinion marketplace. Any compliant agent can invoke our handoff engine.',
              items: ['generate_clinical_handoff', 'get_patient_risk_assessment', 'get_patient_context'],
              color: 'blue'
            },
            {
              icon: '🤝',
              title: 'A2A — Agent to Agent',
              desc: 'Our 4-agent system communicates via A2A standards. Each agent passes verified context to the next, creating a closed-loop intelligence chain.',
              items: ['Context → Risk Agent', 'Risk → Reasoning Agent', 'Reasoning → Validation Agent'],
              color: 'purple'
            },
            {
              icon: '🏥',
              title: 'FHIR R4 — Healthcare Standard',
              desc: 'Native FHIR R4 integration reads Patient, Observation, Condition, MedicationRequest, and Encounter resources directly from any EHR.',
              items: ['Patient demographics', 'Vitals & observations', 'Medications & conditions'],
              color: 'green'
            }
          ].map((tech, i) => (
            <div key={i} className="bg-blue-900 rounded-2xl p-6 border border-blue-700">
              <div className="text-3xl mb-3">{tech.icon}</div>
              <h3 className="text-white font-black mb-2">{tech.title}</h3>
              <p className="text-blue-300 text-sm mb-4">{tech.desc}</p>
              <ul className="space-y-1">
                {tech.items.map((item, j) => (
                  <li key={j} className="text-xs text-blue-200 flex items-center gap-2">
                    <span className="text-green-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SHARP Context */}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-2xl p-6 text-center">
          <h3 className="text-white font-black text-xl mb-2">
            🔑 SHARP Context Propagation
          </h3>
          <p className="text-blue-200 text-sm max-w-2xl mx-auto">
            CareRelay OS implements the SHARP extension spec — bridging EHR session 
            credentials directly into patient context, propagating FHIR tokens through 
            our entire multi-agent chain without custom glue code.
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {['Patient ID', 'FHIR Token', 'Session Context', 'Clinician Role'].map((tag, i) => (
              <span key={i} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}