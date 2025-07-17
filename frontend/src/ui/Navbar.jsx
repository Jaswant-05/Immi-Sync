import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./Button";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a page that needs a solid navbar background
  const needsSolidBackground = location.pathname !== '/';
  
  return (
    <header className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${
      needsSolidBackground 
        ? 'bg-white/95 border-gray-200 shadow-sm' 
        : 'bg-transparent border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">IS</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <span className={`ml-4 text-2xl font-bold transition-colors duration-300 ${
              needsSolidBackground ? 'text-gray-900' : 'text-white'
            }`}>
              ImmiSync
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant={needsSolidBackground ? "secondary" : "ghost"}
              onClick={() => navigate('/signin')}
              className="px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-base"
            >
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">Login</span>
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate('/signup')}
              className="px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-base"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Join</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};