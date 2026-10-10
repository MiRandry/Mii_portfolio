import { profile } from '../../data/profile.js'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© {currentYear} {profile.name}</p>
        <a href="#accueil" className="font-medium text-ink transition-colors hover:text-accent">Retour en haut</a>
      </div>
    </footer>
  )
}
