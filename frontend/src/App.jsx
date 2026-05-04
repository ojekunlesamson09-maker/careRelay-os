import { Routes, Route } from 'react-router-dom'
import { Component } from 'react'
import Dashboard from './pages/Dashboard'
import HandoffView from './pages/HandoffView'
import LiveDemo from './pages/LiveDemo'
import AuditTrail from './pages/AuditTrail'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-red-700 rounded-xl p-6 max-w-2xl w-full">
            <p className="text-red-400 font-black text-lg mb-3">ERROR CAUGHT:</p>
            <pre className="text-red-300 text-xs bg-slate-950 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/handoff/:patientId" element={<HandoffView />} />
        <Route path="/live-demo" element={
          <ErrorBoundary>
            <LiveDemo />
          </ErrorBoundary>
        } />
        <Route path="/audit" element={<AuditTrail />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
