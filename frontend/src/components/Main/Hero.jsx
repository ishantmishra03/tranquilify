import { useEffect, useState } from "react";
import { ScrollReveal } from "../Main/ScrollReveal";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from '../../context/AppContext';

const Hero = () => {
  const { isAuthenticated } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingElement = ({ delay, duration, children, className = "" }) => (
    <div
      className={`absolute opacity-20 animate-pulse ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(14, 165, 233, 0.15) 0%, 
            rgba(16, 185, 129, 0.15) 25%, 
            rgba(6, 182, 212, 0.1) 50%, 
            transparent 70%)`
        }}
      />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'drift 20s linear infinite'
          }}
        />
      </div>

      {/* Floating Elements */}
      <FloatingElement delay={0} duration={6} className="top-1/4 left-1/4">
        <div className="w-3 h-3 bg-sky-400 rounded-full blur-sm" />
      </FloatingElement>
      <FloatingElement delay={2} duration={8} className="top-1/3 right-1/4">
        <div className="w-2 h-2 bg-emerald-400 rounded-full blur-sm" />
      </FloatingElement>
      <FloatingElement delay={4} duration={10} className="bottom-1/3 left-1/3">
        <div className="w-4 h-4 bg-cyan-400 rounded-full blur-sm" />
      </FloatingElement>
      <FloatingElement delay={1} duration={7} className="top-2/3 right-1/3">
        <div className="w-2.5 h-2.5 bg-teal-400 rounded-full blur-sm" />
      </FloatingElement>

      {/* Main Content */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Animated Icon */}
            <ScrollReveal direction="fade" delay={200}>
              <div className="relative mb-8">
                <div className="text-7xl md:text-8xl mb-6 relative inline-block group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-150" />
                  <span className="relative z-10 animate-float">🌿</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Main Heading with Enhanced Typography */}
            <ScrollReveal direction="up" delay={400}>
              <div className="relative mb-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-6 leading-none tracking-tight">
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent blur-sm opacity-50" />
                    <span className="relative bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent animate-gradient-shift">
                      Tranquilify
                    </span>
                  </span>
                </h1>
                {/* Decorative Underline */}
                <div className="flex justify-center">
                  <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
            </ScrollReveal>

            {/* Subtitle with Enhanced Styling */}
            <ScrollReveal direction="up" delay={600}>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
                Monitor your health insights, manage stress, and build a{' '}
                <span className="font-semibold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  sustainable, healthier
                </span>
                , more balanced life.
              </p>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={800}>
              <div className="relative max-w-3xl mx-auto mb-12">
                <p className="text-gray-600 text-lg sm:text-xl leading-relaxed font-light">
                  Tranquilify integrates emotional tracking, habit-building, stress insights, and AI-powered tools into one seamless experience—designed to support your mental wellness journey with{' '}
                  <span className="text-sky-600 font-medium">clarity</span> and{' '}
                  <span className="text-emerald-600 font-medium">care</span>.
                </p>
              </div>
            </ScrollReveal>

            {/* Enhanced CTA Buttons */}
            <ScrollReveal direction="up" delay={1000}>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
                {!isAuthenticated ? (
                  <Link
                    to="/auth"
                    className="group relative bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                      Get Started Free
                      <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-400 blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 scale-105" />
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="group relative bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                      Enter Dashboard
                      <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-400 blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 scale-105" />
                  </Link>
                )}
                
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/auth')}
                    className="group relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-10 py-5 rounded-2xl text-lg font-semibold hover:border-sky-300 hover:bg-sky-50/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Sign In to Continue</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-emerald-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-2xl" />
                  </button>
                )}
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <ScrollReveal direction="up" delay={1200}>
              <div className="mt-16 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  <span>Science-Based Methods</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;