import { Award } from 'lucide-react'
import { certifications, education, experiences } from '../../data/experiences.js'
import SectionHeading from '../shared/SectionHeading.jsx'

export default function Experience() {
  return (
    <section id="parcours" className="relative z-10 bg-soft/75 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Parcours" title="Expériences, formation et certifications" description="Un parcours orienté génie logiciel, applications métiers et traitement des données." />
        <div className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h3 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em]">Expériences</h3>
            <div className="border-l border-line">
              {experiences.map((experience) => (
                <article key={experience.id} className="relative pb-12 pl-8 last:pb-0">
                  <span className="absolute -left-1.5 top-2 size-3 rounded-full border-2 border-soft bg-accent" aria-hidden="true" />
                  <p className="text-sm text-muted">{experience.period}</p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{experience.role}</h4>
                  <p className="mt-1 font-medium">{experience.organization}</p>
                  <p className="mt-4 leading-7 text-muted">{experience.summary}</p>
                  {experience.highlights.length > 0 && <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">{experience.highlights.map((item) => <li key={item} className="before:mr-2 before:text-accent before:content-['—']">{item}</li>)}</ul>}
                </article>
              ))}
            </div>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em]">Formation</h3>
              <div className="space-y-5">
                {education.map((item) => (
                  <article key={item.id} data-spotlight className="spotlight-card interactive-card rounded-3xl border border-line bg-paper p-6">
                    <p className="text-sm text-accent">{item.period}</p>
                    <h4 className="mt-3 text-lg font-semibold">{item.degree}</h4>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.school}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em]">Certifications</h3>
              <ul className="space-y-4">
                {certifications.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-2xl border border-line bg-paper p-5">
                    <Award className="mt-0.5 shrink-0 text-accent" size={18} aria-hidden="true" />
                    <span><span className="block font-medium">{item.title}</span><span className="mt-1 block text-sm text-muted">{item.period}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
