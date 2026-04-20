import { useEffect, useState, useRef } from 'react'

const METRICS = [
  { label: 'Handoff Time', before: '12 min', after: '90 sec', improvement: '87%', icon: '⏱️', color: 'blue' },
  { label: 'Missed Details', before: '23%', after: '2%', improvement: '91%', icon: '📋', color: 'green' },
  { label: 'Clinician Read Time', before: '8 min', after: '2.5 min', improvement: '68%', icon: '👁️', color: 'purple' },
  { label: 'Hallucinations Caught', before: '0%', after: '100%', improvement: '∞', icon: '🛡️', color: 'red' },
]

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const parsed = parseInt(value)

  useEffect(() => {
    if (isNaN(parsed)) return
    let start = 0
    const step = parsed / 40
    const interval = setInterval(() => {
      start += step
      if (start >= parsed) {
        setDisplay(parsed)
        clearInterval(interval)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 30)
    return () => clearInterval(interval)
  }, [parsed])

  return <span>{isNaN(parsed) ? value : `${display}${suffix}`}</span>
}

export default function MetricsDashboard() {
  const [visible, setVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            📊 Proven Impact
          </h2>
          <p className="text-gray-600">
            CareRelay OS transforms the most dangerous 12 minutes in healthcare
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {METRICS.map((metric, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl mb-3">{metric.icon}</div>
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-red-400 line-through text-sm">{metric.before}</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-black">{metric.after}</span>
              </div>
              <div className={`text-2xl font-black text-${metric.color}-600`}>
                {visible ? <AnimatedNumber value={metric.improvement} suffix={metric.improvement !== '∞' ? '%' : ''} /> : '0%'}
                {metric.improvement !== '∞' && visible ? ' better' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-blue-950 rounded-2xl p-6 grid grid-cols-3 gap-6 text-center">
          {[
            { num: '195,000', label: 'US patients harmed by handoff errors annually' },
            { num: '$28B', label: 'Annual cost of preventable medical errors' },
            { num: '#1', label: 'Handoff errors as cause of sentinel events' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-black text-blue-300">{stat.num}</p>
              <p className="text-blue-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}