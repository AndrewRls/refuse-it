interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
}

export default function SectionTitle({ eyebrow, title, subtitle, center = false }: SectionTitleProps) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink/70">{subtitle}</p>}
    </div>
  )
}