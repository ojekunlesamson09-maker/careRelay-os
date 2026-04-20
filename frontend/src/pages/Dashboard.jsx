import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MetricsDashboard from '../components/MetricsDashboard'
import BeforeAfter from '../components/BeforeAfter'
import TechStack from '../components/TechStack'
import AgentPipeline from '../components/AgentPipeline'

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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-800 border border-blue-600
                          rounded-full px-4 py-2 text-blue-300 text-sm mb-6">
            <span className="animate-pulse">●</span>
            Built for Agents Assemble Hackathon · MCP + A2A + FHIR R4
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Prevent Dangerous Patient<br />
            <span className="text-blue-300">Handoff Errors</span>
          </h1>

          <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-10">
            CareRelay OS is a 4-agent clinical intelligence system that transforms
            raw FHIR data into verified, safe handoffs — eliminating the #1 cause
            of medical errors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/live-demo"
              className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-black
                         px-8 py-4 rounded-xl text-lg transition-all"
            >
              ⚡ Try Live Demo
            </Link>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                placeholder="FHIR Patient ID..."
                className="px-4 py-4 rounded-xl text-gray-800 font-medium
                           focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={!patientId}
                className="bg-white/20 hover:bg-white/30 text-white font-bold
                           px-6 py-4 rounded-xl transition-all border border-white/30"
              >
                Generate →
              </button>
            </form>
          </div>

          {/* Agent Pipeline Preview */}
          <div className="max-w-3xl mx-auto">
            <AgentPipeline />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <MetricsDashboard />

      {/* Before / After */}
      <BeforeAfter />

      {/* Tech Stack */}
      <TechStack />

      {/* Story Case */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Meet Margaret Chen
          </h2>
          <p className="text-gray-600 mb-8">
            A real clinical scenario. See how CareRelay OS catches what humans miss.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-left border-l-4 border-red-500">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">👩‍⚕️</div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Margaret Chen, 67F</h3>
                <p className="text-gray-600">Community-acquired pneumonia · Admitted 6 hours ago</p>
              </div>
              <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                CRITICAL
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {[
                { label: 'Vitals', value: 'BP 88/54 ↓ · SpO2 91% · Temp 39.2°C · HR 118', alert: true },
                { label: 'Allergy', value: 'PENICILLIN — anaphylaxis', alert: true },
                { label: 'Medications', value: 'Lisinopril · Metformin · Warfarin', alert: false },
                { label: 'Pending', value: 'Blood cultures · Chest CT · INR', alert: false },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl p-4 ${item.alert ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <p className="text-xs font-bold text-gray-500 mb-1">{item.label}</p>
                  <p className={`font-semibold ${item.alert ? 'text-red-700' : 'text-gray-800'}`}>
                    {item.alert && '⚠️ '}{item.value}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/live-demo"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white
                         font-black py-4 rounded-xl text-center transition-all text-lg"
            >
              🚀 See How CareRelay Handles This Case →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-950 px-6 py-10 text-center">
        <p className="text-white font-black text-xl mb-2">🏥 CareRelay OS</p>
        <p className="text-blue-400 text-sm">
          Built for the Agents Assemble Healthcare AI Hackathon ·
          MCP + A2A + FHIR R4 · Prompt Opinion Platform
        </p>
        <p className="text-blue-500 text-xs mt-2">
          By Samson Ojekunle · 2026
        </p>
      </div>
    </div>
  )
}