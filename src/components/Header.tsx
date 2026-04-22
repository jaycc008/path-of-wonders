import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Crown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { logout as logoutAPI } from '../api/auth';
import logo from '../assets/images/10dlogo1.png';
import textLogo from '../assets/images/textlogo.png';
import PrimaryButton from './PrimaryButton';
import MobileHeader from './MobileHeader';

export default function Header() {
  const [scrolled, setScrolled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to extract user info from nested data structure
  const getUserInfo = () => {
    // Check if user data is nested in a 'data' property
    const userData = (user as any)?.data || user;
    
    // Also check localStorage for user data
    const storedUser = api.getUser();
    const storedUserData = (storedUser as any)?.data || storedUser;
    
    // Use stored user data if available, otherwise use user from context
    const finalUserData = storedUserData || userData;
    
    return {
      name: finalUserData?.name || '',
      email: finalUserData?.email || '',
      activeSubscription: finalUserData?.active_subscription || null
    };
  };

  const userInfo = getUserInfo();
  
  // Calculate days until expiration
  const getDaysUntilExpiration = (endDateString: string | null): number | null => {
    if (!endDateString) return null;
    try {
      const endDate = new Date(endDateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  const handleMyLearningClick = () => {
    const myLearningUrl = import.meta.env.VITE_MY_LEARNING_URL;
    if (myLearningUrl) {
      const token = api.getToken();
      const url = token ? `${myLearningUrl}?token=${encodeURIComponent(token)}` : myLearningUrl;
      window.open(url, '_blank');
    }
    setIsDropdownOpen(false);
  };

  const handleLoginClick = () => {
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
  };

  const handleLogout = async () => {
    try {
      // Call logout API to invalidate session on server
      await logoutAPI();
    } catch (error) {
      // Even if logout API fails, continue with local logout
      console.error('Logout API error:', error);
    } finally {
      // Get current page URL for return_url
      const currentFullUrl = window.location.href;
      const returnUrlParam = encodeURIComponent(currentFullUrl);
      
      // Clear user session locally
      logout();
      
      // Get login URL from environment variable
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
      
      // Check if it's a full URL (external) or relative path (internal)
      if (loginUrl.startsWith('http://') || loginUrl.startsWith('https://')) {
        // External login page - redirect with return URL as query parameter
        const separator = loginUrl.includes('?') ? '&' : '?';
        window.location.href = `${loginUrl}${separator}return_url=${returnUrlParam}`;
      } else {
        // Internal route - use React Router to navigate to login page
        navigate(`${loginUrl}?return_url=${encodeURIComponent(returnUrlParam)}`);
      }
      navigate('/');
      setIsDropdownOpen(false);
    }
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
    const handleViewport = () => setIsMobile(window.innerWidth < 768);
    handleViewport();
    window.addEventListener('resize', handleViewport);
    return () => window.removeEventListener('resize', handleViewport);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = isMobile ? 12 : 50;
      setScrolled(window.scrollY > scrollThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <MobileHeader
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        scrolled={scrolled}
        isAuthenticated={isAuthenticated}
        userEmail={userInfo.email}
        onMyLearningClick={handleMyLearningClick}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
      />
    );
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`desktop-header-shell is-scrolled`}
      >
        <div className="desktop-header-inner max-w-7xl mx-auto flex items-center justify-between py-2 md:py-4 rounded-full bg-white/20 px-4">
          <Link to="/" className="flex items-center gap-2 min-h-0">
            <img 
              src={logo} 
              alt="" 
              className="h-12 w-12  md:w-15 md:h-15"
              aria-hidden
            />
            <img
              src={textLogo}
              alt="Path Of Wonders"
              className="h-7 sm:h-8 md:h-9 w-auto max-w-[min(100%,16rem)] md:max-w-[12rem] object-contain object-left"
            />
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
              className={`relative  font-medium transition-all duration-300 group ${
                location.pathname === '/' 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Home
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ${
                location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </a>
            <Link
              to="/about"
              className={`relative  font-medium transition-all duration-300 group ${
                location.pathname === '/about' 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              About
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ${
                location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link
              to="/courses"
              className={`relative  font-medium transition-all duration-300 group ${
                location.pathname === '/courses' || location.pathname.startsWith('/courses/')
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              The Universe
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ${
                location.pathname === '/courses' || location.pathname.startsWith('/courses/') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
           
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
              className="relative  font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 group"
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
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className=" font-semibold text-gray-900 truncate">
                          {userInfo.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userInfo.email}
                        </p>
                      </div>
                      
                      {/* Active Subscription Section */}
                      {userInfo.activeSubscription && userInfo.activeSubscription.status === 'active' && (
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Crown className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {userInfo.activeSubscription.subscription?.name || 'Active Subscription'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span className="text-xs text-green-700 font-medium">Active</span>
                            </div>
                          </div>
                          {userInfo.activeSubscription.end_date && (() => {
                            const daysLeft = getDaysUntilExpiration(userInfo.activeSubscription.end_date);
                            return daysLeft !== null && (
                              <p className="text-xs text-gray-600">
                                Expires in: {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                              </p>
                            );
                          })()}
                        </div>
                      )}
                      
                      <button
                        onClick={handleMyLearningClick}
                        className="w-full px-4 py-2 text-left  text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left  text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <PrimaryButton
                onClick={handleLoginClick}
              >
                 Join Early Access
              </PrimaryButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
