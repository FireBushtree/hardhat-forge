interface NumberBadgeProps {
  number: number | string
  variant?: 'purple' | 'blue' | 'green' | 'orange'
  prefix?: string
}

export default function NumberBadge({
  number,
  variant = 'purple',
  prefix = '#'
}: NumberBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20',
          border: 'border-blue-400/30',
          text: 'text-blue-400'
        }
      case 'green':
        return {
          bg: 'bg-gradient-to-r from-green-400/20 to-emerald-400/20',
          border: 'border-green-400/30',
          text: 'text-green-400'
        }
      case 'orange':
        return {
          bg: 'bg-gradient-to-r from-orange-400/20 to-amber-400/20',
          border: 'border-orange-400/30',
          text: 'text-orange-400'
        }
      default: // purple
        return {
          bg: 'bg-gradient-to-r from-purple-400/20 to-pink-400/20',
          border: 'border-purple-400/30',
          text: 'text-purple-400'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      className={`w-12 h-12 ${styles.bg} rounded-xl flex items-center justify-center border ${styles.border}`}
    >
      <span className={`${styles.text} font-bold`}>
        {prefix}{number}
      </span>
    </div>
  )
}