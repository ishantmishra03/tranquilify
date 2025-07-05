import { useEffect, useState } from "react";
import { ScrollReveal } from "../Main/ScrollReveal";
import {Link, useNavigate} from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <ScrollReveal direction="fade" delay={200}>
              <div className="text-6xl mb-6 animate-bounce">🌿</div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  MindBalance
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={600}>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Track your moods. Build better habits. Feel better.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={800}>
              <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
                Your personal wellness companion that helps you understand your
                emotions, build positive habits, and create a more balanced
                life.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={1000}>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/auth" className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
                  Try for Free
                </Link>
                <button onClick={() => navigate('/auth')} className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                  Login
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
