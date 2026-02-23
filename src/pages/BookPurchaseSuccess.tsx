import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, Package, MapPin, Download, ExternalLink, CreditCard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PrimaryButton from '../components/PrimaryButton';
import { getBookPurchaseSuccess, BookPurchaseSuccessDetails } from '../api/books';
import { api } from '../api';

export default function BookPurchaseSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState<BookPurchaseSuccessDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMyOrdersClick = () => {
    const myLearningUrl = import.meta.env.VITE_MY_LEARNING_URL;
    if (myLearningUrl) {
      const token = api.getToken();
      const ordersPath = '/orders';
      const url = token 
        ? `${myLearningUrl}${ordersPath}?token=${encodeURIComponent(token)}` 
        : `${myLearningUrl}${ordersPath}`;
      window.open(url, '_blank');
    } else {
      navigate('/orders');
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
        const response = await getBookPurchaseSuccess(sessionId);
        
        if (response.status && response.data) {
          setPurchaseData(response.data);
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  };


  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white rounded-xl p-10 max-w-sm w-full border border-gray-200">
              <div className="w-14 h-14 bg-blue-50 rounded-full mx-auto mb-5 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white rounded-xl p-10 max-w-sm w-full border border-gray-200">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <PrimaryButton
                onClick={() => navigate('/')}
                size="md"
                fullWidth
              >
                Go Home
              </PrimaryButton>
            </div>
          </div>
        ) : purchaseData ? (
          <div className="space-y-8 mt-16">
            {/* Success Header */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      Order Confirmed
                    </h1>
                    <p className="text-sm text-gray-600">
                      Your book order has been successfully placed and is being processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Book Details & Shipping Address Combined */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-8">
                    <div className="mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Order ID</p>
                          <p className="text-sm font-mono text-gray-900 font-semibold">
                            {purchaseData.order.id}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      {purchaseData.book?.cover_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={purchaseData.book.cover_url}
                            alt={purchaseData.book.title}
                            className="w-52 h-72 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                            {purchaseData.book?.title}
                          </h2>
                          {purchaseData.book?.author && (
                            <p className="text-base text-gray-600">
                              by <span className="font-semibold text-gray-900">{purchaseData.book.author.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Shipping Address */}
                        {purchaseData.address && (
                          <div className="pt-6 border-t border-gray-200">
                            <div className="bg-gradient-to-br  rounded-xl  p-5">
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center">
                                   <MapPin className="w-5 h-5 text-gray-700" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                                      {purchaseData.address.address_line1}
                                      {purchaseData.address.address_line2 && (
                                        <span className="text-gray-600">, {purchaseData.address.address_line2}</span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {purchaseData.address.city}, {purchaseData.address.state} {purchaseData.address.postal_code}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">{purchaseData.address.country}</p>
                                  </div>
                                  {(purchaseData.address.phone_number || purchaseData.address.landmark) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200/60 space-y-2">
                                      {purchaseData.address.phone_number && (
                                        <p className="text-sm text-gray-700">
                                          <span className="font-medium text-gray-900">Phone:</span> {purchaseData.address.phone_number}
                                        </p>
                                      )}
                                      {purchaseData.address.landmark && (
                                        <p className="text-sm text-gray-700">
                                          <span className="font-medium text-gray-900">Landmark:</span> {purchaseData.address.landmark}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary & Actions */}
              <div>
                <div className="bg-white rounded-xl border border-gray-200 sticky top-6 overflow-hidden">
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Summary</h3>
                      <p className="text-xs text-gray-500">Transaction completed successfully</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Payment ID</p>
                          <p className="text-sm font-mono text-gray-900 font-semibold">
                            {purchaseData.payment.id}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                          <span className="text-3xl font-bold text-gray-900 tracking-tight">
                            {formatCurrency(purchaseData.amount_total, purchaseData.currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {purchaseData.payment.receipt_url ? (
                        <PrimaryButton
                          onClick={() => {
                            if (purchaseData.payment.receipt_url) {
                              window.open(purchaseData.payment.receipt_url, '_blank');
                            }
                          }}
                          size="md"
                          fullWidth
                          icon={Download}
                          iconPosition="right"
                          className="font-medium"
                        >
                          Download Receipt
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          size="md"
                          fullWidth
                          icon={Download}
                          iconPosition="right"
                          disabled
                          className="font-medium"
                        >
                          Download Receipt
                        </PrimaryButton>
                      )}
                      
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMyOrdersClick();
                        }}
                        className="flex items-center justify-center gap-2 w-full text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium py-3 px-4 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                      >
                        <span>View My Orders</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      
                      <button
                        onClick={() => navigate('/')}
                        className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium py-3 px-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      >
                        Return to Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
