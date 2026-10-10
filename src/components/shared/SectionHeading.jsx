export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <header className="mb-12 max-w-3xl lg:mb-16">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
      <h2 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>}
    </header>
  )
}
