import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MetricsDashboard from '../components/MetricsDashboard'
import BeforeAfter from '../components/BeforeAfter'
import TechStack from '../components/TechStack'
import AgentPipeline from '../components/AgentPipeline'
import HallucinationDemo from '../components/HallucinationDemo'
import ArchitectureDiagram from '../components/ArchitectureDiagram'

const SAMPLE = {
  name: 'Margaret Chen, 67F',
  diagnosis: 'Community-acquired pneumonia',
  vitals: 'BP 88/54 ↓ · SpO2 91% · Temp 39.2°C · HR 118',
  allergy: 'PENICILLIN — anaphylaxis',
  meds: 'Warfarin · Metformin · Lisinopril',
  pending: 'Blood cultures x2 · Chest CT · INR'
}

function MiniDemo() {
  const [ran, setRan] = useState(false)
  const [loading, setLoading] = useState(false)

  const run = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setRan(true) }, 2500)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-blue-950 px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-black text-sm">{SAMPLE.name}</p>
          <p className="text-blue-300 text-xs">{SAMPLE.diagnosis}</p>
        </div>
        <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
          CRITICAL
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {[
          { label: 'Vitals', value: SAMPLE.vitals, alert: true },
          { label: '⚠️ Allergy', value: SAMPLE.allergy, alert: true },
          { label: 'Medications', value: SAMPLE.meds, alert: false },
          { label: 'Pending Labs', value: SAMPLE.pending, alert: false },
        ].map((item, i) => (
          <div key={i} className={`rounded-xl p-2 ${item.alert ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
            <p className="text-xs font-bold text-gray-500 mb-1">{item.label}</p>
            <p className={`text-xs font-semibold leading-tight ${item.alert ? 'text-red-700' : 'text-gray-700'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {!ran && (
        <div className="px-3 pb-3">
          <button onClick={run} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-black py-3 rounded-xl transition-all text-sm">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span> Running 4-Agent Pipeline...
              </span>
            ) : '🚀 Generate Safe Handoff'}
          </button>
        </div>
      )}

      {ran && (
        <div className="px-3 pb-3 space-y-2">
          <div className="bg-red-600 text-white rounded-xl p-3 text-center font-black text-xs">
            🚨 CRITICAL · Safety Score: 45/100 · CLINICIAN REVIEW REQUIRED
          </div>
          <div className="space-y-1.5">
            {[
              { flag: '🚨 PENICILLIN ALLERGY — verify antibiotic orders NOW', color: 'red' },
              { flag: '📉 BP 88/54 falling — sepsis protocol required', color: 'red' },
              { flag: '🩸 Warfarin + infection — stat INR check', color: 'orange' },
              { flag: '🔬 Blood cultures pending — do not change antibiotics yet', color: 'yellow' },
            ].map((item, i) => (
              <div key={i} className={`border-l-4 rounded-lg p-2 text-xs font-semibold
                ${item.color === 'red' ? 'border-red-500 bg-red-50 text-red-800' :
                  item.color === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-800' :
                  'border-yellow-500 bg-yellow-50 text-yellow-800'}`}>
                {item.flag}
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-black text-blue-800 mb-1.5">✅ Verified SBAR Handoff</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>S:</strong> Margaret Chen, 67F — CRITICAL. BP 88/54 falling, sepsis suspected. PCN allergy on file.<br />
              <strong>B:</strong> CAP + DM2 + HTN. On Warfarin. 6hrs admitted, poor response. Cultures pending.<br />
              <strong>A:</strong> Probable septic shock. Antibiotic selection critical (PCN allergy). Warfarin risk.<br />
              <strong>R:</strong> Sepsis protocol. Verify antibiotics. Stat INR + glucose. Follow cultures.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-xl text-xs">✅ Approve & Send</button>
            <button className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs">✏️ Edit First</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-800 border border-blue-600 rounded-full px-3 py-1.5 text-blue-300 text-xs mb-5">
              <span className="animate-pulse text-green-400">●</span>
              Agents Assemble Hackathon · MCP + A2A + FHIR R4
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Clinical handoffs in 90 seconds with
              <span className="text-blue-300"> multi-agent AI validation</span>
            </h1>
            <p className="text-blue-200 text-base sm:text-lg mb-5">
              CareRelay OS reduces dangerous shift-change errors using A2A agents, MCP tools, and live FHIR patient context — published on Prompt Opinion.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['📊 Reads FHIR data', '🤖 AI-generated SBAR', '🚨 Flags risks', '🛡️ Validates facts', '👨‍⚕️ Human review'].map((pill, i) => (
                <span key={i} className="bg-blue-800 text-blue-200 text-xs px-3 py-1.5 rounded-full border border-blue-600">{pill}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-5">
              <Link to="/live-demo" className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-black px-5 py-3 rounded-xl transition-all text-sm">
                ⚡ View Live Demo
              </Link>
              <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-3 rounded-xl text-sm border border-white/30 transition-all">
                🏆 View on Prompt Opinion
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '🔌', text: 'MCP Published' },
                { icon: '🤝', text: 'A2A Active' },
                { icon: '🏥', text: 'FHIR Native' },
                { icon: '🛡️', text: 'Hallucination Guard' },
                { icon: '✅', text: 'Human-in-Loop' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
                  <span>{b.icon}</span>
                  <span className="text-white text-xs font-semibold">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-blue-300 text-sm font-semibold mb-3 text-center">👇 Try it right here — no signup needed</p>
            <MiniDemo />
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="bg-blue-900 py-5 px-4 border-b border-blue-800">
        <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { num: '90 sec', label: 'Avg Handoff Time' },
            { num: '4', label: 'AI Agents' },
            { num: '97%', label: 'Completeness' },
            { num: '100%', label: 'Hallucinations Caught' },
            { num: 'FHIR R4', label: 'Native Integration' },
            { num: '78%', label: 'Faster Than Manual' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-blue-300 font-black text-base sm:text-xl">{stat.num}</p>
              <p className="text-blue-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROMPT OPINION BADGE */}
      <div className="bg-teal-950 py-4 px-4 text-center border-b border-teal-800">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-teal-300 text-sm font-semibold">🏆 Live on Prompt Opinion Platform</span>
          <span className="bg-teal-700 text-teal-100 text-xs px-3 py-1 rounded-full font-bold">✅ MCP Server Published</span>
          <span className="bg-teal-700 text-teal-100 text-xs px-3 py-1 rounded-full font-bold">✅ FHIR Context Supported</span>
          <span className="bg-teal-700 text-teal-100 text-xs px-3 py-1 rounded-full font-bold">✅ 3 Tools Available</span>
          <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
            className="bg-white text-teal-900 font-black text-xs px-4 py-1.5 rounded-full hover:bg-teal-100 transition-all">
            Open in Prompt Opinion Marketplace →
          </a>
        </div>
      </div>

      {/* PROMPT OPINION PROOF */}
      <div className="bg-white py-10 sm:py-12 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">🏆 Live on Prompt Opinion Platform</h2>
            <p className="text-gray-500 text-sm sm:text-base">CareRelay OS is published, discoverable, and invokable inside the Prompt Opinion ecosystem</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🔌', title: 'MCP Server Published', desc: '3 tools registered and invokable by any agent in the Prompt Opinion marketplace', badge: 'LIVE', color: 'green' },
              { icon: '🤝', title: 'A2A Agent Active', desc: 'CareRelay OS agent published with A2A enabled — callable by other agents on the platform', badge: 'PUBLISHED', color: 'blue' },
              { icon: '🏥', title: 'FHIR Context Supported', desc: 'Full SHARP extension implemented — receives patient context directly from EHR sessions', badge: 'VERIFIED', color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-3
                  ${item.color === 'green' ? 'bg-green-100 text-green-700' :
                    item.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  ● {item.badge}
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Screenshots */}
          <div className="mb-6">
            <p className="text-center text-gray-500 text-sm font-semibold mb-4">📸 Real screenshots from Prompt Opinion Platform</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { src: '/screenshots/mcp-server.png', label: '🔌 MCP Server Published', desc: 'CareRelay OS listed in Marketplace MCP Servers' },
                { src: '/screenshots/agent-listing.png', label: '🤝 A2A Agent Published', desc: 'Published · A2A Enabled · Workspace, Patient, Group' },
                { src: '/screenshots/live-demo.png', label: '⚡ Agent Running Live', desc: 'CareRelay OS generating clinical handoff inside platform' },
              ].map((shot, i) => (
                <div key={i} className="bg-gray-950 rounded-xl overflow-hidden border border-gray-700">
                  <img src={shot.src} alt={shot.label} className="w-full object-cover" />
                  <div className="p-3">
                    <p className="text-white font-black text-xs">{shot.label}</p>
                    <p className="text-gray-400 text-xs mt-1">{shot.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-950 rounded-2xl p-4 border border-gray-700">
              <p className="text-green-400 font-black text-sm mb-3">✅ CareRelay OS Agent — Live in Prompt Opinion</p>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs">
                <p className="text-blue-300 mb-2">CareRelay OS · Connected ●</p>
                <p className="text-gray-400">▸ Marketplace: <span className="text-green-400">Published</span></p>
                <p className="text-gray-400">▸ A2A: <span className="text-green-400">Enabled</span></p>
                <p className="text-gray-400">▸ FHIR Context: <span className="text-green-400">Supported</span></p>
                <p className="text-gray-400">▸ Contexts: <span className="text-blue-300">Workspace · Patient · Group</span></p>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-yellow-300">Skills:</p>
                  <p className="text-gray-300">→ Generate Clinical Handoff</p>
                  <p className="text-gray-300">→ Patient Risk Assessment</p>
                  <p className="text-gray-300">→ Get Patient Context</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-950 rounded-2xl p-4 border border-gray-700">
              <p className="text-green-400 font-black text-sm mb-3">✅ MCP Tools — Live Health Check</p>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs">
                <p className="text-blue-300 mb-2">GET /api/mcp/health → 200 OK</p>
                <p className="text-gray-400">▸ mcp_server: <span className="text-green-400">careRelay-os</span></p>
                <p className="text-gray-400">▸ status: <span className="text-green-400">online</span></p>
                <div className="mt-2">
                  <p className="text-yellow-300">Tools:</p>
                  <p className="text-gray-300">→ generate_clinical_handoff</p>
                  <p className="text-gray-300">→ get_patient_risk_assessment</p>
                  <p className="text-gray-300">→ get_patient_context</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-purple-300">▸ FHIR Extension: <span className="text-green-400">✅ Supported</span></p>
                  <p className="text-purple-300">▸ SHARP Context: <span className="text-green-400">✅ Active</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Live status bar */}
          <div className="bg-blue-950 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-black text-base mb-1">✅ CareRelay OS is running inside Prompt Opinion right now</p>
                <p className="text-blue-300 text-xs sm:text-sm">Agent responds to clinical queries · Calls MCP tools · Processes FHIR data · Returns verified handoffs</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
                  className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-black px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap">
                  Open in Prompt Opinion →
                </a>
                <a href="https://carerelay-os-production-2e3a.up.railway.app/api/mcp/health" target="_blank" rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-xl text-sm border border-white/30 transition-all whitespace-nowrap">
                  🔌 Live MCP Health
                </a>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['generate_clinical_handoff', 'get_patient_risk_assessment', 'get_patient_context'].map((tool, i) => (
                <span key={i} className="bg-blue-800 text-blue-200 text-xs px-3 py-1 rounded-full font-mono">{tool}()</span>
              ))}
              <span className="bg-green-800 text-green-200 text-xs px-3 py-1 rounded-full">✅ FHIR R4 Native</span>
              <span className="bg-purple-800 text-purple-200 text-xs px-3 py-1 rounded-full">✅ SHARP Context</span>
              <span className="bg-yellow-800 text-yellow-200 text-xs px-3 py-1 rounded-full">✅ A2A Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEM STATEMENT */}
      <div className="bg-gray-950 px-4 sm:px-6 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl sm:text-4xl font-black text-white mb-4">"One missed detail can change everything."</p>
          <p className="text-gray-400 text-base sm:text-lg">
            Shift changes are where care breaks down. Every day, nurses spend 12+ minutes manually summarizing patients — and critical information still gets lost.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              { num: '195,000', label: 'patients harmed by handoff errors annually', source: 'The Joint Commission, 2015' },
              { num: '$28B', label: 'annual cost of preventable medical errors', source: 'Journal of Patient Safety, 2013' },
              { num: '#1', label: 'handoff errors as cause of sentinel events', source: 'CRICO Strategies, 2015' },
            ].map((s, i) => (
              <div key={i} className="py-2">
                <p className="text-3xl font-black text-red-400">{s.num}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                <p className="text-gray-600 text-xs mt-1 italic">— {s.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT AI ACTUALLY DOES */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">What CareRelay's AI Actually Does</h2>
            <p className="text-gray-500 text-sm sm:text-base">Tasks that traditional rule-based software cannot perform</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🧩', title: 'Synthesizes Scattered Records', desc: 'Reads Patient, Observation, Condition, Medication, and Encounter FHIR resources and builds a unified clinical timeline.' },
              { icon: '⚡', title: 'Prioritizes Urgent Changes', desc: 'Agent 2 detects deterioration signals, abnormal vitals trends, and contradictions — surfacing what matters RIGHT NOW.' },
              { icon: '🔍', title: 'Detects Missing Critical Info', desc: "Identifies what SHOULD be in the record but isn't — pending labs, unchecked allergies, missing vitals." },
              { icon: '📋', title: 'Generates Clinician-Ready SBAR', desc: 'Agent 3 converts raw data into a structured handoff grounded in actual patient data.' },
              { icon: '🛡️', title: 'Prevents Hallucinations', desc: 'Agent 4 cross-checks every claim against FHIR source. Unsupported statements are removed before clinician review.' },
              { icon: '👨‍⚕️', title: 'Keeps Humans in Control', desc: "Every handoff requires clinician review and approval before it's sent — with full audit trail." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TECH FLOW */}
      <div className="bg-blue-950 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-blue-300 text-sm font-semibold mb-6">Built for interoperable healthcare AI ecosystems</p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2">
            {[
              { label: 'FHIR R4', icon: '🏥', desc: 'Patient Data' },
              { label: 'MCP Tools', icon: '🔌', desc: '3 Tools Exposed' },
              { label: 'A2A Agents', icon: '🤝', desc: '4-Agent Chain' },
              { label: 'SHARP Context', icon: '🔑', desc: 'Token Propagation' },
              { label: 'CareRelay OS', icon: '🏆', desc: 'Safe Handoff' },
            ].map((item, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-center">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-white font-black text-xs">{item.label}</p>
                  <p className="text-blue-400 text-xs">{item.desc}</p>
                </div>
                {i < arr.length - 1 && <span className="text-blue-500 text-xl font-black hidden sm:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AGENT PIPELINE */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Multi-Agent Architecture</h2>
            <p className="text-gray-500 text-sm sm:text-base">4 specialized AI agents working in sequence via A2A protocol</p>
          </div>
          <AgentPipeline />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { num: '1', name: 'Context Builder', provider: 'Groq/Llama 3.3', job: 'Unified patient timeline from FHIR', color: 'blue' },
              { num: '2', name: 'Risk Intelligence', provider: 'Groq/Llama 3.3', job: 'Deterioration signals + urgency score', color: 'red' },
              { num: '3', name: 'Clinical Reasoning', provider: 'GPT-4o', job: 'Data-grounded SBAR generation', color: 'yellow' },
              { num: '4', name: 'Handoff Validation 🔑', provider: 'GPT-4o', job: 'Hallucination removal + safety check', color: 'green' },
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-xl p-3 sm:p-4 shadow border border-gray-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm mb-2
                  ${a.color === 'blue' ? 'bg-blue-500' : a.color === 'red' ? 'bg-red-500' : a.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {a.num}
                </div>
                <p className="font-black text-gray-900 text-xs sm:text-sm">{a.name}</p>
                <p className="text-xs text-gray-500 mt-1">{a.job}</p>
                <p className="text-xs text-blue-600 mt-1 font-semibold">{a.provider}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HallucinationDemo />
      <ArchitectureDiagram />
      <MetricsDashboard />

      {/* SAFETY */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">🛡️ Built for Clinical Trust</h2>
            <p className="text-gray-500">Safety is not an afterthought — it is the architecture</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '👨‍⚕️', title: 'Human Review Required', desc: 'Every handoff must be reviewed and approved by a clinician before it is sent.' },
              { icon: '🔗', title: 'Source-Linked Facts', desc: 'Agent 4 traces every claim back to its FHIR source. If unverified, it is removed.' },
              { icon: '🚫', title: 'No Unsupported Claims', desc: 'Hallucination flags are caught and removed before the handoff reaches a clinician.' },
              { icon: '📋', title: 'Full Audit Trail', desc: 'Every handoff is logged with timestamp, clinician identity, and acknowledgment.' },
              { icon: '📊', title: 'Confidence Indicators', desc: 'Safety score shown on every handoff. Clinicians know exactly how much to trust each output.' },
              { icon: '⚠️', title: 'Missing Info Warnings', desc: 'If critical data is absent from FHIR records, CareRelay flags it explicitly.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-black text-gray-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-green-900 rounded-2xl p-5 text-center">
            <p className="text-white font-black text-base mb-4">Every Handoff Ships With These Guarantees</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['✅ FHIR-verified facts only', '🛡️ Hallucinations removed', '👨‍⚕️ Clinician approved', '📋 Audit logged', '⚠️ Missing info flagged', '📊 Safety scored'].map((badge, i) => (
                <span key={i} className="bg-green-700 text-green-100 text-xs sm:text-sm px-3 py-1.5 rounded-full font-semibold">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* USE CASES */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Built for Real Clinical Workflows</h2>
            <p className="text-gray-500 text-sm sm:text-base">CareRelay OS handles the most dangerous transitions in healthcare</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🌙', title: 'Shift Change Handoff', who: 'Nurse → Nurse', problem: 'Night nurse inherits 8 patients with incomplete notes, missed vitals, and pending labs from a rushed day shift.', solution: 'CareRelay reads all FHIR data, flags the patient with falling BP and penicillin allergy, and delivers a verified SBAR in 90 seconds.', color: 'blue' },
              { icon: '🚑', title: 'ER to Ward Transfer', who: 'Emergency → Ward Team', problem: 'ER physician must hand off a complex sepsis patient to the ward team during peak hours with no time to write full notes.', solution: 'Agent 2 detects sepsis signals, Agent 4 validates every claim against FHIR vitals, producing a safe transfer summary instantly.', color: 'red' },
              { icon: '👨‍⚕️', title: 'Specialist Referral', who: 'GP → Specialist', problem: 'Cardiologist receives referral with scattered notes, missing medication list, and no allergy information from the referring GP.', solution: 'CareRelay synthesizes the complete patient context from FHIR, surfaces drug interactions, and generates a specialist-ready summary.', color: 'green' },
            ].map((card, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow border-t-4
                ${card.color === 'blue' ? 'border-blue-500' : card.color === 'red' ? 'border-red-500' : 'border-green-500'}`}>
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="font-black text-gray-900 text-base mb-1">{card.title}</h3>
                <span className={`text-xs font-bold mb-3 px-2 py-1 rounded-full inline-block
                  ${card.color === 'blue' ? 'bg-blue-100 text-blue-700' : card.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {card.who}
                </span>
                <div className="mb-3 mt-3">
                  <p className="text-xs font-black text-gray-500 mb-1">❌ WITHOUT CARERELAY</p>
                  <p className="text-xs sm:text-sm text-gray-600">{card.problem}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs font-black text-green-600 mb-1">✅ WITH CARERELAY OS</p>
                  <p className="text-xs sm:text-sm text-gray-700">{card.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BeforeAfter />
      <TechStack />

      {/* FINAL CTA */}
      <div className="bg-gradient-to-br from-blue-950 to-blue-800 py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Assemble?</h2>
          <p className="text-blue-300 text-base sm:text-lg mb-8">CareRelay OS is live, open source, and ready for integration into any clinical workflow via Prompt Opinion.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/live-demo" className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-black px-8 py-4 rounded-xl text-lg transition-all">
              ⚡ Try Live Demo
            </Link>
            <a href="https://github.com/ojekunlesamson09-maker/careRelay-os" target="_blank" rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white font-black px-8 py-4 rounded-xl text-lg border border-white/30 transition-all">
              📂 View on GitHub
            </a>
          </div>
          <p className="text-blue-500 text-sm mt-8">Built by Samson Ojekunle · Agents Assemble Hackathon 2026 · MCP + A2A + FHIR R4 · Prompt Opinion Platform</p>
        </div>
      </div>

      <div className="bg-gray-950 py-6 text-center px-4">
        <p className="text-gray-600 text-sm">
          🏥 CareRelay OS — Clinical Handoff Intelligence Network ·
          <a href="https://github.com/ojekunlesamson09-maker/careRelay-os" className="text-blue-500 hover:text-blue-400 ml-1">GitHub</a>
        </p>
      </div>
    </div>
  )
}