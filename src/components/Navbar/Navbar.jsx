import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const links = [
  ['accueil', 'Accueil'],
  ['a-propos', 'À propos'],
  ['competences', 'Compétences'],
  ['parcours', 'Parcours'],
  ['projets', 'Projets'],
  ['contact', 'Contact'],
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('accueil')
  const triggerRef = useRef(null)

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key !== 'Escape' || !isOpen) return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    links.forEach(([id]) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  function followLink() {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <nav aria-label="Navigation principale" className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#accueil" className="text-xl font-semibold tracking-[-0.06em]" onClick={followLink}>MNR</a>
        <button
          ref={triggerRef}
          type="button"
          className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
          aria-expanded={isOpen}
          aria-controls="navigation-menu"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <ul
          id="navigation-menu"
          className={`${isOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-20 flex-col border-b border-line bg-paper px-5 py-5 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {links.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={followLink}
                aria-current={activeSection === id ? 'page' : undefined}
                className="nav-link block border-l-2 border-transparent px-4 py-3 text-sm text-muted hover:text-ink aria-[current=page]:border-accent aria-[current=page]:font-semibold aria-[current=page]:text-ink lg:border-l-0 lg:py-2"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
