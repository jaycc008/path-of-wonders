import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import watchNowImg from '../assets/images/watch_now.png';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50"
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-32 flex flex-col gap-6 md:gap-12 items-center">
        <div
          className={`w-full text-center transition-all duration-1000 mt-4 md:mt-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight gap-5">
            Awakening your true Potential
            <br />

          </h1>
          <div className="text-cyan-600 text-xl md:text-2xl lg:text-4xl my-3 md:my-6">The World's First Science-Backed Consciousness School</div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 w-full max-w-4xl">

          <div
            className={`flex flex-col md:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <button className="px-8 py-4 border-2 border-blue-600 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Start Learning Today
            </button>
            <button className="px-8 py-4 border-2 border-neutral-600 bg-white text-neutral-600 rounded-full font-semibold hover:bg-neutral-50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        <div
          className={`relative transition-all duration-1000 delay-300 flex justify-center items-center w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="relative group cursor-pointer w-full max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl p-1 md:p-4 border border-white/40 w-full">
              <div className="aspect-video rounded-xl flex items-center justify-center relative overflow-hidden w-full">
                <img 
                  src={watchNowImg} 
                  alt="Watch Now" 
                  className="absolute inset-0 w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-600"
                />
                {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div> */}
                <button className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="w-8 h-8 text-cyan-600 ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
          {/* Floating Cards Around Video */}
          <div className="hidden md:block absolute -bottom-6 -right-6 bg-white/35 backdrop-blur-sm rounded-2xl p-5 shadow-xl z-20 animate-float">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                5k+
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-xs text-gray-400">Learning Daily</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute -top-6 -left-6 bg-white/35 backdrop-blur-sm rounded-2xl p-5 shadow-xl z-20 animate-float-delay-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                98%
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-xs text-gray-400">Student Growth</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute top-1/2 -right-8 bg-white/35 backdrop-blur-sm rounded-2xl p-5 shadow-xl z-30 animate-float-delay-2 transform -translate-y-1/2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                24/7
              </div>
              <div>
                <p className="text-sm text-gray-600">Support</p>
                <p className="text-xs text-gray-400">Always Available</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute top-1/3 -left-12 bg-white/35 backdrop-blur-sm rounded-2xl p-5 shadow-xl z-20 animate-float-delay-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                50+
              </div>
              <div>
                <p className="text-sm text-gray-600">Expert Teachers</p>
                <p className="text-xs text-gray-400">World Class</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute -bottom-8 left-1/4 bg-white/35 backdrop-blur-sm rounded-2xl p-5 shadow-xl z-20 animate-float transform -translate-x-1/2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                100+
              </div>
              <div>
                <p className="text-sm text-gray-600">Courses</p>
                <p className="text-xs text-gray-400">Available Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
