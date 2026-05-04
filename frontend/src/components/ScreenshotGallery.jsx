import { useState } from 'react'

const SHOTS = [
  { src: '/screenshots/mcp-server.png',    label: '🔌 MCP Server Published',  desc: 'CareRelay OS listed in Marketplace MCP Servers' },
  { src: '/screenshots/agent-listing.png', label: '🤝 A2A Agent Published',    desc: 'Published · A2A Enabled · Workspace, Patient, Group' },
  { src: '/screenshots/live-demo.png',     label: '⚡ Agent Running Live',      desc: 'CareRelay OS generating clinical handoff inside platform' },
]

export default function ScreenshotGallery() {
  const [active, setActive] = useState(null)

  return (
    <>
      <div className="mb-6">
        <p className="text-center text-gray-500 text-sm font-semibold mb-4">
          📸 Real screenshots from Prompt Opinion Platform — click to expand
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {SHOTS.map((shot, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="bg-gray-950 rounded-xl overflow-hidden border border-gray-700
                         hover:border-blue-400 hover:scale-105 transition-all duration-200
                         text-left group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={shot.src}
                  alt={shot.label}
                  className="w-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-white font-black text-sm bg-blue-600 px-3 py-1 rounded-lg">
                    🔍 Click to expand
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white font-black text-xs">{shot.label}</p>
                <p className="text-gray-400 text-xs mt-1">{shot.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 text-white font-black text-lg hover:text-blue-300"
            >
              ✕ Close
            </button>

            {/* Image */}
            <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-700">
              <img
                src={SHOTS[active].src}
                alt={SHOTS[active].label}
                className="w-full object-contain max-h-[70vh]"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-black">{SHOTS[active].label}</p>
                  <p className="text-gray-400 text-sm mt-1">{SHOTS[active].desc}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 text-sm">{active + 1} / {SHOTS.length}</span>
                </div>
              </div>
            </div>

            {/* Prev / Next */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setActive(a => (a - 1 + SHOTS.length) % SHOTS.length)}
                className="bg-white/20 hover:bg-white/30 text-white font-bold
                           px-5 py-2 rounded-xl transition-all text-sm"
              >
                ← Previous
              </button>
              <button
                onClick={() => setActive(a => (a + 1) % SHOTS.length)}
                className="bg-white/20 hover:bg-white/30 text-white font-bold
                           px-5 py-2 rounded-xl transition-all text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}