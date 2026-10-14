import '../styles/landing.css'
import { useEffect, useRef } from 'react'
import Footer from '../components/landing/Footer.jsx'
import Header from '../components/landing/Header.jsx'
import Hero from '../components/landing/Hero.jsx'
import Student from '../components/landing/Student.jsx'
import Company from '../components/landing/Company.jsx'
import Service from '../components/landing/Service.jsx'
import Testimony from '../components/landing/Testimony.jsx'
import Last from '../components/landing/Last.jsx'

function App() {
  const landingRef = useRef(null)

  useEffect(() => {
    const landing = landingRef.current
    const header = landing.querySelector('.site-header')
    const observer = new ResizeObserver(() => {
      landing.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page" ref={landingRef}>
    <Header />
    <main>
        <Hero />
        <Student />
        <Company />
        <Service />
        <Testimony />
        <Last />
    </main>
    <Footer />
    </div>
  )
}

export default App

