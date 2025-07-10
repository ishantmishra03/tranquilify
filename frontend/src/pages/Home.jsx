import { ScrollReveal } from "../components/Main/ScrollReveal";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Main/Hero";
import Features from "../components/Main/Features";
import Testimonials from "../components/Main/Testimonials";
import Screenshots from "../components/Main/Screenshots";
import CTA from "../components/Main/CTA";
import Footer from "../components/Footer/Footer";
import { useAppContext } from '../context/AppContext';

function Home() {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-rose-50'}`}>
      <Navbar />

      <div className="pt-15">
        <Hero />
        <Features />
        <Screenshots />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
