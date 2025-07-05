import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "../../config/axios";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        setIsAuthenticated(false);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🌿</div>
                <span className="text-xl font-semibold text-gray-800">
                  MindBalance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isHome && (
                <>
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
                    href="#screenshots"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    About
                  </a>
                </>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  Dashboard
                </button>
              )}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  Try for Free
                </Link>
              )}
            </div>

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
              {isHome && (
                <>
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
                </>
              )}
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="m-auto max-w-fit px-10 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 block w-full text-left text-white hover:text-gray-900"
                >
                  Logout
                </button>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="max-w-fit block m-auto bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-12 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl mt-2"
                >
                  Try for Free
                </Link>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="max-w-fit block m-auto bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-12 py-2 rounded-full hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl mt-2"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
