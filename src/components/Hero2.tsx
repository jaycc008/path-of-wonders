import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import heroImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM.jpeg';
import heroBgImage from '../assets/images/bglight.png';
import { en } from '../assets/lang/en';
import PrimaryButton from './PrimaryButton';

const t = en.hero2;

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleJoinEarlyAccessClick = () => {
    const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
    const currentFullUrl = window.location.href;
    const returnUrlParam = encodeURIComponent(currentFullUrl);

    if (typeof loginUrl === 'string' && (loginUrl.startsWith('http://') || loginUrl.startsWith('https://'))) {
      const separator = loginUrl.includes('?') ? '&' : '?';
      window.location.href = `${loginUrl}${separator}return_url=${returnUrlParam}`;
      return;
    }

    window.location.href = `${loginUrl}?return_url=${returnUrlParam}`;
  };

  const handleWatchTrailerClick = () => {
    trailerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => playButtonRef.current?.focus(), 300);
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[78vh] md:min-h-screen flex items-start md:items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-30"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-70/25 via-cyan-70/25 to-blue-70/25" />

      <div className="relative z-10 w-full flex flex-col gap-6 md:gap-12 items-center pt-24 pb-10 sm:pt-20 md:pt-32 md:pb-32">
        <div
          className={`w-full max-w-7xl mx-auto px-5 md:px-6 text-center transition-all duration-1000 mt-0 md:mt-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
            {t.title}
            <br />
          </h1>
          <div className="text-cyan-600 text-lg sm:text-xl md:text-2xl lg:text-4xl mt-3 md:mt-6 leading-snug px-1">
            {t.subtitle}
          </div>
        </div>

        <div
          className={`w-full max-w-7xl mx-auto px-5 md:px-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="flex flex-col items-center justify-center gap-3 w-full">
            <PrimaryButton
              size="md"
              className="uppercase w-auto shrink-0 !px-4 !py-2.5 !text-[0.75rem] leading-snug sm:!px-7 sm:!py-3 sm:!text-base"
              onClick={handleJoinEarlyAccessClick}
            >
              {t.ctaStartLearning}
            </PrimaryButton>
            <button
              type="button"
              onClick={handleWatchTrailerClick}
              className="text-sm sm:text-base font-semibold text-cyan-700 hover:text-cyan-900 transition-colors underline underline-offset-4"
            >
              {t.ctaKnowMore}
            </button>
          </div>
        </div>

        <div
          className={`relative w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {/* Full-bleed on small screens; constrained card from md up */}
          <div
            ref={trailerRef}
            className="w-screen relative left-1/2 -translate-x-1/2 md:w-full md:left-0 md:translate-x-0 md:max-w-7xl md:mx-auto md:px-6"
          >
            <div className="relative group cursor-pointer w-full md:max-w-4xl md:mx-auto">
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-white/60 backdrop-blur-lg rounded-none md:rounded-2xl p-0 sm:p-1 md:p-4 border-y border-white/40 md:border w-full">
                <div className="aspect-video flex items-center justify-center relative overflow-hidden w-full md:rounded-xl">
                  <img
                    src={heroImage}
                    alt={t.heroImageAlt}
                    className="absolute inset-0 w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-600"
                  />
                  <button
                    type="button"
                    ref={playButtonRef}
                    className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl"
                    aria-label={t.playVideoAriaLabel}
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-600 ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
