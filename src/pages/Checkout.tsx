import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Shield, Clock, ArrowRight, Sparkles, Loader2, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CouponInput from '../components/CouponInput';
import { Subscription, initiatePurchase } from '../api/subscription';
import { initiateCoursePurchase } from '../api/course';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import PrimaryButton from '../components/PrimaryButton';
import { decodeFromBase64, encodeToBase64 } from '../utils/encoding';

interface Course {
  id: number;
  name?: string;
  title?: string;
  description: string;
  image?: string;
  thumbnail_url?: string;
  price: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, getRedirectState, clearRedirectUrl } = useAuth();
  
  // Get course or subscription from location state, query params, or restored redirect state
  const locationState = location.state as { course?: Course; subscription?: Subscription } | undefined;
  const redirectState = getRedirectState();
  
  // Check URL query parameters for subscription or course data (from redirect after login)
  const getDataFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const subscriptionParam = params.get('subscription');
    const courseParam = params.get('course');
    
    let subscriptionFromQuery: Subscription | null = null;
    let courseFromQuery: Course | null = null;
    
    // Helper function to decode and parse encoded data
    const decodeAndParse = (param: string): any => {
      try {
        // Step 1: Decode URL encoding
        const urlDecoded = decodeURIComponent(param);
        
        // Step 2: Decode base64
        let decodedJson = decodeFromBase64(urlDecoded);
        
        // Step 3: Validate that we got JSON, not the base64 string back
        // If decodeFromBase64 failed, it might return the original string
        if (!decodedJson.trim().startsWith('{') && !decodedJson.trim().startsWith('[')) {
          // decodeFromBase64 might have failed, try direct atob
          try {
            const binaryString = atob(urlDecoded);
            decodedJson = decodeURIComponent(
              binaryString
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
          } catch (atobError) {
            // If atob also fails, the string might not be base64
            // Try treating it as already decoded JSON
            if (urlDecoded.trim().startsWith('{') || urlDecoded.trim().startsWith('[')) {
              decodedJson = urlDecoded;
            } else {
              throw new Error('Failed to decode base64 string');
            }
          }
        }
        
        // Step 4: Parse JSON
        return JSON.parse(decodedJson);
      } catch (error: any) {
        console.error('[Checkout] Error decoding/parsing param:', error);
        throw error;
      }
    };
    
    if (subscriptionParam) {
      try {
        const parsedData = decodeAndParse(subscriptionParam);
        subscriptionFromQuery = parsedData.subscription || null;
      } catch (error) {
        console.error('[Checkout] Error parsing subscription from query param:', error);
      }
    }
    
    if (courseParam) {
      try {
        const parsedData = decodeAndParse(courseParam);
        courseFromQuery = parsedData.course || null;
      } catch (error) {
        console.error('[Checkout] Error parsing course from query param:', error);
      }
    }
    
    return { subscriptionFromQuery, courseFromQuery };
  };
  
  const { subscriptionFromQuery, courseFromQuery } = getDataFromQuery();
  
  // Prioritize: location state > query params > redirect state
  const courseFromState = locationState?.course || courseFromQuery || redirectState?.course;
  const subscriptionFromState = locationState?.subscription || subscriptionFromQuery || redirectState?.subscription;
  console.log(subscriptionFromState,"fromState")
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
      // Build return URL with subscription/course data in query params
      const baseCheckoutUrl = '/checkout';
      let returnUrl = `${window.location.origin}${baseCheckoutUrl}`;
      
      // Encode subscription or course data in query parameters using UTF-8 safe encoding
      if (subscriptionFromState) {
        const subscriptionJson = JSON.stringify({ subscription: subscriptionFromState });
        const encodedSubscription = encodeToBase64(subscriptionJson);
        returnUrl = `${returnUrl}?subscription=${encodeURIComponent(encodedSubscription)}`;
      } else if (courseFromState) {
        const courseJson = JSON.stringify({ course: courseFromState });
        const encodedCourse = encodeToBase64(courseJson);
        returnUrl = `${returnUrl}?course=${encodeURIComponent(encodedCourse)}`;
      }
      
      // Get login URL from environment variable
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
      
      // Check if it's a full URL (external) or relative path (internal)
      if (loginUrl.startsWith('http://') || loginUrl.startsWith('https://')) {
        // External login page - redirect with return URL as query parameter
        const returnUrlParam = encodeURIComponent(returnUrl);
        window.location.href = `${loginUrl}?return_url=${returnUrlParam}`;
      } else {
        // Internal route - use React Router to navigate to login page
        navigate(`${loginUrl}?return_url=${encodeURIComponent(returnUrl)}`);
      }
    }
  }, [isAuthenticated, isLoading, navigate, courseFromState, subscriptionFromState]);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  
  // Billing address state
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US'); // Default to US
  const [saveAddress, setSaveAddress] = useState(true);
  const [addressErrors, setAddressErrors] = useState<{[key: string]: string}>({});

  // Populate email and name from user data when available
  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }
    
    // Helper function to extract email and name from user object (handles nested data structure)
    const extractUserInfo = (userObj: any) => {
      // Check if user data is nested in a 'data' property
      const userData = userObj?.data || userObj;
      
      return {
        email: userData?.email || '',
        name: userData?.name || '',
        billingAddress: userData?.billing_address || userData?.address || null,
        addresses: userData?.addresses || []
      };
    };
    
    if (user) {
      // User is authenticated - populate email and name
      const userInfo = extractUserInfo(user);
      if (userInfo.email) {
        setEmail(userInfo.email);
        console.log('[Checkout] Email populated from user:', userInfo.email);
      }
      if (userInfo.name) {
        setName(userInfo.name);
        console.log('[Checkout] Name populated from user:', userInfo.name);
      }
      
      // Populate billing address from default address if available
      if (userInfo.addresses && Array.isArray(userInfo.addresses) && userInfo.addresses.length > 0) {
        // Find default address (is_default === true) or use first address
        const defaultAddress = userInfo.addresses.find((addr: any) => addr.is_default === true) || userInfo.addresses[0];
        
        if (defaultAddress) {
          setAddressLine1(defaultAddress.address_line1 || '');
          setAddressLine2(defaultAddress.address_line2 || '');
          setCity(defaultAddress.city || '');
          setState(defaultAddress.state || '');
          setPostalCode(defaultAddress.postal_code || '');
          
          // Convert country name to country code if needed, or use as is
          const countryValue = defaultAddress.country || 'US';
          // Map common country names to ISO codes
          const countryMap: {[key: string]: string} = {
            'India': 'IN',
            'United States': 'US',
            'United States of America': 'US',
            'Canada': 'CA',
            'United Kingdom': 'GB',
            'Australia': 'AU'
          };
          setCountry(countryMap[countryValue] || countryValue);
          console.log('[Checkout] Billing address populated from default address');
        }
      } else if (userInfo.billingAddress) {
        // Fallback to billingAddress if addresses array is not available
        const address = userInfo.billingAddress;
        setAddressLine1(address.line1 || address.address_line1 || address.street || '');
        setAddressLine2(address.line2 || address.address_line2 || address.street2 || '');
        setCity(address.city || '');
        setState(address.state || address.state_province || '');
        setPostalCode(address.postal_code || address.postal || address.zip || '');
        const countryValue = address.country || 'US';
        const countryMap: {[key: string]: string} = {
          'India': 'IN',
          'United States': 'US',
          'United States of America': 'US',
          'Canada': 'CA',
          'United Kingdom': 'GB',
          'Australia': 'AU'
        };
        setCountry(countryMap[countryValue] || countryValue);
        console.log('[Checkout] Billing address populated from billingAddress');
      }
    } else {
      // Fallback: try to get user data directly from localStorage/api
      const storedUser = api.getUser();
      if (storedUser) {
        console.log('[Checkout] User not in context, getting from api:', storedUser);
        const userInfo = extractUserInfo(storedUser);
        if (userInfo.email) {
          setEmail(userInfo.email);
          console.log('[Checkout] Email populated from api:', userInfo.email);
        }
        if (userInfo.name) {
          setName(userInfo.name);
          console.log('[Checkout] Name populated from api:', userInfo.name);
        }
        
        // Populate billing address from default address if available
        if (userInfo.addresses && Array.isArray(userInfo.addresses) && userInfo.addresses.length > 0) {
          // Find default address (is_default === true) or use first address
          const defaultAddress = userInfo.addresses.find((addr: any) => addr.is_default === true) || userInfo.addresses[0];
          
          if (defaultAddress) {
            setAddressLine1(defaultAddress.address_line1 || '');
            setAddressLine2(defaultAddress.address_line2 || '');
            setCity(defaultAddress.city || '');
            setState(defaultAddress.state || '');
            setPostalCode(defaultAddress.postal_code || '');
            
            // Convert country name to country code if needed, or use as is
            const countryValue = defaultAddress.country || 'US';
            // Map common country names to ISO codes
            const countryMap: {[key: string]: string} = {
              'India': 'IN',
              'United States': 'US',
              'United States of America': 'US',
              'Canada': 'CA',
              'United Kingdom': 'GB',
              'Australia': 'AU'
            };
            setCountry(countryMap[countryValue] || countryValue);
            console.log('[Checkout] Billing address populated from default address (api)');
          }
        } else if (userInfo.billingAddress) {
          // Fallback to billingAddress if addresses array is not available
          const address = userInfo.billingAddress;
          setAddressLine1(address.line1 || address.address_line1 || address.street || '');
          setAddressLine2(address.line2 || address.address_line2 || address.street2 || '');
          setCity(address.city || '');
          setState(address.state || address.state_province || '');
          setPostalCode(address.postal_code || address.postal || address.zip || '');
          const countryValue = address.country || 'US';
          const countryMap: {[key: string]: string} = {
            'India': 'IN',
            'United States': 'US',
            'United States of America': 'US',
            'Canada': 'CA',
            'United Kingdom': 'GB',
            'Australia': 'AU'
          };
          setCountry(countryMap[countryValue] || countryValue);
          console.log('[Checkout] Billing address populated from billingAddress (api)');
        }
      }
    }
  }, [user, isLoading]);

  // Calculate pricing based on subscription or course
  const subscriptionPrice = subscriptionFromState 
    ? (subscriptionFromState.discount?.final_price ?? subscriptionFromState.price)
    : courseFromState?.price ?? 0;
  const originalPrice = subscriptionFromState?.price ?? courseFromState?.price ?? 0;
  const discount = subscriptionFromState?.discount?.final_price 
    ? originalPrice - subscriptionPrice 
    : 0;
  const subtotal = subscriptionPrice;
  const total = subtotal;

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

  const handleCouponApplied = (code: string) => {
    setAppliedCoupon(code);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors: {[key: string]: string} = {};

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

    // Validate billing address (all fields required per Stripe)
    if (!addressLine1 || addressLine1.trim().length < 3) {
      errors.addressLine1 = 'Please enter a valid street address';
      isValid = false;
    }

    if (!city || city.trim().length < 2) {
      errors.city = 'Please enter your city';
      isValid = false;
    }

    if (!state || state.trim().length < 2) {
      errors.state = 'Please enter your state/province';
      isValid = false;
    }

    if (!postalCode || postalCode.trim().length < 3) {
      errors.postalCode = 'Please enter a valid postal/ZIP code';
      isValid = false;
    }

    if (!country || country.trim().length !== 2) {
      errors.country = 'Please select a country';
      isValid = false;
    }

    setAddressErrors(errors);
    return isValid;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    // Clear any previous error
    setPaymentError('');
    setIsProcessing(true);

    try {
      let checkoutUrl: string | undefined;

      // Prepare billing address in Stripe format
      const billingAddressData = addressLine1 && city && state && postalCode && country ? {
        line1: addressLine1,
        line2: addressLine2 || undefined,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country
      } : undefined;

      if (isSubscription && subscriptionFromState) {
        // Handle subscription purchase
        console.log('[Checkout] Initiating subscription purchase:', subscriptionFromState.id);
        
        // Use applied coupon from component (which may be from subscription discount or user input)
        // If no applied coupon but subscription has discount promotion code, use that as fallback
        const promotionCode = appliedCoupon 
          || subscriptionFromState.discount?.stripe_promotion_code_id 
          || undefined;
        
        const purchaseResponse = await initiatePurchase(
          subscriptionFromState.id,
          name,
          email,
          subscriptionFromState.discount?.id,
          promotionCode, // promotion_code from discount or user input
          billingAddressData, // billing_address
          saveAddress // save_address flag
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
          appliedCoupon || undefined, // promotion_code from coupon
          billingAddressData, // billing_address
          saveAddress // save_address flag
        );

        console.log('[Checkout] Course purchase response:', purchaseResponse);

        // Check for both 'status' and 'success' to handle different API response formats
        const isSuccess = (purchaseResponse as any).status === true || purchaseResponse.success === true;
        
        if (isSuccess && purchaseResponse.data?.checkout_url) {
          checkoutUrl = purchaseResponse.data.checkout_url;
          console.log('[Checkout] Course checkout URL received:', checkoutUrl);
        } else {
          console.error('[Checkout] Course purchase failed:', {
            isSuccess,
            hasCheckoutUrl: !!purchaseResponse.data?.checkout_url,
            message: purchaseResponse.message,
            dataMessage: (purchaseResponse as any).data?.message,
            fullResponse: purchaseResponse
          });
          throw new Error(
            purchaseResponse.message || 
            (purchaseResponse as any).data?.message || 
            'Failed to get checkout URL for course'
          );
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
      
      // Extract error message from various possible response structures
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'Failed to initiate payment. Please try again.';
      
      setPaymentError(errorMessage);
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

  // Show error if no course or subscription selected
  if (!courseFromState && !subscriptionFromState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-16">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Item Selected</h1>
            <p className="text-gray-600 mb-6">Please select a course or subscription to proceed with checkout.</p>
            <PrimaryButton
              onClick={() => navigate(isSubscription ? '/' : '/courses')}
              size="lg"
              icon={ArrowLeft}
              iconPosition="left"
            >
              {isSubscription ? 'Back to Home' : 'Browse Courses'}
            </PrimaryButton>
          </div>
        </div>
        <Footer />
      </div>
    );
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
                      {subscriptionFromState.discount && (
                        <>
                          {subscriptionFromState.discount.discount_percent && (
                            <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                              {subscriptionFromState.discount.discount_percent}% OFF
                            </div>
                          )}
                          {subscriptionFromState.discount.discount_amount && !subscriptionFromState.discount.discount_percent && (
                            <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                              ${subscriptionFromState.discount.discount_amount.toFixed(2)} OFF
                            </div>
                          )}
                        </>
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
                ) : courseFromState ? (
                  <div className="flex gap-4">
                    <img
                      src={courseFromState.image || courseFromState.thumbnail_url || ''}
                      alt={courseFromState.name || courseFromState.title || 'Course'}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {courseFromState.name || courseFromState.title || 'Course'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {courseFromState.description}
                      </p>
                    </div>
                  </div>
                ) : null}
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

              {/* Coupon Section */}
              <CouponInput
                discount={subscriptionFromState?.discount || null}
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
                disabled={isProcessing}
              />

              {/* Billing Address Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Billing Address
                </h2>
                <div className="space-y-4">
                  {/* Address Line 1 */}
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={addressLine1}
                      onChange={(e) => {
                        setAddressLine1(e.target.value);
                        if (addressErrors.addressLine1) {
                          setAddressErrors({...addressErrors, addressLine1: ''});
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        addressErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {addressErrors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-600">{addressErrors.addressLine1}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (addressErrors.city) {
                            setAddressErrors({...addressErrors, city: ''});
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          addressErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="New York"
                      />
                      {addressErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
                      )}
                    </div>

                    {/* State/Province */}
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          if (addressErrors.state) {
                            setAddressErrors({...addressErrors, state: ''});
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          addressErrors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="NY"
                      />
                      {addressErrors.state && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Postal/ZIP Code */}
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Postal/ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          if (addressErrors.postalCode) {
                            setAddressErrors({...addressErrors, postalCode: ''});
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          addressErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10001"
                      />
                      {addressErrors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.postalCode}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          if (addressErrors.country) {
                            setAddressErrors({...addressErrors, country: ''});
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          addressErrors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="NL">Netherlands</option>
                        <option value="BE">Belgium</option>
                        <option value="CH">Switzerland</option>
                        <option value="AT">Austria</option>
                        <option value="SE">Sweden</option>
                        <option value="NO">Norway</option>
                        <option value="DK">Denmark</option>
                        <option value="FI">Finland</option>
                        <option value="PL">Poland</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="JP">Japan</option>
                        <option value="KR">South Korea</option>
                        <option value="SG">Singapore</option>
                        <option value="NZ">New Zealand</option>
                        <option value="BR">Brazil</option>
                        <option value="MX">Mexico</option>
                        <option value="AR">Argentina</option>
                      </select>
                      {addressErrors.country && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.country}</p>
                      )}
                    </div>
                  </div>

                  {/* Save Address Checkbox */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      name="saveAddress"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="saveAddress" className="text-sm text-gray-700 cursor-pointer">
                      Save this address for future purchases
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Message Display */}
              {paymentError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 font-semibold">⚠</span>
                    <span>{paymentError}</span>
                  </p>
                </div>
              )}

              {/* Proceed to Payment Button */}
              <PrimaryButton
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                isLoading={isProcessing}
                size="lg"
                fullWidth
                icon={ArrowRight}
                iconPosition="right"
                className="gap-2"
              >
                {isProcessing ? 'Redirecting to Stripe...' : 'Proceed to Payment'}
              </PrimaryButton>
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
                    {subscriptionFromState.discount && (
                      <div className="mt-2">
                        {subscriptionFromState.discount.discount_percent && (
                          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-2">
                            {subscriptionFromState.discount.discount_percent}% Discount Applied
                          </div>
                        )}
                        {subscriptionFromState.discount.discount_amount && !subscriptionFromState.discount.discount_percent && (
                          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-2">
                            ${subscriptionFromState.discount.discount_amount.toFixed(2)} Discount Applied
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : courseFromState ? (
                  <div className="flex gap-4 mb-4">
                    <img
                      src={courseFromState.image || courseFromState.thumbnail_url || ''}
                      alt={courseFromState.name || courseFromState.title || 'Course'}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {courseFromState.name || courseFromState.title || 'Course'}
                      </h3>
                      <p className="text-sm text-gray-600">Full Course Access</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                {subscriptionFromState?.discount?.final_price && originalPrice > subscriptionPrice && (
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
                    <span>
                      Discount
                      {subscriptionFromState?.discount?.discount_percent && (
                        <span className="text-xs ml-1">({subscriptionFromState.discount.discount_percent}%)</span>
                      )}
                    </span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
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
