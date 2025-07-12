import Logo from "../Favicon/Logo";
const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl"><Logo width="60" height="60"/></div>
                <span className="text-xl font-semibold">Tranquilify</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your personal wellness companion for tracking moods, building habits, and creating a more balanced life.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 MindBalance. All rights reserved.
              </div>
           
            
            
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
              </ul>
            
            
           
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Support</a></li>
              </ul>
            
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
