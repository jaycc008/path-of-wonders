import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Play, Loader2, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SubscriptionSuccessDetails } from '../api/subscription';
import courseThumbnail from '../assets/images/watch_now.png';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  
  // Mock data for design preview
  const mockData: SubscriptionSuccessDetails = {
    subscription_name: 'Pro Plan',
    course_thumbnail: courseThumbnail,
    course_name: 'Complete Consciousness Course',
    course_description: 'Transform your understanding of consciousness with our comprehensive course designed to unlock your full potential. Learn advanced techniques, meditation practices, and scientific insights that will revolutionize your perspective on life.',
    invoice_url: 'https://invoice.example.com/invoice.pdf',
    invoice_pdf_url: 'https://invoice.example.com/invoice.pdf',
  };

  const [subscriptionDetails] = useState<SubscriptionSuccessDetails | null>(mockData);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Uncomment below when API is ready
  // useEffect(() => {
  //   const fetchSubscriptionDetails = async () => {
  //     if (!sessionId) {
  //       setError('Session ID not found');
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       setIsLoading(true);
  //       const response = await getSubscriptionSuccess(sessionId);
  //       if (response.status && response.data) {
  //         setSubscriptionDetails(response.data);
  //       } else {
  //         setError(response.message || 'Failed to load subscription details');
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch subscription details:', err);
  //       setError('Failed to load subscription details');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchSubscriptionDetails();
  // }, [sessionId]);

  const handleStartCourse = () => {
    // Navigate to course page or dashboard
    navigate('/courses');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto my-10 px-6 py-16 md:py-24">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your subscription details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white rounded-2xl p-12 shadow-lg max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        ) : subscriptionDetails ? (
          <div className="bg-white rounded-xl overflow-hidden">
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

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left Side - Course Thumbnail and Start Course Button */}
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden group">
                  {subscriptionDetails.course_thumbnail ? (
                    <img
                      src={subscriptionDetails.course_thumbnail}
                      alt={subscriptionDetails.course_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Play className="w-20 h-20 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Course Available</span>
                    </div>
                  </div>
                </div>
                
                {/* Start Course Button */}
                <button
                  onClick={handleStartCourse}
                  className="group w-full max-w-md px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Start Course Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Right Side - Course Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                    {subscriptionDetails.subscription_name}
                  </div>
                  
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {subscriptionDetails.course_name}
                  </h2>
                  
                  {subscriptionDetails.course_description && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                      {subscriptionDetails.course_description}
                    </p>
                  )}

                  {/* Course Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Full course access</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Lifetime access to materials</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Invoice URLs */}
                <div className="pt-6 border-t border-gray-200">
                  {/* Invoice Links */}
                  {(subscriptionDetails.invoice_url || subscriptionDetails.invoice_pdf_url) && (
                    <div className="flex flex-wrap gap-3">
                      {subscriptionDetails.invoice_url && (
                        <a
                          href={subscriptionDetails.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          View Invoice
                        </a>
                      )}
                      {subscriptionDetails.invoice_pdf_url && (
                        <a
                          href={subscriptionDetails.invoice_pdf_url}
                          download
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      )}
                    </div>
                  )}
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

