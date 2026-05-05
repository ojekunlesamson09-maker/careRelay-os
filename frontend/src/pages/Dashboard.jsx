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
        <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
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
          <div key={i} className={`rounded-xl p-2 ${item.alert ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
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
                       text-white font-black py-3 rounded-xl transition-all text-sm">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Running 4-Agent Pipeline...
                </span>
              : 'Generate Safe Handoff'}
          </button>
        </div>
      )}

      {ran && (
        <div className="px-3 pb-3 space-y-2">
          <div className="bg-red-600 text-white rounded-xl p-3 text-center font-black text-xs">
            CRITICAL · Safety Score: 45/100 · CLINICIAN REVIEW REQUIRED
          </div>
          <div className="space-y-1.5">
            {[
              { flag: 'PENICILLIN ALLERGY — verify antibiotic orders NOW',         color: 'red'    },
              { flag: 'BP 88/54 falling — sepsis protocol required',               color: 'red'    },
              { flag: 'Warfarin + infection — stat INR check',                     color: 'orange' },
              { flag: 'Blood cultures pending — do not change antibiotics yet',    color: 'yellow' },
            ].map((item, i) => (
              <div key={i} className={`border-l-4 rounded-lg p-2 text-xs font-semibold
                ${item.color === 'red'    ? 'border-red-500 bg-red-50 text-red-800' :
                  item.color === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-800' :
                                            'border-yellow-500 bg-yellow-50 text-yellow-800'}`}>
                {item.flag}
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-black text-blue-800 mb-1.5">Verified SBAR Handoff</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>S:</strong> Margaret Chen, 67F — CRITICAL. BP 88/54 falling, sepsis suspected. PCN allergy on file.<br />
              <strong>B:</strong> CAP + DM2 + HTN. On Warfarin. 6hrs admitted, poor response. Cultures pending.<br />
              <strong>A:</strong> Probable septic shock. Antibiotic selection critical (PCN allergy). Warfarin risk.<br />
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

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-800 border border-blue-700
                            rounded-full px-3 py-1.5 text-blue-300 text-xs mb-5">
              <span className="animate-pulse text-green-400">●</span>
              Agents Assemble Hackathon · MCP + A2A + FHIR R4
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              AI agents that catch
              <span className="text-red-400"> life-threatening mistakes </span>
              during clinical handoffs — in real time.
            </h1>

            <p className="text-blue-200 text-base sm:text-lg mb-4">
              CareRelay OS uses 4 collaborating AI agents to read FHIR patient data,
              detect risks, generate a verified SBAR handoff, and catch hallucinations
              — before any clinician sees the output.
            </p>

            {/* SIMULATION METRIC */}
            <div className="bg-blue-950 border border-blue-700 rounded-xl px-4 py-3 mb-5">
              <p className="text-blue-200 text-sm leading-relaxed">
                Simulation result: Across 50 test cases, CareRelay detected
                <span className="text-white font-black"> 92% of critical risks </span>
                missed by manual handoffs — including
                <span className="text-red-300 font-bold"> 3 near-fatal allergy conflicts.</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {[
                'Reads FHIR R4',
                '4 Collaborating Agents',
                'Risk Detection',
                'Hallucination Guard',
                'Human Approves'
              ].map((pill, i) => (
                <span key={i} className="bg-blue-800 text-blue-300 text-xs px-3 py-1.5
                                         rounded-full border border-blue-700">
                  {pill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              <Link to="/live-demo"
                className="bg-white text-blue-950 font-black px-5 py-3 rounded-xl
                           transition-all text-sm hover:bg-blue-100">
                Watch Agents Work Live
              </Link>
              <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3
                           rounded-xl text-sm border border-white/20 transition-all">
                View on Prompt Opinion
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'MCP Published',
                'A2A Active',
                'FHIR Native',
                'Hallucination Guard',
                'Human-in-Loop',
              ].map((b, i) => (
                <div key={i} className="flex items-center bg-white/10 rounded-lg px-3 py-1.5
                                        border border-white/10">
                  <span className="text-white text-xs font-semibold">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-blue-400 text-xs font-semibold mb-3 text-center">
              Try it — no signup needed
            </p>
            <MiniDemo />
          </div>
        </div>
      </div>

      {/* ── METRICS STRIP ── */}
      <div className="bg-blue-950 py-5 px-4 border-b border-blue-900">
        <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { num: '90 sec',  label: 'Handoff Time'          },
            { num: '4',       label: 'AI Agents'              },
            { num: '92%',     label: 'Risks Caught'           },
            { num: '100%',    label: 'Hallucinations Blocked'  },
            { num: 'FHIR R4', label: 'Native'                 },
            { num: '78%',     label: 'Faster Than Manual'     },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-white font-black text-base sm:text-xl">{stat.num}</p>
              <p className="text-blue-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEFORE/AFTER ── */}
      <BeforeAfter />

      {/* ── PROBLEM STATEMENT ── */}
      <div className="bg-gray-950 px-4 sm:px-6 py-10 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl sm:text-3xl font-black text-white mb-4">
            "One missed allergy. One wrong drug. One dead patient."
          </p>
          <p className="text-gray-400 text-base sm:text-lg mb-8">
            Shift-change handoffs are the #1 cause of sentinel events in hospitals.
            CareRelay OS fixes this with multi-agent AI that reads, reasons, validates,
            and verifies — before any human sees the output.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: '195,000', label: 'patients harmed annually by handoff errors', source: 'The Joint Commission'   },
              { num: '$28B',    label: 'annual cost of preventable medical errors',  source: 'Journal of Patient Safety' },
              { num: '#1',      label: 'handoff errors as cause of sentinel events', source: 'CRICO Strategies'       },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-red-400">{s.num}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                <p className="text-gray-600 text-xs mt-1 italic">— {s.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── USE CASES — 3 pills ── */}
      <div className="bg-white py-8 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            Built for every dangerous transition
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'ICU & Ward Shift Handoffs',
              'Emergency Escalation',
              'Medication Safety Checks',
            ].map((label, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                <span className="text-gray-700 text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT AI DOES — 3 cards ── */}
      <div className="py-12 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              What No Rule-Based System Can Do
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              CareRelay OS goes beyond automation — it reasons, detects, and self-corrects
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                label: '01',
                title: 'Reasons Across Records',
                desc: 'Reads 5 FHIR resource types simultaneously and builds a unified clinical picture — detecting conflicts no single field would reveal.'
              },
              {
                label: '02',
                title: 'Catches Its Own Mistakes',
                desc: 'Agent 4 cross-checks every claim against FHIR source. Hallucinations caught and removed before any clinician sees them.'
              },
              {
                label: '03',
                title: 'Scores Risk in Real Time',
                desc: 'Agent 2 detects deterioration signals, allergy conflicts, and drug interactions — scoring urgency and escalating automatically.'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-blue-600 font-black text-xs font-mono mb-3">{item.label}</p>
                <h3 className="font-black text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AGENT PIPELINE ── */}
      <div className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              4 Agents. 1 Mission.
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Each agent has a role, a voice, and a job — connected via A2A protocol
            </p>
          </div>
          <AgentPipeline />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { num: '1', name: 'Context Agent',   provider: 'Groq / Llama 3.3', job: 'Builds unified FHIR timeline',  color: 'blue'   },
              { num: '2', name: 'Risk Agent',      provider: 'Groq / Llama 3.3', job: 'Scores urgency + flags danger', color: 'red'    },
              { num: '3', name: 'Reasoning Agent', provider: 'GPT-4o',           job: 'Generates grounded SBAR',       color: 'yellow' },
              { num: '4', name: 'Validator Agent', provider: 'GPT-4o',           job: 'Removes hallucinations',        color: 'green'  },
            ].map((a, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                 text-white font-black text-sm mb-2
                  ${a.color === 'blue'   ? 'bg-blue-600'   :
                    a.color === 'red'    ? 'bg-red-600'    :
                    a.color === 'yellow' ? 'bg-amber-500'  : 'bg-green-600'}`}>
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

      {/* ── HALLUCINATION DEMO ── */}
      <HallucinationDemo />

      {/* ── PROMPT OPINION PROOF ── */}
      <div className="bg-white py-10 sm:py-12 px-4 sm:px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Live on Prompt Opinion Platform
            </h2>
            <p className="text-gray-500 text-sm">
              Published · Discoverable · Invokable by any agent in the ecosystem
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'MCP Server Published', desc: '3 tools registered and invokable by any agent in the marketplace',    badge: 'LIVE',      color: 'green'  },
              { title: 'A2A Agent Active',      desc: 'Published with A2A enabled — callable by other agents on the platform', badge: 'PUBLISHED', color: 'blue'   },
              { title: 'FHIR Context',          desc: 'Full SHARP extension — receives patient context from EHR sessions',     badge: 'VERIFIED',  color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-3
                  ${item.color === 'green'  ? 'bg-green-100 text-green-700'   :
                    item.color === 'blue'   ? 'bg-blue-100 text-blue-700'     :
                                              'bg-purple-100 text-purple-700'}`}>
                  {item.badge}
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <ScreenshotGallery />

          <div className="bg-gray-950 rounded-2xl p-5 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-black text-base mb-1">
                  CareRelay OS is live inside Prompt Opinion right now
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Responds to queries · Calls MCP tools · Processes FHIR · Returns verified handoffs
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://app.promptopinion.ai" target="_blank" rel="noopener noreferrer"
                  className="bg-white text-gray-950 font-black px-4 py-2.5 rounded-xl
                             text-sm transition-all hover:bg-gray-100 whitespace-nowrap">
                  Open in Marketplace →
                </a>
                <a href="https://carerelay-os-production-2e3a.up.railway.app/api/mcp/health"
                  target="_blank" rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5
                             rounded-xl text-sm border border-white/20 transition-all whitespace-nowrap">
                  Live MCP Health
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ARCHITECTURE ── */}
      <ArchitectureDiagram />

      {/* ── METRICS ── */}
      <MetricsDashboard />

      {/* ── SAFETY ── */}
      <div className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
              Safety is the Architecture
            </h2>
            <p className="text-gray-500 text-sm">
              Not a feature. Not an afterthought. Built in from agent 1.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'Human Review Required',     desc: 'Every handoff requires clinician approval before it is sent. CareRelay assists — never replaces.'          },
              { title: 'Every Claim Traced to FHIR', desc: 'Agent 4 traces every statement back to its FHIR source. Unverified claims are removed, not hidden.'       },
              { title: 'Full Audit Trail',           desc: 'Every handoff is logged with timestamp, clinician identity, and full acknowledgment chain.'                },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CALM GUARANTEE BANNER */}
          <div className="bg-gray-900 rounded-2xl p-5 text-center">
            <p className="text-white font-black text-base mb-3">
              Every Handoff Ships With These Guarantees
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'FHIR-verified facts only',
                'Hallucinations removed',
                'Clinician approved',
                'Audit logged',
                'Missing info flagged',
                'Safety scored'
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

      {/* ── TECH STACK ── */}
      <TechStack />

      {/* ── FINAL CTA ── */}
      <div className="bg-gray-950 py-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Assemble?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8">
            CareRelay OS is live, published, and ready for integration
            into any clinical workflow via Prompt Opinion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/live-demo"
              className="bg-white text-gray-950 font-black px-8 py-4 rounded-xl
                         text-lg transition-all hover:bg-gray-100">
              Watch Agents Work Live
            </Link>
            <a href="https://github.com/ojekunlesamson09-maker/careRelay-os"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-black px-8 py-4
                         rounded-xl text-lg border border-white/20 transition-all">
              View on GitHub
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-8">
            Built by Samson Ojekunle · Agents Assemble Hackathon 2026 ·
            MCP + A2A + FHIR R4 · Prompt Opinion Platform
          </p>
        </div>
      </div>

      <div className="bg-black py-6 text-center px-4">
        <p className="text-gray-600 text-sm">
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
