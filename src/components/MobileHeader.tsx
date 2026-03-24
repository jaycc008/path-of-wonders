import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import logo from '../assets/images/10dlogo1.png';
import PrimaryButton from './PrimaryButton';

interface MobileHeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  scrolled: boolean;
  isAuthenticated: boolean;
  userEmail: string;
  onMyLearningClick: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function MobileHeader({
  isOpen,
  setIsOpen,
  scrolled,
  isAuthenticated,
  userEmail,
  onMyLearningClick,
  onLogout,
  onLoginClick,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const showGlassHeader = scrolled || isOpen;

  return (
    <header className="fixed left-0 right-0 z-50">
      <div
        className={`w-full transition-all duration-300 ${
          showGlassHeader
            ? 'bg-white/70 backdrop-blur-md shadow-md shadow-gray-900/10'
            : 'bg-transparent shadow-none'
        }`}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Path Of Wonders Logo" className="h-9 w-9 object-contain" />
            <span className="text-sm font-semibold text-gray-900">Path Of Wonders</span>
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-4 pb-5 pt-2 border-t border-gray-200 bg-white/90 backdrop-blur-md flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`py-3 px-3 rounded-lg text-sm font-medium ${location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`py-3 px-3 rounded-lg text-sm font-medium ${location.pathname === '/about' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              About
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsOpen(false)}
              className={`py-3 px-3 rounded-lg text-sm font-medium ${location.pathname === '/courses' || location.pathname.startsWith('/courses/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Courses
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                const el = document.getElementById('testimonials');
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                } else {
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="py-3 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 text-left"
            >
              Testimonials
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                const el = document.getElementById('contact');
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                } else {
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="py-3 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 text-left"
            >
              Contact
            </button>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onMyLearningClick();
                  }}
                  className="mt-2 py-3 px-3 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 text-left w-full"
                >
                  My Learning
                </button>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="px-3 py-1 text-xs text-gray-500 truncate">{userEmail}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="py-3 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <PrimaryButton
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick();
                  }}
                  className="w-full justify-center"
                >
                  Login/Sign Up
                </PrimaryButton>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
