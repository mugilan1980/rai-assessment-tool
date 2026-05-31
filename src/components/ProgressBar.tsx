interface ProgressBarProps {
  currentSection: number
  totalSections: number
}

export default function ProgressBar({ currentSection, totalSections }: ProgressBarProps) {
  const percentage = (currentSection / totalSections) * 100

  return (
    <div className="w-full">
      <p className="text-sm font-semibold mb-2" style={{ color: '#1B2D5B' }}>
        Section {currentSection} of {totalSections}
      </p>
      <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
        <div
          className="h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: '#00A79D' }}
        />
      </div>
    </div>
  )
}
