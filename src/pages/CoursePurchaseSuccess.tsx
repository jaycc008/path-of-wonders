import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2, User, Mail, Calendar, Receipt } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PrimaryButton from '../components/PrimaryButton';
import { getCoursePurchaseSuccess } from '../api/course';
import { api } from '../api';

/** Backend may return a Stripe-like session or a slim course payload (see api/course CoursePurchaseSuccessDetails). */
type SuccessPayload = Record<string, unknown>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function getCurrencyCode(payload: SuccessPayload): string {
  const c = payload.currency;
  if (typeof c === 'string' && c.trim().length > 0) return c.toUpperCase();
  return 'USD';
}

function getAmountCents(payload: SuccessPayload): number | null {
  const n = payload.amount_total;
  if (typeof n === 'number' && Number.isFinite(n)) return n;
  return null;
}

function getLineDescription(payload: SuccessPayload): string | null {
  const lineItems = payload.line_items;
  if (isRecord(lineItems)) {
    const data = lineItems.data;
    if (Array.isArray(data) && data.length > 0 && isRecord(data[0])) {
      const d = data[0].description;
      if (typeof d === 'string' && d.length) return d;
    }
  }
  const courseName = payload.course_name;
  if (typeof courseName === 'string' && courseName.length) return courseName;
  const title = payload.title;
  if (typeof title === 'string' && title.length) return title;
  return null;
}

function getCreatedUnix(payload: SuccessPayload): number {
  const c = payload.created;
  if (typeof c === 'number' && Number.isFinite(c)) return c;
  return Math.floor(Date.now() / 1000);
}

function getPaymentStatusLabel(payload: SuccessPayload): string {
  const p = payload.payment_status;
  if (typeof p === 'string' && p.length) return p;
  return 'paid';
}

function getCustomerDetails(payload: SuccessPayload): {
  name?: string;
  email?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
} {
  const cd = payload.customer_details;
  if (isRecord(cd)) {
    const name = cd.name;
    const email = cd.email;
    const addr = cd.address;
    return {
      name: typeof name === 'string' ? name : undefined,
      email: typeof email === 'string' ? email : undefined,
      address: isRecord(addr)
        ? {
            line1: typeof addr.line1 === 'string' ? addr.line1 : undefined,
            city: typeof addr.city === 'string' ? addr.city : undefined,
            state: typeof addr.state === 'string' ? addr.state : undefined,
            postal_code: typeof addr.postal_code === 'string' ? addr.postal_code : undefined,
            country: typeof addr.country === 'string' ? addr.country : undefined,
          }
        : undefined,
    };
  }
  return {};
}

function getInvoiceId(payload: SuccessPayload): string | undefined {
  const inv = payload.invoice;
  if (typeof inv === 'string' && inv.length) return inv;
  return undefined;
}

function verifySuccessResponse(response: { status?: boolean; success?: boolean; data?: unknown; message?: string }): boolean {
  const ok = response.status === true || response.success === true;
  return ok && isRecord(response.data);
}

export default function CoursePurchaseSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<SuccessPayload | null>(null);
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
        const response = await getCoursePurchaseSuccess(sessionId);

        if (verifySuccessResponse(response)) {
          setPaymentData(response.data as SuccessPayload);
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
                    <p className="text-green-100">Your course has been purchased</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-8">
                {/* Amount Paid */}
                {(() => {
                  const amountCents = getAmountCents(paymentData);
                  if (amountCents == null) return null;
                  return (
                    <div className="text-center mb-8 pb-8 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
                      <p className="text-4xl font-bold text-gray-900">
                        {(amountCents / 100).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: getCurrencyCode(paymentData),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  );
                })()}

                {/* Course Details */}
                {getLineDescription(paymentData) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 font-medium">{getLineDescription(paymentData)}</p>
                      {typeof paymentData.course_description === 'string' && paymentData.course_description.length > 0 && (
                        <p className="text-gray-600 text-sm mt-2">{paymentData.course_description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                {(() => {
                  const details = getCustomerDetails(paymentData);
                  const hasAny = details.name || details.email || details.address;
                  if (!hasAny) return null;
                  return (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    {details.name && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{details.name}</span>
                      </div>
                    )}
                    {details.email && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{details.email}</span>
                      </div>
                    )}
                    {details.address && (
                      <div className="flex items-start gap-3 text-gray-700">
                        <div className="w-5 h-5 text-gray-400 mt-0.5">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="text-sm">
                          {details.address.line1 && <p>{details.address.line1}</p>}
                          <p>
                            {[details.address.city, details.address.state, details.address.postal_code]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {details.address.country && <p>{details.address.country}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                  );
                })()}

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
                        {new Date(getCreatedUnix(paymentData) * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {getInvoiceId(paymentData) && (
                      <div className="flex items-center justify-between text-gray-700">
                        <div className="flex items-center gap-3">
                          <Receipt className="w-5 h-5 text-gray-400" />
                          <span>Invoice ID</span>
                        </div>
                        <span className="font-medium font-mono text-sm">{getInvoiceId(paymentData)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-gray-700">
                      <span>Payment Status</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold capitalize">
                        {getPaymentStatusLabel(paymentData)}
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

