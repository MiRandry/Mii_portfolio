import { CodeXml, ExternalLink, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { projectCategories, projects } from '../../data/projects.js'
import SectionHeading from '../shared/SectionHeading.jsx'

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const visibleProjects = activeCategory === 'Tous' ? projects : projects.filter(({ category }) => category === activeCategory)

  return (
    <section id="projets" className="relative z-10 bg-paper/75 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Projets" title="Solutions métier sélectionnées" description="Présentations anonymisées. Aucun écran, lien privé ou donnée interne n’est publié." />
        <div className="mb-10 flex flex-wrap gap-2" aria-label="Filtrer les projets">
          {projectCategories.map((category) => (
            <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className="rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper">{category}</button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{visibleProjects.length} projet{visibleProjects.length > 1 ? 's' : ''} affiché{visibleProjects.length > 1 ? 's' : ''}</p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <article key={project.id} data-spotlight className="spotlight-card interactive-card group overflow-hidden rounded-3xl border border-line bg-paper/95">
              <img src={project.image} alt={project.imageAlt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="p-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{project.category}</p>
                  {project.confidential && <LockKeyhole size={16} aria-label="Projet confidentiel présenté de manière anonymisée" />}
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{project.title}</h3>
                <p className="mt-4 leading-7 text-muted">{project.summary}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted">{project.details.map((detail) => <li key={detail}>— {detail}</li>)}</ul>
                <ul className="mt-6 flex flex-wrap gap-2">{project.technologies.map((technology) => <li key={technology} className="rounded-full border border-line px-3 py-1 text-xs">{technology}</li>)}</ul>
                {(project.demoUrl || project.sourceUrl) && <div className="mt-6 flex gap-4">{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" />Démo</a>}{project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><CodeXml aria-hidden="true" />Code</a>}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
