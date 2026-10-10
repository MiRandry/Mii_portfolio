import IntroSplash from './animations/IntroSplash.jsx'
import ParticleScene from './animations/ParticleScene.jsx'
import PointerEffects from './animations/PointerEffects.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Experience from './components/Experience/Experience.jsx'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Projects from './components/Projects/Projects.jsx'
import Skills from './components/Skills/Skills.jsx'

export default function App() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <ParticleScene />
      <PointerEffects />
      <IntroSplash />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
