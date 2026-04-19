import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import PatientTimeline from '../components/PatientTimeline'
import RiskFlags from '../components/RiskFlags'
import SBARHandoff from '../components/SBARHandoff'
import ValidationReport from '../components/ValidationReport'

const API = 'http://localhost:5000'

export default function HandoffView() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000)
    fetchHandoff()
    return () => clearInterval(timer)
  }, [patientId])

  const fetchHandoff = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.post(`${API}/api/handoff/${patientId}`)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-6 animate-pulse">🏥</div>
        <h2 className="text-2xl font-black mb-2">Running 4-Agent Pipeline</h2>
        <p className="text-blue-300 mb-6">Patient ID: {patientId}</p>
        <div className="space-y-2 text-sm text-blue-200 max-w-sm mx-auto">
          {elapsed >= 0 && <p className={elapsed >= 1 ? 'text-green-400' : ''}>🟦 Agent 1: Fetching FHIR data...</p>}
          {elapsed >= 3 && <p className={elapsed >= 5 ? 'text-green-400' : ''}>🟥 Agent 2: Analyzing risks...</p>}
          {elapsed >= 6 && <p className={elapsed >= 10 ? 'text-green-400' : ''}>🟨 Agent 3: Generating SBAR...</p>}
          {elapsed >= 11 && <p className={elapsed >= 15 ? 'text-green-400' : ''}>🟩 Agent 4: Validating handoff...</p>}
        </div>
        <p className="text-blue-400 mt-6 text-sm">{elapsed}s elapsed...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Pipeline Error</h2>
        <p className="text-red-300 mb-6 max-w-md">{error}</p>
        <button onClick={() => navigate('/')}
          className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')}
            className="text-blue-300 hover:text-white transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-white font-black text-lg">
              🏥 {data?.patient_name || `Patient ${patientId}`}
            </h1>
            <p className="text-blue-300 text-xs">
              ID: {patientId} · {data?.total_duration_ms}ms · CareRelay OS
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            data?.urgency_level === 'CRITICAL' ? 'bg-red-500 text-white' :
            data?.urgency_level === 'HIGH' ? 'bg-orange-500 text-white' :
            data?.urgency_level === 'MEDIUM' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {data?.urgency_level}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            data?.safe_to_handoff ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {data?.safe_to_handoff ? '✅ Safe' : '⚠️ Review'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <PatientTimeline context={data?.context} patientName={data?.patient_name} />
        <RiskFlags risk={data?.risk} />
        <SBARHandoff handoff={data?.handoff} validation={data?.validation} />
        <ValidationReport validation={data?.validation} />

        {/* Pipeline Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Pipeline Execution</h2>
          <div className="space-y-2">
            {data?.pipeline_steps?.map((step, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {step.agent || step.step}
                </span>
                <div className="flex items-center gap-3">
                  {step.provider && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {step.provider}
                    </span>
                  )}
                  <span className="text-sm font-bold text-green-600">{step.duration_ms}ms</span>
                  <span className="text-green-500">✅</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <span className="text-sm text-gray-500">Total: </span>
            <span className="font-black text-blue-700">{data?.total_duration_ms}ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}