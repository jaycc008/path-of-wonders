import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormikProps } from 'formik';
import { CheckCircle2, ArrowLeft, Shield, Clock, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CouponInput from '../components/CouponInput';
import ContactInfoForm from '../components/forms/ContactInfoForm';
import BillingAddressForm from '../components/forms/BillingAddressForm';
import { Subscription, initiatePurchase } from '../api/subscription';
import { initiateCoursePurchase } from '../api/course';
import { useAuth } from '../contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import { decodeFromBase64, encodeToBase64 } from '../utils/encoding';
import { getUserInfo } from '../utils/userInfo';

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

  // Always open checkout from top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  
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
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [formValidationError, setFormValidationError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<{
    discount_type?: 'amount' | 'percent';
    discount_value?: number;
    currency?: string;
  } | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const validationAlertRef = useRef<HTMLDivElement>(null);
  
  // Form refs for accessing form values
  const contactFormRef = useRef<FormikProps<{ name: string; email: string; phone: string }>>(null);
  const billingFormRef = useRef<FormikProps<{
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>>(null);

  // Get initial form values from user data
  const getInitialFormValues = () => {
    if (isLoading) {
      return {
        contact: { name: '', email: '', phone: '' },
        billing: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US',
        },
      };
    }

    const userInfo = getUserInfo(user);
    return {
      contact: {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || '',
      },
      billing: userInfo.billingAddress || {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
      },
    };
  };

  const initialFormValues = getInitialFormValues();

  // Calculate pricing based on subscription or course
  const basePrice = subscriptionFromState 
    ? (subscriptionFromState.discount?.final_price ?? subscriptionFromState.price)
    : courseFromState?.price ?? 0;
  const originalPrice = subscriptionFromState?.price ?? courseFromState?.price ?? 0;
  
  // Calculate discount from subscription discount
  const subscriptionDiscount = subscriptionFromState?.discount?.final_price 
    ? originalPrice - basePrice 
    : 0;
  
  // Calculate discount from coupon (if applied and not from subscription)
  let couponDiscountAmount = 0;
  if (couponDiscount && !subscriptionFromState?.discount) {
    if (couponDiscount.discount_type === 'amount' && couponDiscount.discount_value) {
      // discount_value is in cents, convert to dollars
      couponDiscountAmount = couponDiscount.discount_value / 100;
    } else if (couponDiscount.discount_type === 'percent' && couponDiscount.discount_value) {
      // discount_value is percentage
      couponDiscountAmount = (basePrice * couponDiscount.discount_value) / 100;
    }
  }
  
  const subtotal = Math.max(0, basePrice - couponDiscountAmount);
  const totalDiscount = subscriptionDiscount + couponDiscountAmount;
  const total = subtotal;

  const handleContactInfoSubmit = (values: { name: string; email: string; phone: string }) => {
    // Formik handles validation, values are stored in form state
    console.log('[Checkout] Contact info updated:', values);
  };

  const handleBillingAddressSubmit = (values: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    // Formik handles validation, values are stored in form state
    console.log('[Checkout] Billing address updated:', values);
  };

  const handleCouponApplied = (discountInfo: { code: string; discount_type?: 'amount' | 'percent'; discount_value?: number; currency?: string }) => {
    setAppliedCoupon(discountInfo.code);
    setCouponDiscount({
      discount_type: discountInfo.discount_type,
      discount_value: discountInfo.discount_value,
      currency: discountInfo.currency
    });
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setCouponDiscount(null);
  };

  const handleProceedToPayment = async () => {
    setFormValidationError('');

    // Validate all forms
    const contactErrors = await contactFormRef.current?.validateForm();
    const billingErrors = await billingFormRef.current?.validateForm();

    if (contactErrors && Object.keys(contactErrors).length > 0) {
      contactFormRef.current?.setTouched({
        name: true,
        email: true,
        phone: true,
      });
      setFormValidationError('Please complete all required contact details above.');
      requestAnimationFrame(() => {
        validationAlertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    if (billingErrors && Object.keys(billingErrors).length > 0) {
      billingFormRef.current?.setTouched({
        addressLine1: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      });
      setFormValidationError('Please complete all required billing address fields above.');
      requestAnimationFrame(() => {
        validationAlertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    // Get form values
    const contactValues = contactFormRef.current?.values || { name: '', email: '', phone: '' };
    const billingValues = billingFormRef.current?.values || {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    };

    // Clear any previous error
    setPaymentError('');
    setIsProcessing(true);

    try {
      let checkoutUrl: string | undefined;

      // Prepare billing address in Stripe format
      const billingAddressData = {
        line1: billingValues.addressLine1,
        line2: billingValues.addressLine2 || undefined,
        city: billingValues.city,
        state: billingValues.state,
        postal_code: billingValues.postalCode,
        country: billingValues.country,
      };

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
          contactValues.name,
          contactValues.email,
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
          contactValues.name,
          contactValues.email,
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
      
      <div className="max-w-7xl mx-auto px-1 md:px-6 py-12 ">
       

        <div className="grid lg:grid-cols-3 gap-8 my-12">
            {/* Header */}
           
          {/* Left Side - Checkout Form (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl  p-3 md:p-10">
            

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
                        ${subtotal.toFixed(2)}
                      </div>
                      {(subscriptionFromState.discount?.final_price || couponDiscount) && originalPrice > subtotal && (
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
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {courseFromState.name || courseFromState.title || 'Course'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {courseFromState.description}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Contact Information */}
              <ContactInfoForm
                ref={contactFormRef}
                initialValues={initialFormValues.contact}
                onSubmit={handleContactInfoSubmit}
              />

              {/* Coupon Section */}
              <CouponInput
                discount={subscriptionFromState?.discount || null}
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
                disabled={isProcessing}
              />

              {/* Billing Address Section */}
              <BillingAddressForm
                ref={billingFormRef}
                initialValues={initialFormValues.billing}
                onSubmit={handleBillingAddressSubmit}
                onSaveAddressChange={setSaveAddress}
                saveAddress={saveAddress}
              />

              {/* Error Message Display */}
              {paymentError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 font-semibold">⚠</span>
                    <span>{paymentError}</span>
                  </p>
                </div>
              )}

              {/* Validation Alert (shown above proceed button) */}
              {formValidationError && (
                <div ref={validationAlertRef} className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900 flex items-start gap-2">
                    <span className="text-amber-700 font-semibold">⚠</span>
                    <span>{formValidationError} </span>
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
                  <div className="mb-4">
                    {(courseFromState.image || courseFromState.thumbnail_url) && (
                      <img
                        src={courseFromState.image || courseFromState.thumbnail_url}
                        alt={courseFromState.name || courseFromState.title || 'Course'}
                        className="w-full aspect-video rounded-lg object-cover mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {courseFromState.name || courseFromState.title || 'Course'}
                    </h3>
                    <p className="text-sm text-gray-600">Full Course Access</p>
                  </div>
                ) : null}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                {(subscriptionFromState?.discount?.final_price || couponDiscount) && originalPrice > subtotal && (
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Original Price</span>
                    <span className="line-through">${originalPrice.toFixed(2)}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount
                      {subscriptionFromState?.discount?.discount_percent && (
                        <span className="text-xs ml-1">({subscriptionFromState.discount.discount_percent}%)</span>
                      )}
                      {couponDiscount?.discount_type === 'percent' && couponDiscount.discount_value && (
                        <span className="text-xs ml-1">({couponDiscount.discount_value}%)</span>
                      )}
                      {couponDiscount?.discount_type === 'amount' && couponDiscount.discount_value && (
                        <span className="text-xs ml-1">(${(couponDiscount.discount_value / 100).toFixed(2)})</span>
                      )}
                    </span>
                    <span className="font-medium">-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
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
