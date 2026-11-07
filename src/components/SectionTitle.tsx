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
        <p
          className={`flex items-center gap-3 text-xs font-bold tracking-widest uppercase ${
            center ? 'justify-center' : ''
          } ${claro ? 'text-brand-500' : 'text-brand-700'}`}
        >
          <span className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-4 text-3xl sm:text-4xl ${claro ? 'text-white' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${claro ? 'text-white/75' : 'text-ink/70'}`}>{subtitle}</p>
      )}
    </div>
  )
}