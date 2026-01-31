import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormikProps } from 'formik';
import { CheckCircle2, ArrowLeft, Shield, Clock, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CouponInput from '../components/CouponInput';
import ContactInfoForm from '../components/forms/ContactInfoForm';
import BillingAddressForm from '../components/forms/BillingAddressForm';
import ShippingAddressForm from '../components/forms/ShippingAddressForm';
import { Book as BookType } from '../api/course';
import { useAuth } from '../contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import { decodeFromBase64, encodeToBase64 } from '../utils/encoding';
import { getUserInfo } from '../utils/userInfo';

export default function BookCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, getRedirectState, clearRedirectUrl } = useAuth();
  
  // Get book from location state, query params, or restored redirect state
  const locationState = location.state as { book?: BookType } | undefined;
  const redirectState = getRedirectState();
  
  // Check URL query parameters for book data (from redirect after login)
  const getDataFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const bookParam = params.get('book');
    
    let bookFromQuery: BookType | null = null;
    
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
    
    if (bookParam) {
      try {
        const parsedData = decodeAndParse(bookParam);
        bookFromQuery = parsedData.book || null;
      } catch (error) {
        console.error('[BookCheckout] Error parsing book from query param:', error);
      }
    }
    
    return { bookFromQuery };
  };
  
  const { bookFromQuery } = getDataFromQuery();
  
  // Prioritize: location state > query params > redirect state
  const bookFromState = locationState?.book || bookFromQuery || redirectState?.book;
  // Clear redirect state if we have it (we've successfully restored it)
  useEffect(() => {
    if (redirectState && isAuthenticated) {
      clearRedirectUrl();
    }
  }, [redirectState, isAuthenticated, clearRedirectUrl]);
  
  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Build return URL with book data in query params
      const baseCheckoutUrl = '/book-checkout';
      let returnUrl = `${window.location.origin}${baseCheckoutUrl}`;
      
      // Encode book data in query parameters using UTF-8 safe encoding
      if (bookFromState) {
        const bookJson = JSON.stringify({ book: bookFromState });
        const encodedBook = encodeToBase64(bookJson);
        returnUrl = `${returnUrl}?book=${encodeURIComponent(encodedBook)}`;
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
  }, [isAuthenticated, isLoading, navigate, bookFromState]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<{
    discount_type?: 'amount' | 'percent';
    discount_value?: number;
    currency?: string;
  } | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  // Printing and Shipping charges (will be calculated via API later)
  // TODO: Calculate these via API based on shipping address and book details
  const [printingCharges] = useState<number>(0);
  const [shippingCharges] = useState<number>(0);
  
  // Form refs for accessing form values
  const contactFormRef = useRef<FormikProps<{ name: string; email: string }>>(null);
  const billingFormRef = useRef<FormikProps<{
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>>(null);
  const shippingFormRef = useRef<FormikProps<{
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
        contact: { name: '', email: '' },
        billing: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US',
        },
        shipping: {
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
    const defaultAddress = userInfo.billingAddress || {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    };
    
    return {
      contact: {
        name: userInfo.name,
        email: userInfo.email,
      },
      billing: defaultAddress,
      shipping: defaultAddress,
    };
  };

  const initialFormValues = getInitialFormValues();
  
  // Track current billing address for shipping form (stable reference)
  const [currentBillingAddress, setCurrentBillingAddress] = useState(initialFormValues.billing);
  
  // Update current billing address when initial values change
  useEffect(() => {
    setCurrentBillingAddress(initialFormValues.billing);
  }, [initialFormValues.billing]);

  // Calculate pricing based on book
  const basePrice = bookFromState?.price ?? 0;
  const originalPrice = basePrice;
  
  // Calculate discount from coupon
  let couponDiscountAmount = 0;
  if (couponDiscount) {
    if (couponDiscount.discount_type === 'amount' && couponDiscount.discount_value) {
      // discount_value is in cents, convert to dollars
      couponDiscountAmount = couponDiscount.discount_value / 100;
    } else if (couponDiscount.discount_type === 'percent' && couponDiscount.discount_value) {
      // discount_value is percentage
      couponDiscountAmount = (basePrice * couponDiscount.discount_value) / 100;
    }
  }
  
  const subtotal = Math.max(0, basePrice - couponDiscountAmount);
  const totalDiscount = couponDiscountAmount;
  const total = subtotal + printingCharges + shippingCharges;

  const handleContactInfoSubmit = (values: { name: string; email: string }) => {
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
    console.log('[BookCheckout] Billing address updated:', values);
    // Update current billing address state for shipping form
    setCurrentBillingAddress(values);
  };

  const handleShippingAddressSubmit = (values: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    // Formik handles validation, values are stored in form state
    console.log('[BookCheckout] Shipping address updated:', values);
  };

  const handleCouponApplied = (discountInfo: { code: string; discount_type?: 'amount' | 'percent'; discount_value?: number; currency?: string }) => {
    setAppliedCoupon(discountInfo.code);
    setCouponDiscount({
      discount_type: discountInfo.discount_type,
      discount_value: discountInfo.discount_value,
      currency: discountInfo.currency
    });
    console.log('[BookCheckout] Coupon applied:', discountInfo.code);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setCouponDiscount(null);
  };

  const handleProceedToPayment = async () => {
    // Validate all forms
    const contactErrors = await contactFormRef.current?.validateForm();
    const billingErrors = await billingFormRef.current?.validateForm();
    const shippingErrors = sameAsBilling ? null : await shippingFormRef.current?.validateForm();

    if (contactErrors && Object.keys(contactErrors).length > 0) {
      contactFormRef.current?.setTouched({
        name: true,
        email: true,
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
      return;
    }

    if (shippingErrors && Object.keys(shippingErrors).length > 0) {
      shippingFormRef.current?.setTouched({
        addressLine1: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      });
      return;
    }

    // Get form values
    const contactValues = contactFormRef.current?.values || { name: '', email: '' };
    const billingValues = billingFormRef.current?.values || {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    };
    const shippingValues = sameAsBilling 
      ? billingValues 
      : (shippingFormRef.current?.values || billingValues);

    // Clear any previous error
    setPaymentError('');
    setIsProcessing(true);

    try {
      // TODO: Implement book purchase API call
      // For now, just log the data
      console.log('[BookCheckout] Book purchase data:', {
        book: bookFromState,
        contact: contactValues,
        billing: billingValues,
        shipping: shippingValues,
        printingCharges,
        shippingCharges,
        total,
      });

      // TODO: Replace with actual API call
      // const purchaseResponse = await initiateBookPurchase(...);
      
      throw new Error('Book purchase API not yet implemented');
    } catch (error: any) {
      console.error('[BookCheckout] Error initiating payment:', error);
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

  // Show error if no book selected
  if (!bookFromState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-16">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Book Selected</h1>
            <p className="text-gray-600 mb-6">Please select a book to proceed with checkout.</p>
            <PrimaryButton
              onClick={() => navigate('/courses')}
              size="lg"
              icon={ArrowLeft}
              iconPosition="left"
            >
              Back to Courses
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
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Checkout Form (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl  p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Complete Your Book Purchase
                </h1>
                <p className="text-gray-600">
                  Secure checkout powered by Stripe
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
                {bookFromState && (
                  <div className="flex gap-4">
                    {bookFromState.cover_url && (
                      <img
                        src={bookFromState.cover_url}
                        alt={bookFromState.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {bookFromState.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {bookFromState.description}
                      </p>
                      {bookFromState.author && (
                        <p className="text-sm text-gray-500 mt-1">
                          by {bookFromState.author.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <ContactInfoForm
                ref={contactFormRef}
                initialValues={initialFormValues.contact}
                onSubmit={handleContactInfoSubmit}
              />

              {/* Coupon Section */}
              <CouponInput
                discount={null}
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

              {/* Shipping Address Section */}
              <ShippingAddressForm
                ref={shippingFormRef}
                initialValues={initialFormValues.shipping}
                billingAddress={currentBillingAddress}
                onSubmit={handleShippingAddressSubmit}
                sameAsBilling={sameAsBilling}
                onSameAsBillingChange={setSameAsBilling}
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
                {bookFromState && (
                  <div className="flex gap-4 mb-4">
                    {bookFromState.cover_url && (
                      <img
                        src={bookFromState.cover_url}
                        alt={bookFromState.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {bookFromState.title}
                      </h3>
                      <p className="text-sm text-gray-600">Physical Book</p>
                      {bookFromState.author && (
                        <p className="text-xs text-gray-500 mt-1">
                          by {bookFromState.author.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                {couponDiscount && originalPrice > subtotal && (
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Original Price</span>
                    <span className="line-through">${originalPrice.toFixed(2)}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount
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
                  <span>Book Price</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Printing Charges</span>
                  <span className="font-medium">${printingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charges</span>
                  <span className="font-medium">${shippingCharges.toFixed(2)}</span>
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
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Physical printed book</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>High-quality printing</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Secure packaging</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Tracking information provided</span>
                  </li>
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
