import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMyLearningClick = () => {
    const myLearningUrl = import.meta.env.VITE_MY_LEARNING_URL;
    if (myLearningUrl) {
      const token = api.getToken();
      const url = token ? `${myLearningUrl}?token=${encodeURIComponent(token)}` : myLearningUrl;
      window.open(url, '_blank');
    }
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
            ? 'w-full bg-gray-50/95 backdrop-blur-xl shadow-20 shadow-gray-200/50'
            : 'max-w-7xl mx-auto bg-gray-50/90 backdrop-blur-lg shadow-xl shadow-gray-200/30 rounded-full '
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
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMyLearningClick}
                  className="px-6 py-2.5 rounded-full font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300  shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  My Learning
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-200 text-dark hover:text-white hover:from-neutral-600 hover:to-neutral-700 transition-all duration-100  shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleMyLearningClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
