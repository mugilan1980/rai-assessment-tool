interface ScoreButtonProps {
  value: 1 | 2 | 3 | 4
  label: string
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}

export default function ScoreButton({ value, label, isSelected, onClick, disabled }: ScoreButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="flex flex-col items-center justify-center px-3 py-4 rounded-lg border-2 transition-colors w-full focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: isSelected ? '#1B2D5B' : '#ffffff',
        borderColor: isSelected ? '#1B2D5B' : '#CBD5E1',
        color: isSelected ? '#ffffff' : '#1e293b',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isSelected && !disabled) {
          e.currentTarget.style.borderColor = '#1B2D5B'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !disabled) {
          e.currentTarget.style.borderColor = '#CBD5E1'
        }
      }}
    >
      <span className="text-lg font-bold leading-none mb-1">{value}</span>
      <span className="text-xs text-center leading-tight">{label}</span>
    </button>
  )
}
