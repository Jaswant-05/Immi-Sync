import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <span className="text-white font-bold text-lg">IS</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900 hidden sm:block">
              ImmiSync
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6 text-gray-600">
              <a 
                href="#features" 
                className="hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Contact
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="login" 
                onClick={() => navigate('/signin')}
                className="px-6"
              >
                Sign In
              </Button>
              <Button 
                variant="getStarted" 
                onClick={() => navigate('/signup')}
                className="px-6"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <a 
                  href="#features" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#about" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
              
              {/* Mobile Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Button 
                  variant="login" 
                  onClick={() => {
                    navigate('/signin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Sign In
                </Button>
                <Button 
                  variant="getStarted" 
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};