import { skills } from '../../data/skills.js'
import SectionHeading from '../shared/SectionHeading.jsx'

export default function Skills() {
  return (
    <section id="competences" className="relative z-10 bg-paper/75 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Compétences" title="Une boîte à outils Full Stack" description="" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <article key={skill.id} data-spotlight className="spotlight-card interactive-card rounded-3xl border border-line bg-paper/95 p-7">
              <h3 className="text-xl font-semibold">{skill.label}</h3>
              <ul className="mt-6 flex flex-wrap gap-2">
                {skill.items.map((item) => <li key={item} className="rounded-full bg-soft px-3 py-1.5 text-sm text-muted">{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
