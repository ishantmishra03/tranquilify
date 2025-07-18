import { Sparkles } from "lucide-react";
import { ScrollReveal } from './ScrollReveal';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isDarkMode } = useAppContext();

  return (
    <div>
      {/* Final CTA Section */}
      <section
        className={`py-20 px-4 sm:px-6 lg:px-8 ${
          isDarkMode
            ? 'bg-gradient-to-r from-gray-800 to-gray-900'
            : 'bg-gradient-to-r from-sky-50 to-emerald-50'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="fade" delay={0}>
            <div className="mb-6 flex justify-center items-center"><Sparkles className="w-15 h-15"/></div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Start feeling better today
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <p
              className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Join thousands of people who have already started their wellness journey with Tranquilify. 
              Your mental health matters, and we're here to help.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={600}>
            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up Now
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Dashboard
              </button>
            )}
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Free forever. No credit card required.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default CTA;
