import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2, User, Mail, Calendar, Receipt } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PrimaryButton from '../components/PrimaryButton';
import { getSubscriptionSuccess } from '../api/subscription';
import { api } from '../api';

interface PaymentData {
  amount_total: number;
  currency: string;
  customer: {
    name: string;
    email: string;
  };
  customer_details: {
    name: string;
    email: string;
    address?: {
      line1?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
  line_items: {
    data: Array<{
      description: string;
      amount_total: number;
    }>;
  };
  invoice?: string;
  created: number;
  payment_status: string;
  status: string;
  subscription?: {
    current_period_start: number;
    current_period_end: number;
    status: string;
  };
}

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMyLearningClick = () => {
    const myLearningUrl = import.meta.env.VITE_MY_LEARNING_URL;
    if (myLearningUrl) {
      const token = api.getToken();
      const url = token ? `${myLearningUrl}?token=${encodeURIComponent(token)}` : myLearningUrl;
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('Session ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getSubscriptionSuccess(sessionId);
        
        if (response.status && response.data) {
          // Store payment data (response.data is the Stripe checkout session object)
          setPaymentData(response.data as unknown as PaymentData);
        } else {
          setError(response.message || 'Failed to verify payment');
        }
      } catch (err: any) {
        console.error('Failed to verify payment:', err);
        setError(err.response?.data?.message || err.message || 'Failed to verify payment');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-center justify-center min-h-[60vh]">
          {isLoading ? (
            // Loading Skeleton
            <div className="text-center bg-white rounded-2xl p-12 shadow-xl max-w-md w-full">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-full mx-auto mb-8 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-full w-full mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Verifying payment...</span>
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="text-center bg-white rounded-2xl p-12 shadow-xl max-w-md w-full">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          ) : paymentData ? (
            // Success State with Payment Details
            <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full overflow-hidden mt-8">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Payment Successful!</h1>
                    <p className="text-green-100">Your subscription has been activated</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-8">
                {/* Amount Paid */}
                <div className="text-center mb-8 pb-8 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {(paymentData.amount_total / 100).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: paymentData.currency.toUpperCase(),
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>

                {/* Subscription Details */}
                {paymentData.line_items?.data?.[0] && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 font-medium">{paymentData.line_items.data[0].description}</p>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    {paymentData.customer_details?.name && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{paymentData.customer_details.name}</span>
                      </div>
                    )}
                    {paymentData.customer_details?.email && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{paymentData.customer_details.email}</span>
                      </div>
                    )}
                    {paymentData.customer_details?.address && (
                      <div className="flex items-start gap-3 text-gray-700">
                        <div className="w-5 h-5 text-gray-400 mt-0.5">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="text-sm">
                          {paymentData.customer_details.address.line1 && (
                            <p>{paymentData.customer_details.address.line1}</p>
                          )}
                          <p>
                            {[
                              paymentData.customer_details.address.city,
                              paymentData.customer_details.address.state,
                              paymentData.customer_details.address.postal_code,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {paymentData.customer_details.address.country && (
                            <p>{paymentData.customer_details.address.country}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-700">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>Payment Date</span>
                      </div>
                      <span className="font-medium">
                        {new Date(paymentData.created * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {paymentData.invoice && (
                      <div className="flex items-center justify-between text-gray-700">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-gray-400" />
                          <span>Invoice ID</span>
                        </div>
                        <span className="font-medium font-mono text-sm">{paymentData.invoice}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-gray-700">
                      <span>Payment Status</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold capitalize">
                        {paymentData.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <PrimaryButton
                    onClick={handleMyLearningClick}
                    size="lg"
                    fullWidth
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Go to My Learning
                  </PrimaryButton>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}

