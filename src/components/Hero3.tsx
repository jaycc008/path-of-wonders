import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import heroBg from '../assets/images/bluebg.png';
import heroVideoThumb from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM.jpeg';
import { en } from '../assets/lang/en';
import PrimaryButton from './PrimaryButton';

const t = en.hero3;

export default function Hero3() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[min(100dvh,880px)] lg:min-h-screen flex items-center overflow-hidden"
    >
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
        decoding="async"
        fetchPriority="high"
        aria-hidden
      />
      {/* White blend band for white header */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(12vh,110px)] bg-gradient-to-b from-white/40 via-white/18 via-[60%] to-transparent"
        aria-hidden
      />
      {/* Cool cinematic grade + vignette (brand blue/purple) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/42 via-slate-950/18 via-[45%] to-slate-950/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-950/40 via-transparent to-violet-950/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_20%,rgba(99,102,241,0.16)_0%,rgba(0,0,0,0)_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_85%_at_50%_55%,rgba(0,0,0,0)_40%,rgba(2,6,23,0.58)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 pb-14 sm:pb-16 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-center">
          {/* Left: copy + CTA — always left-aligned */}
          <div
            className={`text-left transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-3xl sm:text-5xl md:text-[2.75rem] lg:text-5xl xl:text-[4.00rem] font-bold text-white leading-[1.12] tracking-tight drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
              {t.title}
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl xl:text-2xl text-slate-200/95 leading-relaxed max-w-xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
              {t.subtitle}
            </p>
            <div className="mt-8 sm:mt-10 flex justify-start">
              <PrimaryButton
                size="lg"
                icon={ChevronRight}
                iconPosition="right"
                className="!rounded-full !px-8 !py-3.5 sm:!px-10 sm:!py-4 !text-base sm:!text-lg !font-semibold shadow-lg shadow-slate-900/15"
                onClick={() => navigate('/courses')}
              >
                {t.cta}
              </PrimaryButton>
            </div>
          </div>

          {/* Right: video */}
          <div
            className={`transition-all duration-1000 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative max-w-xl mx-auto lg:max-w-none lg:ml-auto lg:mr-0">
              <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white/35 via-white/20 to-white/30 blur-xl opacity-90" />
              <div className="absolute -inset-0.5 rounded-2xl sm:rounded-3xl ring-2 ring-white/70 shadow-[0_0_36px_-6px_rgba(255,255,255,0.45)]" />
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black/35 backdrop-blur-[2px] border-2 border-white shadow-lg shadow-black/25 ring-1 ring-white/50">
                <div className="aspect-video relative group cursor-pointer ring-1 ring-inset ring-white/40">
                  <img
                    src={heroVideoThumb}
                    alt={t.heroImageAlt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/20" />
                  <button
                    type="button"
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    aria-label={t.playVideoAriaLabel}
                  >
                    <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 text-blue-900 ml-1" fill="currentColor" />
                    </span>
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
