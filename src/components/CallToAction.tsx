import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Subscription } from '../api/subscription';
import { useAuth } from '../contexts/AuthContext';
import { encodeToBase64 } from '../utils/encoding';

interface CallToActionProps {
  subscription: Subscription | null;
  isLoading: boolean;
}

export default function CallToAction({ subscription, isLoading }: CallToActionProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="subscription" ref={sectionRef} className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"></div>
      
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-pink-500/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 via-transparent to-purple-500/20"></div>

      {/* Animated Blobs with Better Positioning */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[110px] opacity-25 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Radial Gradient Overlay for Depth */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`flex justify-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Left Side - Subscription Card */}
          <div className="flex justify-center">
            {isLoading ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-white/20 shadow-2xl max-w-sm w-full flex items-center justify-center min-h-[280px] sm:min-h-[380px] md:min-h-[500px]">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : subscription ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border-2 border-white/20 shadow-2xl max-w-sm w-full relative overflow-hidden">
                {/* Discount Badge Overlay */}
                {subscription.discount && subscription.discount.discount_percent && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold px-6 py-2 shadow-lg transform rotate-12 translate-x-2 -translate-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{subscription.discount.discount_percent}%</span>
                          <span className="text-xs">OFF</span>
                        </div>
                      </div>
                      {/* Ribbon tail effect */}
                      <div className="absolute top-full right-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[8px] border-t-emerald-700 transform rotate-12 translate-x-2"></div>
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6 sm:mb-8">
                  {/* Subscription Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white leading-snug px-1">
                    {subscription.name}
                  </h3>
                  <div className="mb-3">
                    {subscription.discount && subscription.discount.final_price !== null ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap justify-center">
                          <span className="text-2xl sm:text-3xl font-bold text-white line-through opacity-60">
                            ${subscription.price}
                          </span>
                          <span className="text-4xl sm:text-5xl font-bold text-white">
                            ${subscription.discount.final_price}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-4xl sm:text-5xl font-bold text-white">
                        ${subscription.price}
                      </span>
                    )}
                    <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2">
                      <span className="text-base sm:text-lg text-white font-semibold">
                        {Math.floor(subscription.duration_days / 30)} {Math.floor(subscription.duration_days / 30) === 1 ? 'month' : 'months'}
                      </span>
                    </div>
                  </div>
                </div>

                {subscription.includes && subscription.includes.length > 0 && (
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
                    {subscription.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 text-white">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="leading-relaxed text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!subscription) return;
                    
                    // Always encode subscription data in URL (even when authenticated) so it persists after logout/login
                    const checkoutUrl = '/checkout';
                    
                    // Encode subscription data using UTF-8 safe encoding
                    const subscriptionJson = JSON.stringify({ subscription });
                    const encodedSubscription = encodeToBase64(subscriptionJson);
                    
                    // Build checkout URL with subscription data as query param
                    const checkoutUrlWithData = `${checkoutUrl}?subscription=${encodeURIComponent(encodedSubscription)}`;
                    
                    // Check if user is authenticated
                    if (!authLoading && isAuthenticated) {
                      // User is authenticated - navigate directly to checkout with subscription data in URL
                      navigate(checkoutUrlWithData);
                    } else {
                      // User is not authenticated - encode checkout URL in return_url query param
                      const returnUrl = `${window.location.origin}${checkoutUrlWithData}`;
                      
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
                  }}
                  disabled={!subscription}
                  className="group w-full px-5 py-3 sm:px-8 sm:py-4 bg-white text-blue-600 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Subscribe Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 md:h-32 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
    </section>
  );
}
