import '../styles/landing.css'
import Footer from '../components/landing/Footer.jsx'
import Header from '../components/landing/Header.jsx'
import Hero from '../components/landing/Hero.jsx'
import Student from '../components/landing/Student.jsx'
import Company from '../components/landing/Company.jsx'
import Service from '../components/landing/Service.jsx'
import Testimony from '../components/landing/Testimony.jsx'
import Last from '../components/landing/Last.jsx'

function App() {
  return (
    <>
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
    </>
  )
}

export default App
