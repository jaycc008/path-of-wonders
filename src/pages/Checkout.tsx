import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowLeft, Shield, Clock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Subscription, initiatePurchase } from '../api/subscription';
import { initiateCoursePurchase } from '../api/course';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, getRedirectState, clearRedirectUrl } = useAuth();
  
  // Get course or subscription from location state or restored redirect state
  const locationState = location.state as { course?: Course; subscription?: Subscription } | undefined;
  const redirectState = getRedirectState();
  
  // Prioritize location state, then redirect state, then nothing
  const courseFromState = locationState?.course || redirectState?.course;
  const subscriptionFromState = locationState?.subscription || redirectState?.subscription;
  
  // Clear redirect state if we have it (we've successfully restored it)
  useEffect(() => {
    if (redirectState && isAuthenticated) {
      clearRedirectUrl();
    }
  }, [redirectState, isAuthenticated, clearRedirectUrl]);
  
  // Determine if this is a subscription checkout
  const isSubscription = !!subscriptionFromState;

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current URL and state for redirect after login
      const currentPath = location.pathname + location.search;
      const stateToPreserve = {
        course: courseFromState,
        subscription: subscriptionFromState,
      };
      
      // Store redirect URL and state in localStorage
      localStorage.setItem('redirect_url', currentPath);
      localStorage.setItem('redirect_state', JSON.stringify(stateToPreserve));
      
      // Get login URL from environment variable
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
      
      // Check if it's a full URL (external) or relative path (internal)
      if (loginUrl.startsWith('http://') || loginUrl.startsWith('https://')) {
        // External login page - redirect with return URL as query parameter
        const returnUrl = encodeURIComponent(window.location.origin + currentPath);
        window.location.href = `${loginUrl}?return_url=${returnUrl}`;
      }
      // If internal, the external app will handle the redirect after setting token
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, location.search, courseFromState, subscriptionFromState]);
  
  // Mock course data (fallback)
  const mockCourse: Course = courseFromState || {
    id: 1,
    title: 'Consciousness Development',
    description: 'Explore the depths of human consciousness through evidence-based practices and quantum science principles.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    price: 299,
  };

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Populate email and name from user data when available
  useEffect(() => {
    if (user) {
      if (user.email) {
        setEmail(user.email);
        console.log('[Checkout] Email populated from user:', user.email);
      }
      if (user.name) {
        setName(user.name);
        console.log('[Checkout] Name populated from user:', user.name);
      }
    } else {
      // Fallback: try to get user data directly from localStorage
      const storedUser = api.getUser();
      if (storedUser) {
        console.log('[Checkout] User not in context, getting from localStorage:', storedUser);
        if (storedUser.email && !email) {
          setEmail(storedUser.email);
          console.log('[Checkout] Email populated from localStorage:', storedUser.email);
        }
        if (storedUser.name && !name) {
          setName(storedUser.name);
          console.log('[Checkout] Name populated from localStorage:', storedUser.name);
        }
      }
    }
  }, [user]);

  // Calculate pricing based on subscription or course
  const subscriptionPrice = subscriptionFromState 
    ? (subscriptionFromState.discount?.final_price ?? subscriptionFromState.price)
    : mockCourse.price;
  const originalPrice = subscriptionFromState?.price ?? mockCourse.price;
  const discount = subscriptionFromState?.discount?.final_price 
    ? originalPrice - subscriptionPrice 
    : 0;
  const subtotal = subscriptionPrice;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && value && /\S+@\S+\.\S+/.test(value)) {
      setEmailError('');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (nameError && value && value.trim().length >= 2) {
      setNameError('');
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!name || name.trim().length < 2) {
      setNameError('Please enter your full name');
      isValid = false;
    } else {
      setNameError('');
    }

    return isValid;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      let checkoutUrl: string | undefined;

      if (isSubscription && subscriptionFromState) {
        // Handle subscription purchase
        console.log('[Checkout] Initiating subscription purchase:', subscriptionFromState.id);
        const purchaseResponse = await initiatePurchase(
          subscriptionFromState.id,
          name,
          email,
          subscriptionFromState.discount?.id,
          undefined // promotion_code can be added later if needed
        );

        if (purchaseResponse.status && purchaseResponse.data?.checkout_url) {
          checkoutUrl = purchaseResponse.data.checkout_url;
          console.log('[Checkout] Subscription checkout URL received:', checkoutUrl);
        } else {
          throw new Error(purchaseResponse.message || 'Failed to get checkout URL for subscription');
        }
      } else if (courseFromState) {
        // Handle course purchase
        console.log('[Checkout] Initiating course purchase:', courseFromState.id);
        const purchaseResponse = await initiateCoursePurchase(
          courseFromState.id,
          name,
          email,
          undefined // promotion_code can be added later if needed
        );

        if (purchaseResponse.status && purchaseResponse.data?.checkout_url) {
          checkoutUrl = purchaseResponse.data.checkout_url;
          console.log('[Checkout] Course checkout URL received:', checkoutUrl);
        } else {
          throw new Error(purchaseResponse.message || 'Failed to get checkout URL for course');
        }
      } else {
        throw new Error('No subscription or course selected');
      }

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        console.log('[Checkout] Redirecting to Stripe checkout:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Checkout URL not available');
      }
    } catch (error: any) {
      console.error('[Checkout] Error initiating payment:', error);
      setIsProcessing(false);
      
      // Show error message to user
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment. Please try again.';
      alert(errorMessage);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{isSubscription ? 'Back' : 'Back to Courses'}</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Checkout Form (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl  p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {isSubscription ? 'Complete Your Subscription' : 'Complete Your Enrollment'}
                </h1>
                <p className="text-gray-600">
                  Secure checkout powered by Stripe
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
                {isSubscription && subscriptionFromState ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                        {subscriptionFromState.name}
                      </div>
                      {subscriptionFromState.discount && subscriptionFromState.discount.discount_percent && (
                        <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                          {subscriptionFromState.discount.discount_percent}% OFF
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-4xl font-bold text-gray-900">
                        ${subscriptionPrice.toFixed(2)}
                      </div>
                      {subscriptionFromState.discount?.final_price && (
                        <div className="text-2xl font-semibold text-gray-500 line-through">
                          ${originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {Math.floor(subscriptionFromState.duration_days / 30)} {Math.floor(subscriptionFromState.duration_days / 30) === 1 ? 'month' : 'months'} subscription
                    </p>
                    {subscriptionFromState.includes && subscriptionFromState.includes.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Includes:</p>
                        {subscriptionFromState.includes.slice(0, 3).map((item: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                        {subscriptionFromState.includes.length > 3 && (
                          <p className="text-xs text-gray-500">+ {subscriptionFromState.includes.length - 3} more benefits</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <img
                      src={mockCourse.image}
                      alt={mockCourse.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {mockCourse.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {mockCourse.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={handleNameChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        nameError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {nameError && (
                      <p className="mt-1 text-sm text-red-600">{nameError}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600">{emailError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Order Summary (1 column) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl  p-6 md:p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Item Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {isSubscription && subscriptionFromState ? (
                  <div>
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {subscriptionFromState.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {Math.floor(subscriptionFromState.duration_days / 30)} {Math.floor(subscriptionFromState.duration_days / 30) === 1 ? 'month' : 'months'} subscription
                      </p>
                    </div>
                    {subscriptionFromState.discount && subscriptionFromState.discount.discount_percent && (
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {subscriptionFromState.discount.discount_percent}% Discount Applied
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4 mb-4">
                    <img
                      src={mockCourse.image}
                      alt={mockCourse.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {mockCourse.title}
                      </h3>
                      <p className="text-sm text-gray-600">Full Course Access</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                {subscriptionFromState?.discount?.final_price && (
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Original Price</span>
                    <span className="line-through">${originalPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {isSubscription && subscriptionFromState?.includes ? (
                    (subscriptionFromState.includes as string[]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Full course access</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Lifetime access to materials</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>24/7 support</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Guarantee Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Money-Back Guarantee</h4>
                    <p className="text-sm text-green-700">
                      14-day money-back guarantee if you're not satisfied
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <Clock className="w-4 h-4" />
                <span>Need help? Contact our support team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
