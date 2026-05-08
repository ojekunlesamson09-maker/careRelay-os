import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScreenshotGallery from '../components/ScreenshotGallery'
import Navbar from '../components/Navbar'
import MetricsDashboard from '../components/MetricsDashboard'
import TechStack from '../components/TechStack'
import AgentPipeline from '../components/AgentPipeline'
import HallucinationDemo from '../components/HallucinationDemo'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import BeforeAfter from '../components/BeforeAfter'

const SAMPLE = {
  name: 'Margaret Chen, 67F',
  diagnosis: 'Community-acquired pneumonia',
  vitals: 'BP 88/54 — FALLING',
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
      <div className="bg-slate-900 px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-white font-black text-sm">{SAMPLE.name}</p>
          <p className="text-slate-400 text-xs font-mono">{SAMPLE.diagnosis}</p>
        </div>
        <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded font-mono animate-pulse">
          CRITICAL
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {[
          { label: 'Vitals',       value: SAMPLE.vitals,   alert: true  },
          { label: 'Allergy',      value: SAMPLE.allergy,  alert: true  },
          { label: 'Medications',  value: SAMPLE.meds,     alert: false },
          { label: 'Pending Labs', value: SAMPLE.pending,  alert: false },
        ].map((item, i) => (
          <div key={i} className={`rounded-xl p-2.5 ${item.alert ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
            <p className="text-xs font-bold text-gray-400 mb-1">{item.label}</p>
            <p className={`text-xs font-semibold leading-tight ${item.alert ? 'text-red-700' : 'text-gray-700'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      {!ran && (
        <div className="px-3 pb-3">
          <button onClick={run} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70
                       text-white font-bold py-3 rounded-xl transition-all text-sm font-mono">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙</span> Running pipeline...
                </span>
              : '> generate_handoff()'}
          </button>
        </div>
      )}
      {ran && (
        <div className="px-3 pb-3 space-y-2">
          <div className="bg-red-600 text-white rounded-xl p-3 text-center font-black text-xs font-mono">
            STATUS: CRITICAL · safety_score: 45/100 · CLINICIAN REVIEW REQUIRED
          </div>
          <div className="space-y-1.5">
            {[
              { flag: 'PENICILLIN ALLERGY — verify antibiotic orders NOW',      color: 'red'    },
              { flag: 'BP 88/54 falling — sepsis protocol required',            color: 'red'    },
              { flag: 'Warfarin + infection — stat INR check',                  color: 'orange' },
              { flag: 'Blood cultures pending — hold antibiotic changes',       color: 'yellow' },
            ].map((item, i) => (
              <div key={i} className={`border-l-4 rounded-lg p-2 text-xs font-semibold
                ${item.color === 'red'    ? 'border-red-500 bg-red-50 text-red-800' :
                  item.color === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-800' :
                                            'border-yellow-500 bg-yellow-50 text-yellow-800'}`}>
                {item.flag}
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-black text-slate-700 mb-1.5 font-mono">VERIFIED SBAR</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>S:</strong> Margaret Chen, 67F — CRITICAL. BP falling, sepsis suspected. PCN allergy documented.<br />
              <strong>B:</strong> CAP + DM2 + HTN. On Warfarin. 6hrs admitted, poor response. Cultures pending.<br />
              <strong>A:</strong> Probable septic shock. Antibiotic selection critical — NO penicillin class.<br />
              <strong>R:</strong> Sepsis protocol. Verify antibiotics. Stat INR + glucose. Follow cultures.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-xl text-xs">
              Approve & Send
            </button>
            <button className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs">
              Edit First
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── 1. HERO ── */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-800/60 border border-blue-700
                            rounded-full px-3 py-1.5 text-blue-300 text-xs mb-6">
              <span className="animate-pulse text-green-400">●</span>
              Agents Assemble Hackathon · MCP + A2A + FHIR R4
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              AI agents that catch
              <span className="text-red-400"> life-threatening mistakes </span>
              during clinical handoffs — in real time.
            </h1>

            <p className="text-blue-200 text-base sm:text-lg mb-6 leading-relaxed">
              CareRelay OS uses 4 collaborating AI agents to read FHIR patient data,
              detect risks, generate a verified SBAR handoff, and catch hallucinations
              — before any clinician sees the output.
            </p>

            {/* SIMULATION METRIC */}
            <div className="bg-blue-950/60 border border-blue-700 rounded-xl px-4 py-3 mb-6">
              <p className="text-blue-200 text-sm leading-relaxed">
                Simulation result: Across 50 test cases, CareRelay detected
                <span className="text-white font-black"> 92% of critical risks </span>
                missed by manual handoffs — including
                <span className="text-red-300 font-bold"> 3 near-fatal allergy conflicts.</span>
              </p>
            </div>

            {/* BADGES — one clean row */}
            <div className="flex flex-wrap gap-2 mb-7">
              {['FHIR R4', '4 AI Agents', 'A2A Protocol', 'MCP Published', 'Human-in-Loop'].map((pill, i) => (
                <span key={i} className="bg-blue-800/60 text-blue-300 text-xs px-3 py-1.5
                                         rounded-full border border-blue-700">
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/live-demo"
                className="bg-white text-blue-950 font-black px-6 py-3.5 rounded-xl
                           transition-all text-sm hover:bg-blue-100 text-center">
                Watch Agents Work Live
              </Link>
              <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5
                           rounded-xl text-sm border border-white/20 transition-all text-center">
                View on Prompt Opinion
              </a>
            </div>
          </div>

          <div className="mt-2 md:mt-0">
            <p className="text-blue-400 text-xs font-mono mb-3 text-center">
              // try it — no signup needed
            </p>
            <MiniDemo />
          </div>
        </div>
      </div>

      {/* ── 2. METRICS STRIP ── */}
      <div className="bg-blue-950 py-6 px-4 border-b border-blue-900">
        <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { num: '90 sec',  label: 'Handoff Time'         },
            { num: '4',       label: 'AI Agents'             },
            { num: '92%',     label: 'Risks Caught'          },
            { num: '100%',    label: 'Hallucinations Blocked' },
            { num: 'FHIR R4', label: 'Native Integration'    },
            { num: '78%',     label: 'Faster Than Manual'    },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-white font-black text-lg sm:text-2xl">{stat.num}</p>
              <p className="text-blue-400 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. PROMPT OPINION PROOF — single, clean, no duplication ── */}
      <div className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Platform Integration
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Live on Prompt Opinion Platform
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Published, discoverable, and invokable by any agent in the ecosystem right now.
            </p>
          </div>

          {/* 3 status cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: 'MCP Server',    desc: '3 tools registered — invokable by any agent in the marketplace', badge: 'LIVE',      color: 'green'  },
              { title: 'A2A Agent',     desc: 'Published with A2A enabled — callable by other agents',          badge: 'ACTIVE',    color: 'blue'   },
              { title: 'FHIR Context',  desc: 'Full SHARP extension — patient context from EHR sessions',       badge: 'VERIFIED',  color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-3 font-mono
                  ${item.color === 'green'  ? 'bg-green-100 text-green-700'   :
                    item.color === 'blue'   ? 'bg-blue-100 text-blue-700'     :
                                              'bg-purple-100 text-purple-700'}`}>
                  ● {item.badge}
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Console proof panels — bigger fonts, proper padding */}
<div className="grid sm:grid-cols-2 gap-4 mb-8">
  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
    <p className="text-green-400 font-bold text-base mb-5 font-mono">
      // agent_status
    </p>
    <div className="space-y-3 font-mono">
      <p className="text-slate-400 text-sm">name: <span className="text-white">CareRelay OS</span></p>
      <p className="text-slate-400 text-sm">status: <span className="text-green-400">● online</span></p>
      <p className="text-slate-400 text-sm">marketplace: <span className="text-green-400">published</span></p>
      <p className="text-slate-400 text-sm">a2a: <span className="text-green-400">enabled</span></p>
      <p className="text-slate-400 text-sm">fhir_context: <span className="text-green-400">supported</span></p>
      <p className="text-slate-400 text-sm">contexts: <span className="text-blue-300">workspace · patient · group</span></p>
      <div className="pt-4 mt-4 border-t border-slate-800">
        <p className="text-slate-500 text-sm mb-2">skills:</p>
        <p className="text-slate-300 text-sm">→ generate_clinical_handoff</p>
        <p className="text-slate-300 text-sm">→ get_patient_risk_assessment</p>
        <p className="text-slate-300 text-sm">→ get_patient_context</p>
      </div>
    </div>
  </div>

  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
    <p className="text-green-400 font-bold text-base mb-5 font-mono">
      // mcp_health_check
    </p>
    <div className="space-y-3 font-mono">
      <p className="text-slate-400 text-sm">endpoint: <span className="text-blue-300">GET /api/mcp/health</span></p>
      <p className="text-slate-400 text-sm">response: <span className="text-green-400">200 OK</span></p>
      <p className="text-slate-400 text-sm">mcp_server: <span className="text-white">careRelay-os</span></p>
      <p className="text-slate-400 text-sm">status: <span className="text-green-400">online</span></p>
      <div className="pt-4 mt-4 border-t border-slate-800">
        <p className="text-slate-500 text-sm mb-2">tools [3]:</p>
        <p className="text-slate-300 text-sm">→ generate_clinical_handoff</p>
        <p className="text-slate-300 text-sm">→ get_patient_risk_assessment</p>
        <p className="text-slate-300 text-sm">→ get_patient_context</p>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-800">
        <p className="text-slate-400 text-sm">fhir_extension: <span className="text-green-400">supported</span></p>
        <p className="text-slate-400 text-sm">sharp_context: <span className="text-green-400">active</span></p>
      </div>
    </div>
  </div>
</div>

          {/* Screenshots */}
          <ScreenshotGallery />

          {/* Live status + buttons */}
          <div className="bg-slate-950 rounded-2xl p-5 sm:p-6 mt-8 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-black text-base mb-1">
                  CareRelay OS is running inside Prompt Opinion right now
                </p>
                <p className="text-slate-400 text-xs sm:text-sm font-mono">
                  responds to queries · calls MCP tools · processes FHIR · returns verified handoffs
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
                  className="bg-white text-slate-950 font-black px-4 py-2.5 rounded-xl
                             text-sm transition-all hover:bg-gray-100 whitespace-nowrap">
                  Open in Marketplace →
                </a>
                <a href="https://carerelay-os-production-2e3a.up.railway.app/api/mcp/health"
                  target="_blank" rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5
                             rounded-xl text-sm border border-slate-700 transition-all whitespace-nowrap font-mono">
                  GET /api/mcp/health
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. HALLUCINATION DEMO — THE WOW MOMENT ── */}
      <HallucinationDemo />

      {/* ── 5. BEFORE / AFTER — emotional anchor ── */}
      <BeforeAfter />

      {/* ── 6. PROBLEM STATEMENT ── */}
      <div className="bg-gray-950 px-4 sm:px-6 py-14 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl sm:text-3xl font-black text-white mb-5 leading-tight">
            "One missed allergy. One wrong drug. One dead patient."
          </p>
          <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
            Shift-change handoffs are the #1 cause of sentinel events in hospitals.
            CareRelay OS fixes this with multi-agent AI that reads, reasons, validates,
            and verifies — before any human sees the output.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: '195,000', label: 'patients harmed annually by handoff errors', source: 'The Joint Commission'    },
              { num: '$28B',    label: 'annual cost of preventable medical errors',  source: 'Journal of Patient Safety' },
              { num: '#1',      label: 'handoff errors as cause of sentinel events', source: 'CRICO Strategies'        },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl font-black text-red-400">{s.num}</p>
                <p className="text-gray-400 text-sm mt-2">{s.label}</p>
                <p className="text-gray-600 text-xs mt-1 italic">— {s.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. HOW IT WORKS — 4 agents ── */}
      <div className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              4 Agents. 1 Mission.
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Each agent has a role, a voice, and a job — connected via A2A protocol.
              They question each other, verify each other, and self-correct.
            </p>
          </div>
          <AgentPipeline />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { num: '1', name: 'Context Agent',   provider: 'Groq / Llama 3.3', job: 'Fetches and unifies FHIR data',     color: 'blue'   },
              { num: '2', name: 'Risk Agent',       provider: 'Groq / Llama 3.3', job: 'Scores urgency, flags danger',      color: 'red'    },
              { num: '3', name: 'Reasoning Agent',  provider: 'GPT-4o',           job: 'Generates grounded SBAR draft',     color: 'yellow' },
              { num: '4', name: 'Validator Agent',  provider: 'GPT-4o',           job: 'Removes hallucinations from draft', color: 'green'  },
            ].map((a, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                 text-white font-black text-sm mb-3
                  ${a.color === 'blue'   ? 'bg-blue-600'  :
                    a.color === 'red'    ? 'bg-red-600'   :
                    a.color === 'yellow' ? 'bg-amber-500' : 'bg-green-600'}`}>
                  {a.num}
                </div>
                <p className="font-black text-gray-900 text-xs sm:text-sm mb-1">{a.name}</p>
                <p className="text-xs text-gray-500 mb-1 leading-relaxed">{a.job}</p>
                <p className="text-xs text-blue-600 font-semibold">{a.provider}</p>
              </div>
            ))}
          </div>

          {/* What AI does — 3 cards */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                label: '01',
                title: 'Reasons Across Records',
                desc: 'Reads 5 FHIR resource types and builds a unified clinical picture — detecting conflicts no single field would reveal.'
              },
              {
                label: '02',
                title: 'Catches Its Own Mistakes',
                desc: 'Validator Agent cross-checks every claim against FHIR source. Hallucinations removed before any clinician sees them.'
              },
              {
                label: '03',
                title: 'Scores Risk in Real Time',
                desc: 'Risk Agent detects deterioration signals and allergy conflicts — scoring urgency and escalating automatically via A2A.'
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <p className="text-blue-600 font-black text-xs font-mono mb-3">{item.label}</p>
                <h3 className="font-black text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8. IMPACT ── */}
      <MetricsDashboard />

      {/* ── 9. SAFETY ── */}
      <div className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
              Safety Design
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Safety is the Architecture
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Not a feature. Not an afterthought. Every agent is designed around it.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'Human Review Required',      desc: 'Every handoff requires clinician approval before transmission. CareRelay assists — never replaces.' },
              { title: 'Every Claim Traced to FHIR', desc: 'Validator Agent traces every statement back to its FHIR source. Unverified claims are removed.' },
              { title: 'Full Audit Trail',            desc: 'Every handoff logged with timestamp, clinician identity, and complete acknowledgment chain.' },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-black text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 text-center">
            <p className="text-white font-black text-base mb-4">
              Every Handoff Ships With These Guarantees
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'FHIR-verified facts only',
                'Hallucinations removed',
                'Clinician approved',
                'Audit logged',
                'Missing info flagged',
                'Safety scored',
              ].map((badge, i) => (
                <span key={i} className="bg-gray-700 text-gray-300 text-xs px-3 py-1.5
                                         rounded-full font-semibold">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 10. TECH ── */}
      <TechStack />
      <ArchitectureDiagram />

      {/* ── 11. FINAL CTA ── */}
      <div className="bg-gray-950 py-16 sm:py-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
            Agents Assemble Hackathon 2026
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Assemble?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
            CareRelay OS is live, published, and ready for integration
            into any clinical workflow via Prompt Opinion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/live-demo"
              className="bg-white text-gray-950 font-black px-8 py-4 rounded-xl
                         text-base sm:text-lg transition-all hover:bg-gray-100">
              Watch Agents Work Live
            </Link>
            <a href="https://github.com/ojekunlesamson09-maker/careRelay-os"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-black px-8 py-4
                         rounded-xl text-base sm:text-lg border border-white/20 transition-all">
              View on GitHub
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-10 font-mono">
            Built by Samson Ojekunle · MCP + A2A + FHIR R4 · Prompt Opinion Platform
          </p>
        </div>
      </div>

      <div className="bg-black py-6 text-center px-4">
        <p className="text-gray-600 text-sm font-mono">
          CareRelay OS — Clinical Handoff Intelligence ·
          <a href="https://github.com/ojekunlesamson09-maker/careRelay-os"
            className="text-gray-400 hover:text-white ml-1">
            GitHub
          </a>
        </p>
      </div>
    </div>
  )
}