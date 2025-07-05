import { useState } from "react";
import { ScrollReveal } from "../Main/ScrollReveal";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <ScrollReveal
                direction="left"
                className="flex items-center space-x-2"
              >
                <div className="text-2xl">🌿</div>
                <span className="text-xl font-semibold text-gray-800">
                  MindBalance
                </span>
              </ScrollReveal>
            </Link>

            {/* Desktop Navigation */}
            <ScrollReveal
              direction="right"
              className="hidden md:flex items-center space-x-8"
            >
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Reviews
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                About
              </a>
              <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Login
              </button>
              <button className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
                Try for Free
              </button>
            </ScrollReveal>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Reviews
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                About
              </a>
              <button className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">
                Login
              </button>
              <Link to="/auth" className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl mt-2">
                Try for Free
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
