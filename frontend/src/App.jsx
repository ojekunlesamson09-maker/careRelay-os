import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HandoffView from './pages/HandoffView'
import LiveDemo from './pages/LiveDemo'
import AuditTrail from './pages/AuditTrail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/handoff/:patientId" element={<HandoffView />} />
      <Route path="/live-demo" element={<LiveDemo />} />
      <Route path="/audit" element={<AuditTrail />} />
    </Routes>
  )
}

export default App