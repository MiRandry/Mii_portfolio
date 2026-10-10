import { CodeXml, Mail, MapPin, Network, Phone } from 'lucide-react'
import { profile } from '../../data/profile.js'
import { isPlaceholder } from '../../utils/contact.js'
import SectionHeading from '../shared/SectionHeading.jsx'

export function ContactValue({ label, value, href, icon: Icon, external = false }) {
  const content = <><Icon size={20} className="text-accent" aria-hidden="true" /><span><span className="block text-xs uppercase tracking-[0.16em] text-muted">{label}</span><span className="mt-1 block font-medium">{value}</span></span></>
  const className = 'interactive-card flex items-start gap-4 rounded-2xl border border-line bg-paper p-5'

  if (isPlaceholder(value)) return <span aria-disabled="true" className={`${className} cursor-not-allowed text-muted`}>{content}</span>
  return <a href={href} className={className} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{content}</a>
}

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 bg-soft/75 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Contact" title="Parlons de votre prochain projet" description="Disponible pour échanger autour du développement Full Stack, des applications métiers et de la transformation numérique." />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper p-5"><MapPin size={20} className="text-accent" aria-hidden="true" /><span><span className="block text-xs uppercase tracking-[0.16em] text-muted">Localisation</span><span className="mt-1 block font-medium">{profile.location}</span></span></div>
          <ContactValue label="Téléphone" value={profile.phone} href={`tel:${profile.phone}`} icon={Phone} />
          <ContactValue label="E-mail" value={profile.email} href={`mailto:${profile.email}`} icon={Mail} />
          <ContactValue label="LinkedIn" value="linkedin.com/in/miranto-nantenaina-randry-68a431208" href={profile.linkedinUrl} icon={Network} external />
          <ContactValue label="GitHub" value="github.com/MiRandry" href={profile.githubUrl} icon={CodeXml} external />
        </div>
      </div>
    </section>
  )
}
