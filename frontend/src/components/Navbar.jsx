import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: '🏥 Dashboard' },
    { path: '/live-demo', label: '⚡ Live Demo' },
    { path: '/audit', label: '📋 Audit Trail' },
  ]

  return (
    <nav className="bg-blue-950 border-b border-blue-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black text-white">
          🏥 CareRelay <span className="text-blue-300">OS</span>
        </span>
        <span className="text-xs text-blue-400 hidden md:block">
          Clinical Handoff Intelligence Network
        </span>
      </div>

      <div className="flex items-center gap-2">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${location.pathname === link.path
                ? 'bg-blue-500 text-white'
                : 'text-blue-300 hover:bg-blue-800 hover:text-white'
              }`}
          >
            {link.label}
          </Link>
        ))}
        <span className="ml-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
          ● 4 Agents Live
        </span>
      </div>
    </nav>
  )
}