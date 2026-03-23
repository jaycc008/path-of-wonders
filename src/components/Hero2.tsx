import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import heroImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM.jpeg';
import heroBgImage from '../assets/images/bglight.png';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

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
        className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat opacity-90"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/45 via-cyan-50/35 to-blue-50/45" />

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
            <SecondaryButton size="lg" className="uppercase">
              Start Learning Today
            </SecondaryButton>
            <PrimaryButton size="lg" className="uppercase">
              Learn More
            </PrimaryButton>
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
                  src={heroImage} 
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
        </div>
      </div>
    </section>
  );
}
