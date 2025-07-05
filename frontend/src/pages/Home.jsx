import { ScrollReveal } from '../components/Main/ScrollReveal';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Main/Hero';
import Features from '../components/Main/Features';
import Testimonials from '../components/Main/Testimonials';
import Screenshots from '../components/Main/Screenshots';
import CTA from '../components/Main/CTA';
import Footer from '../components/Footer/Footer';

function Home() {
 


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 font-['Inter']">
      <Navbar />

      <Hero />

      <Features />
      
      <Screenshots />
      
      <Testimonials />

      <CTA />

      <Footer /> 
    </div>
  );
}

export default Home;