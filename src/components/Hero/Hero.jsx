import { ArrowDownRight, Download, MapPin } from 'lucide-react'
import { useState } from 'react'
import { profile } from '../../data/profile.js'

export default function Hero() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section id="accueil" className="relative z-10 overflow-x-clip bg-paper/75">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:gap-10 lg:px-12 lg:py-8 xl:gap-14">
        <div className="hero-rise min-w-0">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{profile.name}</p>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-4 py-2 text-sm text-muted">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            {profile.title}
          </div>
          <p className="mb-4 flex items-center gap-2 text-sm text-muted"><MapPin size={16} aria-hidden="true" />{profile.location}</p>
          <h1 className="max-w-3xl text-[clamp(2.25rem,4.6vw,4.25rem)] font-medium leading-[0.96] tracking-[-0.05em]">{profile.tagline}</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted lg:text-[1.05rem]">{profile.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <a href="#projets" data-magnetic className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent">Voir mes projets <ArrowDownRight size={17} aria-hidden="true" /></a>
            <a href="#contact" data-magnetic className="inline-flex items-center rounded-full border border-line bg-paper/70 px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent">Me contacter</a>
            <a href={profile.cvUrl} download data-magnetic className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"><Download size={17} aria-hidden="true" />Télécharger mon CV</a>
          </div>
        </div>
        <div data-particle-anchor className="hero-portrait-wrap hero-rise hero-rise-delay mx-auto aspect-square w-full max-w-[390px] lg:-translate-y-2 xl:max-w-[420px]">
          <div className="static-particle-fallback" aria-hidden="true" />
          <div data-tilt className="hero-portrait relative size-full overflow-hidden rounded-full border border-line bg-soft shadow-[0_24px_80px_rgba(23,23,23,0.12)]">
            {imageFailed ? (
              <div className="grid size-full place-items-center text-7xl font-semibold tracking-[-0.1em] text-accent" aria-hidden="true">MNR</div>
            ) : (
              <img
                src={profile.imageUrl}
                alt={`Portrait professionnel de ${profile.name}`}
                className="size-full object-cover object-[50%_32%]"
                fetchPriority="high"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
