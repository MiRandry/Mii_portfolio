import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mail } from 'lucide-react'
import { describe, expect, test } from 'vitest'
import App from '../App.jsx'
import Contact, { ContactValue } from '../components/Contact/Contact.jsx'
import Projects from '../components/Projects/Projects.jsx'

describe('portfolio', () => {
  test('affiche le hero, la photo et les sections principales', () => {
    render(<App />)
    expect(screen.getByText('Je transforme les besoins métiers en expériences numériques claires, fiables et utiles')).toBeInTheDocument()
    expect(screen.getByText('Miranto Nantenaina RANDRY')).toBeInTheDocument()
    expect(screen.getAllByText('Développeuse Full Stack')).toHaveLength(2)
    expect(screen.getByAltText('Portrait professionnel de Miranto Nantenaina RANDRY')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voir mes projets/ })).toHaveAttribute('href', '#projets')
    expect(screen.getByRole('link', { name: 'Me contacter' })).toHaveAttribute('href', '#contact')
    const cvLinks = screen.getAllByRole('link', { name: /Télécharger mon CV/ })
    expect(cvLinks).toHaveLength(2)
    cvLinks.forEach((link) => expect(link).toHaveAttribute('href', '/cv-miranto-nantenaina-randry.pdf'))
    ;['a-propos', 'competences', 'parcours', 'projets', 'contact'].forEach((id) => expect(document.getElementById(id)).toBeInTheDocument())
  })

  test('affiche le fallback MNR si la photo échoue', () => {
    render(<App />)
    fireEvent.error(screen.getByAltText('Portrait professionnel de Miranto Nantenaina RANDRY'))
    expect(screen.queryByAltText('Portrait professionnel de Miranto Nantenaina RANDRY')).not.toBeInTheDocument()
    expect(screen.getAllByText('MNR').length).toBeGreaterThan(1)
  })

  test('menu mobile ouvre puis Escape ferme et rend focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Ouvrir le menu' })
    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Fermer le menu' })).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveFocus()
  })

  test('affiche les compétences et certifications depuis les données', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Front-End' })).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
    expect(screen.getByText('Traitement et valorisation des données avec Microsoft BI')).toBeInTheDocument()
    expect(screen.getByText('120-Hour Professional TEFL')).toBeInTheDocument()
  })

  test('affiche les quatre expériences vérifiées', () => {
    render(<App />)
    expect(screen.getByText('MANAO / SIDINA - Fianarantsoa')).toBeInTheDocument()
    expect(screen.getByText('DIRICKX Madagascar')).toBeInTheDocument()
    expect(screen.getByText('CREAM Madagascar')).toBeInTheDocument()
    expect(screen.getByText('Mars - Juin 2021')).toBeInTheDocument()
  })

  test('filtre projets et restaure tous', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    await user.click(screen.getByRole('button', { name: 'Workflows' }))
    expect(screen.getByText("Circuits d'approbation et gestion documentaire")).toBeInTheDocument()
    expect(screen.queryByText('Reporting automatisé et imports de données')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tous' }))
    expect(screen.getAllByRole('article')).toHaveLength(5)
  })

  test('ne rend aucun lien projet absent', () => {
    render(<Projects />)
    const project = screen.getByText('Gestion intégrée des missions et transports').closest('article')
    expect(within(project).queryByRole('link')).not.toBeInTheDocument()
  })

  test('rend les coordonnées vérifiées comme liens', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /\+291348759531/ })).toHaveAttribute('href', 'tel:+291348759531')
    expect(screen.getByRole('link', { name: /miirandry@gmail.com/ })).toHaveAttribute('href', 'mailto:miirandry@gmail.com')
    expect(screen.getByRole('link', { name: /github.com\/MiRandry/ })).toHaveAttribute('href', 'https://github.com/MiRandry')
  })

  test('conserve la désactivation générique des placeholders', () => {
    render(<ContactValue label="E-mail" value="[E-mail]" href="mailto:[E-mail]" icon={Mail} />)
    expect(screen.getByText('[E-mail]').closest('[aria-disabled="true"]')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /\[E-mail\]/ })).not.toBeInTheDocument()
  })
})
