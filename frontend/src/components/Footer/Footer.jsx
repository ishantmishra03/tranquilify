import Logo from "../Favicon/Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">

          {/* Logo + Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo width="50" height="50" />
              <span className="text-2xl font-bold">Tranquilify</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Your personal wellness companion for tracking moods, building habits, and creating a more balanced life.
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Tranquilify. All rights reserved.
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              {["About", "Contact", "Careers", "Blog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Support"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Optional: Social or Newsletter */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-2">Subscribe to our newsletter for updates.</p>
            <form className="flex flex-col sm:flex-row items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
