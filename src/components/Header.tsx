import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'pt-0 px-0' : 'pt-4 px-4'
      }`}
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'w-full bg-gray-50/95 backdrop-blur-xl shadow-lg shadow-gray-200/50'
            : 'max-w-7xl mx-auto bg-gray-50/90 backdrop-blur-lg shadow-md shadow-gray-200/30 rounded-full'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-4'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 sm:block hidden">
              10D School
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {['Home', 'About', 'Courses', 'Testimonials', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            {isAuthenticated ? (
              <Link
                to="/my-learning"
                className="px-6 py-2.5 rounded-full font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
              >
                My Learning
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-6 py-2.5 rounded-full font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Login/Sign Up
              </Link>
            )}
          </nav>

          <button className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
