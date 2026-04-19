import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HandoffView from './pages/HandoffView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/handoff/:patientId" element={<HandoffView />} />
    </Routes>
  )
}

export default App