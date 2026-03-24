import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import heroImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM.jpeg';
import heroBgImage from '../assets/images/bglight.png';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

export default function Hero() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[78vh] md:min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-30"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-70/25 via-cyan-70/25 to-blue-70/25" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 py-10 md:py-32 flex flex-col gap-5 md:gap-12 items-center">
        <div
          className={`w-full text-center transition-all duration-1000 mt-4 md:mt-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight gap-5">
            Awakening your true Potential
            <br />

          </h1>
          <div className="text-cyan-600 text-base sm:text-lg md:text-2xl lg:text-4xl mt-2 md:mt-6">The World's First Science-Backed Consciousness School</div>
        </div>

        <div className="flex flex-col gap-2 md:gap-2 w-full max-w-4xl">

          <div
            className={`flex flex-col md:flex-row gap-2 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <SecondaryButton size="md" className="uppercase w-full sm:w-auto" onClick={() => navigate('/courses')}>
              Start Learning Today
            </SecondaryButton>
            <PrimaryButton size="md" className="uppercase w-full sm:w-auto" onClick={() => navigate('/about')}>
              Know More
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
                <button className="relative z-10 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-cyan-600 ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
