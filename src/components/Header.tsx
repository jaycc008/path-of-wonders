import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import logo from '../assets/images/10dlogo1.png';

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
            ? 'w-full bg-gray-50/95 backdrop-blur-xl shadow-lg shadow-gray-900/20'
            : 'max-w-7xl mx-auto bg-gray-50/90 backdrop-blur-lg shadow-lg shadow-gray-900/25 rounded-full '
        }`}
      >
        <div className={`max-w-7xl mx-auto px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-4'
        }`}>
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Path Of Wonders Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-gray-900 sm:block hidden">
              Path Of Wonders
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
              className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/#about"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.getElementById('about');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                } else {
                  const element = document.getElementById('about');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
            >
              About
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link
              to="/courses"
              className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
            >
              Courses
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a
              href="/#testimonials"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.getElementById('testimonials');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                } else {
                  const element = document.getElementById('testimonials');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
            >
              Testimonials
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                } else {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
            >
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMyLearningClick}
                  className="px-6 py-2.5 rounded-full font-medium bg-gradient-to-r from-primary-start to-primary-end text-white hover:from-primary-hover-start hover:to-primary-hover-end transition-all duration-300  shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  My Learning
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 text-white hover:from-neutral-700 hover:to-neutral-800 transition-all duration-100  shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
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
              <a
                href={import.meta.env.VITE_LOGIN_URL || '/login'}
                onClick={(e) => {
                  e.preventDefault();
                  const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
                  const currentFullUrl = window.location.href;
                  const returnUrlParam = encodeURIComponent(currentFullUrl);
                  
                  // Check if it's a full URL (external) or relative path (internal)
                  if (loginUrl.startsWith('http://') || loginUrl.startsWith('https://')) {
                    // External URL - add return_url parameter
                    const separator = loginUrl.includes('?') ? '&' : '?';
                    window.location.href = `${loginUrl}${separator}return_url=${returnUrlParam}`;
                  } else {
                    // Internal route - use React Router to navigate
                    navigate(`${loginUrl}?return_url=${returnUrlParam}`);
                  }
                }}
                className="px-6 py-2.5 rounded-full font-medium bg-gradient-to-r from-primary-start to-primary-end text-white hover:from-primary-hover-start hover:to-primary-hover-end transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Login/Sign Up
              </a>
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
