import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import heroImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM.jpeg';
import heroBgImage from '../assets/images/bglight.png';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-30"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-70/25 via-cyan-70/25 to-blue-70/25" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
        <div
          className={`space-y-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Transform Your Future with Path Of Wonders
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Experience education reimagined. Join thousands of students who are unlocking their potential with our innovative learning management system.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Start Learning Today
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-gray-800 text-gray-800 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl p-1 md:p-4 border border-white/40">
              <div className="aspect-video rounded-xl flex items-center justify-center relative overflow-hidden w-full">
                <img
                  src={heroImage}
                  alt="Watch Now"
                  className="absolute inset-0 w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-600"
                />
                <button className="relative z-10 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-cyan-600 ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
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
