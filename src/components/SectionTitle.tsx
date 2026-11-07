interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  claro?: boolean
}

export default function SectionTitle({ eyebrow, title, subtitle, center = false, claro = false }: SectionTitleProps) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
            claro ? 'bg-white/10 text-white ring-1 ring-white/20' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-4 text-3xl sm:text-4xl ${claro ? 'text-white' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${claro ? 'text-white/75' : 'text-ink/70'}`}>{subtitle}</p>
      )}
    </div>
  )
}