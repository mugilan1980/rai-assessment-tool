function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: '#1B2D5B' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: '#1B2D5B' }}>
            Responsible AI Adoption Assessment
          </h1>

          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: '#00A79D' }}>
            Singapore Organisations
          </p>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Aligned with IMDA MAIGF and WSG GenAI JTM
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center" style={{ borderColor: '#e2e8f0' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#00A79D' }}>
              ✓
            </span>
            <span className="text-lg font-semibold" style={{ color: '#1B2D5B' }}>
              Hello, deployment chain working ✓
            </span>
          </div>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Scaffold deployed — Phase 2 build ready
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            Built with Vite · React · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
