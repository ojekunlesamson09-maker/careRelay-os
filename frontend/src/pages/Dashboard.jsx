import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MetricsDashboard from '../components/MetricsDashboard'
import BeforeAfter from '../components/BeforeAfter'
import TechStack from '../components/TechStack'
import AgentPipeline from '../components/AgentPipeline'
import HallucinationDemo from '../components/HallucinationDemo'
import ArchitectureDiagram from '../components/ArchitectureDiagram'

// ── Mini Live Demo (inline on homepage) ─────────────────────
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
      <div className="bg-blue-950 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-black">{SAMPLE.name}</p>
          <p className="text-blue-300 text-sm">{SAMPLE.diagnosis}</p>
        </div>
        <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
          CRITICAL
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {[
          { label: 'Vitals', value: SAMPLE.vitals, alert: true },
          { label: '⚠️ Allergy', value: SAMPLE.allergy, alert: true },
          { label: 'Medications', value: SAMPLE.meds, alert: false },
          { label: 'Pending Labs', value: SAMPLE.pending, alert: false },
        ].map((item, i) => (
          <div key={i} className={`rounded-xl p-3 ${item.alert ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
            <p className="text-xs font-bold text-gray-500 mb-1">{item.label}</p>
            <p className={`text-xs font-semibold ${item.alert ? 'text-red-700' : 'text-gray-700'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {!ran && (
        <div className="px-4 pb-4">
          <button
            onClick={run}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70
                       text-white font-black py-3 rounded-xl transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span> Running 4-Agent Pipeline...
              </span>
            ) : '🚀 Generate Safe Handoff'}
          </button>
        </div>
      )}

      {ran && (
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-red-600 text-white rounded-xl p-3 text-center font-black">
            🚨 CRITICAL · Safety Score: 45/100 · CLINICIAN REVIEW REQUIRED
          </div>
          <div className="space-y-2">
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
            <p className="text-xs font-black text-blue-800 mb-2">✅ Verified SBAR Handoff</p>
            <p className="text-xs text-blue-700">
              <strong>S:</strong> Margaret Chen, 67F — CRITICAL. BP 88/54 falling, sepsis suspected. PCN allergy on file.<br />
              <strong>B:</strong> CAP + DM2 + HTN. On Warfarin. 6hrs admitted, poor response. Cultures pending.<br />
              <strong>A:</strong> Probable septic shock. Antibiotic selection critical (PCN allergy). Warfarin risk.<br />
              <strong>R:</strong> Sepsis protocol. Verify antibiotics. Stat INR + glucose. Follow cultures.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-xl text-sm">
              ✅ Approve & Send
            </button>
            <button className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-sm">
              ✏️ Edit First
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
  const [patientId, setPatientId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!patientId.trim()) return
    navigate(`/handoff/${patientId.trim()}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── SECTION 1: HERO ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-800 border border-blue-600
                            rounded-full px-4 py-2 text-blue-300 text-sm mb-6">
              <span className="animate-pulse text-green-400">●</span>
              Agents Assemble Hackathon · MCP + A2A + FHIR R4
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Generate a Safe Clinical Handoff in
              <span className="text-blue-300"> 90 Seconds</span>
            </h1>

            <p className="text-blue-200 text-lg mb-6">
              CareRelay OS is a 4-agent AI system that reads FHIR patient data,
              flags risks, generates a verified SBAR handoff, and prevents
              hallucinations — eliminating the #1 cause of medical errors.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {[
                '📊 Reads FHIR data',
                '🤖 AI-generated SBAR',
                '🚨 Flags risks',
                '🛡️ Validates facts',
                '👨‍⚕️ Human review'
              ].map((pill, i) => (
                <span key={i} className="bg-blue-800 text-blue-200 text-xs px-3 py-1.5
                                         rounded-full border border-blue-600">
                  {pill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link to="/live-demo"
                className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-black
                           px-6 py-3 rounded-xl transition-all text-sm">
                ⚡ Try Full Live Demo
              </Link>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  placeholder="FHIR Patient ID..."
                  className="px-4 py-3 rounded-xl text-gray-800 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-300 w-36"
                />
                <button type="submit" disabled={!patientId}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold
                             px-4 py-3 rounded-xl text-sm border border-white/30">
                  Go →
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: '🏥', text: 'FHIR R4 Native' },
                { icon: '🔌', text: 'MCP Compatible' },
                { icon: '🤝', text: 'A2A Standards' },
                { icon: '🛡️', text: 'Hallucination Guard' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/10
                                        rounded-lg px-3 py-1.5 border border-white/20">
                  <span>{b.icon}</span>
                  <span className="text-white text-xs font-semibold">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-blue-300 text-sm font-semibold mb-3 text-center">
              👇 Try it right here — no signup needed
            </p>
            <MiniDemo />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: PROBLEM STATEMENT ────────────────────── */}
      <div className="bg-gray-950 px-6 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-4xl font-black text-white mb-4">
            "One missed detail can change everything."
          </p>
          <p className="text-gray-400 text-lg">
            Shift changes are where care breaks down. Every day, nurses spend
            12+ minutes manually summarizing patients — and critical information
            still gets lost. CareRelay ensures the next clinician starts
            informed, instantly.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { num: '195,000', label: 'patients harmed by handoff errors annually' },
              { num: '$28B', label: 'annual cost of preventable medical errors' },
              { num: '#1', label: 'handoff errors as cause of sentinel events' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-red-400">{s.num}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: WHAT AI ACTUALLY DOES ────────────────── */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              What CareRelay's AI Actually Does
            </h2>
            <p className="text-gray-500">
              Tasks that traditional rule-based software cannot perform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🧩', title: 'Synthesizes Scattered Records', desc: 'Reads Patient, Observation, Condition, Medication, and Encounter FHIR resources and builds a unified clinical timeline — something no rule-based system can do.' },
              { icon: '⚡', title: 'Prioritizes Urgent Changes', desc: 'Agent 2 detects deterioration signals, abnormal vitals trends, and contradictions in records — surfacing what matters RIGHT NOW for patient safety.' },
              { icon: '🔍', title: 'Detects Missing Critical Info', desc: "Identifies what SHOULD be in the record but isn't — pending labs, unchecked allergies, missing vitals — and flags them before handoff." },
              { icon: '📋', title: 'Generates Clinician-Ready SBAR', desc: 'Agent 3 converts raw data into a structured Situation-Background-Assessment-Recommendation handoff grounded in actual patient data.' },
              { icon: '🛡️', title: 'Prevents Hallucinations', desc: 'Agent 4 cross-checks every claim against the FHIR source. Unsupported statements are removed. Nothing goes to a clinician unverified.' },
              { icon: '👨‍⚕️', title: 'Keeps Humans in Control', desc: "CareRelay never replaces clinical judgment. Every handoff requires clinician review and approval before it's sent — with full audit trail." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 4: TECH ALIGNMENT STRIP ─────────────────── */}
      <div className="bg-blue-950 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-blue-300 text-sm font-semibold mb-6">
            Built for interoperable healthcare AI ecosystems
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { label: 'FHIR R4', icon: '🏥', desc: 'Patient Data' },
              { label: '→', icon: '', desc: '' },
              { label: 'MCP Tools', icon: '🔌', desc: '3 Tools Exposed' },
              { label: '→', icon: '', desc: '' },
              { label: 'A2A Agents', icon: '🤝', desc: '4-Agent Chain' },
              { label: '→', icon: '', desc: '' },
              { label: 'SHARP Context', icon: '🔑', desc: 'Token Propagation' },
              { label: '→', icon: '', desc: '' },
              { label: 'CareRelay OS', icon: '🏆', desc: 'Safe Handoff' },
            ].map((item, i) => (
              item.label === '→' ? (
                <span key={i} className="text-blue-500 text-2xl font-black">→</span>
              ) : (
                <div key={i} className="bg-blue-900 border border-blue-700 rounded-xl
                                        px-4 py-3 text-center min-w-24">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-white font-black text-xs">{item.label}</p>
                  <p className="text-blue-400 text-xs">{item.desc}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 5: AGENT PIPELINE ────────────────────────── */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Multi-Agent Architecture
            </h2>
            <p className="text-gray-500">
              4 specialized AI agents working in sequence — each passing
              verified context to the next via A2A protocol
            </p>
          </div>
          <AgentPipeline />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { num: '1', name: 'Context Builder', provider: 'Groq/Llama 3.3', job: 'Unified patient timeline from FHIR', color: 'blue' },
              { num: '2', name: 'Risk Intelligence', provider: 'Groq/Llama 3.3', job: 'Deterioration signals + urgency score', color: 'red' },
              { num: '3', name: 'Clinical Reasoning', provider: 'GPT-4o', job: 'Data-grounded SBAR generation', color: 'yellow' },
              { num: '4', name: 'Handoff Validation 🔑', provider: 'GPT-4o', job: 'Hallucination removal + safety check', color: 'green' },
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow border border-gray-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                 text-white font-black text-sm mb-2
                                 ${a.color === 'blue' ? 'bg-blue-500' :
                                   a.color === 'red' ? 'bg-red-500' :
                                   a.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {a.num}
                </div>
                <p className="font-black text-gray-900 text-sm">{a.name}</p>
                <p className="text-xs text-gray-500 mt-1">{a.job}</p>
                <p className="text-xs text-blue-600 mt-1 font-semibold">{a.provider}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 6: HALLUCINATION DEMO ───────────────────── */}
      <HallucinationDemo />

      {/* ── SECTION 7: ARCHITECTURE DIAGRAM ─────────────────── */}
      <ArchitectureDiagram />

      {/* ── SECTION 8: METRICS ───────────────────────────────── */}
      <MetricsDashboard />

      {/* ── SECTION 9: SAFETY & TRUST ────────────────────────── */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              🛡️ Built for Clinical Trust
            </h2>
            <p className="text-gray-500">
              Safety is not an afterthought — it is the architecture
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '👨‍⚕️', title: 'Human Review Required', desc: 'Every handoff must be reviewed and approved by a clinician before it is sent. CareRelay assists, never replaces.' },
              { icon: '🔗', title: 'Source-Linked Facts', desc: 'Agent 4 traces every claim back to its FHIR source. If it cannot be verified, it is removed or flagged.' },
              { icon: '🚫', title: 'No Unsupported Claims', desc: 'Hallucination flags are caught and removed before the handoff reaches a clinician. Zero tolerance policy.' },
              { icon: '📋', title: 'Full Audit Trail', desc: 'Every handoff is logged with timestamp, clinician identity, and acknowledgment. Full accountability chain.' },
              { icon: '📊', title: 'Confidence Indicators', desc: 'Safety score and completeness score shown on every handoff. Clinicians know exactly how much to trust each output.' },
              { icon: '⚠️', title: 'Missing Info Warnings', desc: 'If critical data is absent from FHIR records, CareRelay flags it explicitly — never silently omits it.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-900 rounded-2xl p-6 text-center">
            <p className="text-white font-black text-lg mb-4">
              Every Handoff Ships With These Guarantees
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                '✅ FHIR-verified facts only',
                '🛡️ Hallucinations removed',
                '👨‍⚕️ Clinician approved',
                '📋 Audit logged',
                '⚠️ Missing info flagged',
                '📊 Safety scored'
              ].map((badge, i) => (
                <span key={i} className="bg-green-700 text-green-100 text-sm
                                         px-4 py-2 rounded-full font-semibold">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 10: BEFORE / AFTER ───────────────────────── */}
      <BeforeAfter />

      {/* ── SECTION 11: TECH STACK ───────────────────────────── */}
      <TechStack />

      {/* ── SECTION 12: FINAL CTA ────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-950 to-blue-800 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Assemble?
          </h2>
          <p className="text-blue-300 text-lg mb-8">
            CareRelay OS is live, open source, and ready for integration
            into any clinical workflow via Prompt Opinion.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/live-demo"
              className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-black
                         px-8 py-4 rounded-xl text-lg transition-all">
              ⚡ Try Live Demo
            </Link>
            <a href="https://github.com/ojekunlesamson09-maker/careRelay-os"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white font-black
                         px-8 py-4 rounded-xl text-lg border border-white/30 transition-all">
              📂 View on GitHub
            </a>
          </div>
          <p className="text-blue-500 text-sm mt-8">
            Built by Samson Ojekunle · Agents Assemble Hackathon 2026 ·
            MCP + A2A + FHIR R4 · Prompt Opinion Platform
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-950 py-6 text-center">
        <p className="text-gray-600 text-sm">
          🏥 CareRelay OS — Clinical Handoff Intelligence Network ·
          <a href="https://github.com/ojekunlesamson09-maker/careRelay-os"
            className="text-blue-500 hover:text-blue-400 ml-1">
            GitHub
          </a>
        </p>
      </div>
    </div>
  )
}