import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CallToAction() {
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
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Left Side - Subscription Card */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border-2 border-white/20 shadow-2xl max-w-sm w-full">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-1 bg-blue-500/30 rounded-full text-blue-200 text-sm font-semibold mb-6">
                  Annual Subscription
                </div>
                <div className="mb-3">
                  <span className="text-5xl font-bold text-white">$129</span>
                  <span className="text-2xl text-blue-200 ml-2">/year</span>
                </div>
                <p className="text-blue-200 text-lg">Access to All Courses</p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Full access to all courses for 1 year</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">New courses added regularly</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Expert instructor support</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Downloadable resources & materials</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Progress tracking & analytics</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Access to exclusive community</span>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="leading-relaxed text-sm">Mobile & desktop access</span>
                </div>
              </div>

              <button className="group w-full px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                Subscribe Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Right Side - Title and Description */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Limited Time Offer</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Future?
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of successful students and start your learning journey today. Get instant access to all courses with our annual subscription.
            </p>

            <div className="flex flex-wrap gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>14-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
    </section>
  );
}
