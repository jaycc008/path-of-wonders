import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { signup, SignupPayload, googleLogin } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SignupPayload>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupPayload, string>>>({});
  const [status, setStatus] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const { getRedirectUrl, getRedirectState, clearRedirectUrl, checkAuth } = useAuth();

  // Get redirect URL from query params or localStorage
  const getRedirectFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect_url') || params.get('return_url');
  };

  /**
   * Handle redirect after successful signup
   */
  const handleRedirect = () => {
    // Check query params first
    const queryRedirect = getRedirectFromQuery();
    if (queryRedirect) {
      try {
        const decodedUrl = decodeURIComponent(queryRedirect);
        console.log('[SignUp] Redirecting to query URL:', decodedUrl);
        navigate(decodedUrl);
        return;
      } catch (error) {
        console.error('[SignUp] Error decoding redirect URL:', error);
      }
    }

    // Check localStorage for redirect URL
    const redirectUrl = getRedirectUrl();
    const redirectState = getRedirectState();

    if (redirectUrl) {
      console.log('[SignUp] Redirecting to stored URL:', redirectUrl);
      clearRedirectUrl();
      navigate(redirectUrl, { state: redirectState });
      return;
    }

    // Default redirect to home
    console.log('[SignUp] No redirect URL, going to home');
    navigate('/');
  };

  /**
   * Handle Google credential callback
   */
  const handleGoogleCallback = async (credential: string) => {
    try {
      setIsGoogleLoading(true);
      console.log('[SignUp] Google signup initiated');
      const response = await googleLogin({ credential });
      
      console.log('[SignUp] Google signup response received:', response);
      
      // Store token and user data in localStorage
      if (response.access_token) {
        api.setToken(response.access_token);
        console.log('[SignUp] Token stored in localStorage');
        
        // Store user object if provided in response
        if (response.user) {
          api.setUser(response.user);
          console.log('[SignUp] User data stored in localStorage:', response.user);
        }
        
        // Trigger auth check to decode token
        checkAuth();
        
        // Wait a bit for auth context to update
        setTimeout(() => {
          handleRedirect();
        }, 100);
      }
    } catch (error: any) {
      console.error('[SignUp] Error signing up with Google:', error);
      setStatus(error.response?.data?.detail || 'Failed to sign up with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /**
   * Initialize Google Identity Services
   */
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      console.warn('[SignUp] Google Client ID is not configured. Google signup will not work.');
      return;
    }

    // Check if script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      // Script already exists, just initialize
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: { credential: string }) => {
            handleGoogleCallback(response.credential);
          },
        });
      }
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: { credential: string }) => {
            handleGoogleCallback(response.credential);
          },
        });
      }
    };

    script.onerror = () => {
      console.error('[SignUp] Failed to load Google Identity Services script');
      setStatus('Failed to load Google sign-in. Please check your connection.');
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount as it might be used by other components
    };
  }, []);

  /**
   * Handle Google sign-in button click
   */
  const handleGoogleSignUp = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      setStatus('Google Client ID is not configured.');
      return;
    }

    if (window.google?.accounts?.id) {
      try {
        setIsGoogleLoading(true);
        // Trigger Google sign-in popup
        window.google.accounts.id.prompt();
      } catch (error) {
        console.error('[SignUp] Error triggering Google sign-up:', error);
        setStatus('Failed to initiate Google sign-up. Please try again.');
        setIsGoogleLoading(false);
      }
    } else {
      setStatus('Google sign-up is not available. Please wait a moment and try again.');
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof SignupPayload]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (status) {
      setStatus('');
    }
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupPayload, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('');
      console.log('[SignUp] Submitting signup form');
      
      const response = await signup(formData);
      console.log('[SignUp] Signup response received:', response);
      
      // Store token and user data in localStorage
      if (response.access_token) {
        api.setToken(response.access_token);
        console.log('[SignUp] Token stored in localStorage');
        
        // Store user object if provided in response
        if (response.user) {
          api.setUser(response.user);
          console.log('[SignUp] User data stored in localStorage:', response.user);
        }
        
        // Trigger auth check to decode token
        checkAuth();
        
        // Wait a bit for auth context to update
        setTimeout(() => {
          handleRedirect();
        }, 100);
      }
    } catch (error: any) {
      console.error('[SignUp] Error signing up:', error);
      
      // Handle API errors
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
      } else if (error.response?.data?.detail) {
        setStatus(error.response.data.detail);
      } else {
        setStatus('Failed to sign up. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-md">
        <div className="w-full mb-5">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to dashboard
          </Link>
        </div>
        
        <div className="flex flex-col justify-center flex-1">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white/90">
                Sign Up
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create your account to get started!
              </p>
            </div>
            
            <div>
              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className="inline-flex items-center w-full justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-900 sm:px-5 sm:py-2">
                    Or
                  </span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Error message */}
                  {status && (
                    <div className="flex items-start gap-3 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{status}</span>
                    </div>
                  )}
                  
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="info@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder="Confirm your password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                          errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="block text-sm font-normal text-gray-700 dark:text-gray-400">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isChecked}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Signing up...
                        </>
                      ) : (
                        'Sign up'
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Sign In Link */}
              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
