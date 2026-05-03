import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { path: '/', label: '🏥 Dashboard' },
    { path: '/live-demo', label: '⚡ Live Demo' },
    { path: '/audit', label: '📋 Audit Trail' },
  ]

  return (
    <nav className="bg-blue-950 border-b border-blue-800 px-4 py-3 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-white">
            🏥 CareRelay <span className="text-blue-300">OS</span>
          </span>
          <span className="text-xs text-blue-400 hidden md:block">
            Clinical Handoff Intelligence Network
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {links.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${location.pathname === link.path
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-300 hover:bg-blue-800 hover:text-white'}`}>
              {link.label}
            </Link>
          ))}
          <span className="ml-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
            ● 4 Agents Live
          </span>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-2">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
            ● Live
          </span>
          <button onClick={() => setOpen(o => !o)}
            className="text-white p-2 rounded-lg hover:bg-blue-800 transition-all">
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden mt-3 border-t border-blue-800 pt-3 flex flex-col gap-1">
          {links.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all
                ${location.pathname === link.path
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-300 hover:bg-blue-800 hover:text-white'}`}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}