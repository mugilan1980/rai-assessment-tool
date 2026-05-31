import { useState } from 'react'
import { INDUSTRIES, COMPANY_SIZES, type OrgProfile } from '../data/assessment'
import Header from './Header'

interface WelcomeScreenProps {
  onBegin: (profile: OrgProfile) => void
}

export default function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  const [orgName, setOrgName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')

  const isReady = orgName.trim() !== '' && industry !== '' && companySize !== ''

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isReady) return
    onBegin({
      orgName: orgName.trim(),
      industry,
      companySize,
      respondentName: '',
      respondentRole: '',
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Header showFull />

      <p className="text-center mb-8" style={{ color: '#475569' }}>
        This 49-question assessment helps your organisation benchmark AI governance maturity and
        workforce adoption quality across seven dimensions, aligned with IMDA's frameworks and
        Singapore's National AI Strategy.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { value: '7', label: 'Sections' },
          { value: '49', label: 'Questions' },
          { value: '~20', label: 'Minutes' },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="text-center py-5 px-3 rounded-xl border bg-white"
            style={{ borderColor: '#cbd5e1' }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: '#1B2D5B' }}>
              {value}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: '#64748b' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#e2e8f0' }}>
        <h2 className="text-lg font-semibold mb-6" style={{ color: '#1B2D5B' }}>
          Tell us about your organisation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="orgName"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#334155' }}
            >
              Organisation name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="orgName"
              type="text"
              required
              placeholder="e.g., Acme Corp"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={{
                borderColor: '#cbd5e1',
                color: '#1e293b',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1B2D5B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#334155' }}
            >
              Industry <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="industry"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors appearance-none bg-white"
              style={{
                borderColor: '#cbd5e1',
                color: industry ? '#1e293b' : '#94a3b8',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1B2D5B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            >
              <option value="" disabled>
                Select your industry
              </option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} style={{ color: '#1e293b' }}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="companySize"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#334155' }}
            >
              Company size <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="companySize"
              required
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors appearance-none bg-white"
              style={{
                borderColor: '#cbd5e1',
                color: companySize ? '#1e293b' : '#94a3b8',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1B2D5B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            >
              <option value="" disabled>
                Select company size
              </option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size} style={{ color: '#1e293b' }}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isReady}
              className="w-full py-3 px-6 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{
                backgroundColor: isReady ? '#1B2D5B' : '#94a3b8',
                cursor: isReady ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={(e) => {
                if (isReady) e.currentTarget.style.backgroundColor = '#14223f'
              }}
              onMouseLeave={(e) => {
                if (isReady) e.currentTarget.style.backgroundColor = '#1B2D5B'
              }}
            >
              Begin Assessment
            </button>

            <p className="text-center text-xs mt-3" style={{ color: '#94a3b8' }}>
              Your responses are confidential. Anonymous data may be stored for analytics.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
