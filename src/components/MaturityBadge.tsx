interface MaturityBadgeProps {
  label: string
  level?: number
  variant: 'governance' | 'workforce' | 'overall' | 'profile'
}

const variantStyles: Record<MaturityBadgeProps['variant'], string> = {
  governance: 'bg-[#1B2D5B] text-white',
  workforce: 'bg-[#00A79D] text-white',
  overall: 'bg-gray-700 text-white',
  profile: 'bg-gray-100 text-gray-800 border border-gray-300',
}

export default function MaturityBadge({ label, level, variant }: MaturityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${variantStyles[variant]}`}
    >
      {label}
      {level !== undefined && (
        <sub className="text-xs opacity-80 leading-none">Level {level}</sub>
      )}
    </span>
  )
}
