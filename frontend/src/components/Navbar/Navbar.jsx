import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "../../config/axios";
import Logo from "../Favicon/Logo";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();
  const {
    isAuthenticated,
    setIsAuthenticated,
    isDarkMode,
  } = useAppContext();
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
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b backdrop-blur-lg ${
          isDarkMode ? "bg-gray-900/80 border-gray-700 text-white" : "bg-white/80 border-gray-100 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <div className="text-2xl"><Logo width="50" height="50"/></div>
                <span className="text-xl font-semibold">
                  Tranquilify
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isHome && (
                <>
                  <a
                    href="#features"
                    className="hover:underline transition-colors duration-200"
                  >
                    Features
                  </a>
                  <a
                    href="#testimonials"
                    className="hover:underline transition-colors duration-200"
                  >
                    Reviews
                  </a>
                  <a
                    href="#screenshots"
                    className="hover:underline transition-colors duration-200"
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
            <div className="md:hidden flex items-center space-x-2 ">
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black"
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
          <div
            className={`md:hidden ${
              isDarkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-100"
            } border-t animate-in slide-in-from-top duration-200`}
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {isHome && (
                <>
                  <a href="#features" className="block px-3 py-2 hover:underline">
                    Features
                  </a>
                  <a href="#testimonials" className="block px-3 py-2 hover:underline">
                    Reviews
                  </a>
                  <a href="#screenshots" className="block px-3 py-2 hover:underline">
                    About
                  </a>
                </>
              )}
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="block w-full text-left px-3 py-2"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="m-auto max-w-fit px-10 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 block w-full text-left text-white"
                >
                  Logout
                </button>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="max-w-fit block m-auto bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-12 py-2 rounded-full mt-2"
                >
                  Try for Free
                </Link>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="max-w-fit block m-auto bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-12 py-2 rounded-full mt-2"
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
