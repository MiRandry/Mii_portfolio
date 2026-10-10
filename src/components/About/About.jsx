import { Blocks, Database, Download, FileOutput, Workflow } from 'lucide-react'
import { profile } from '../../data/profile.js'
import SectionHeading from '../shared/SectionHeading.jsx'

const expertise = [
  [Blocks, 'Applications métier', 'Interfaces et fonctionnalités centrées sur les usages réels.'],
  [Workflow, 'Workflows', 'Circuits de validation, rôles, notifications et traçabilité.'],
  [Database, 'Données', 'Modélisation, requêtes SQL, historisation et optimisation.'],
  [FileOutput, 'Reporting', 'Valorisation des données, tableaux de bord et flux automatisés.'],
]

export default function About() {
  return (
    <section id="a-propos" className="relative z-10 bg-soft/75 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="À propos" title="De l’analyse du besoin à la solution livrée" description="Une pratique Full Stack qui relie développement, règles métier, données et amélioration continue." />
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 text-lg leading-8 text-muted">
            <p>Je développe et fais évoluer des applications qui simplifient les processus internes, structurent l’information et réduisent les tâches manuelles.</p>
            <p>Mon travail couvre le Front-End, le Back-End, les API REST, les bases de données, le reporting et l’automatisation de workflows.</p>
            <a href={profile.cvUrl} download data-magnetic className="inline-flex w-fit items-center gap-2 border-b border-ink pb-1 font-semibold text-ink transition-colors hover:border-accent hover:text-accent">
              <Download aria-hidden="true" size={18} />Télécharger mon CV
            </a>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {expertise.map(([Icon, title, text]) => (
              <article key={title} data-spotlight className="spotlight-card bg-paper p-7">
                <Icon className="mb-8 text-accent" size={24} aria-hidden="true" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
