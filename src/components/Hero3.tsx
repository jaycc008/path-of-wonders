import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import heroBg from '../assets/images/mainbackground.jpeg';
import { en } from '../assets/lang/en';
import PrimaryButton from './PrimaryButton';
import VideoEmbed from './VideoEmbed';

const HERO_VIDEO_URL =
  'https://lbryubvwfd4tkhw5.public.blob.vercel-storage.com/landing_video.mp4';
const HERO_VIDEO_POSTER =
  'https://lbryubvwfd4tkhw5.public.blob.vercel-storage.com/thumbimg.jpeg';

const t = en.hero3;

function Hero3() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[min(100dvh,880px)] lg:min-h-screen flex items-center overflow-x-hidden overflow-y-visible"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${heroBg})` }}
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
            <h1 className="text-3xl sm:text-5xl md:text-[2.75rem] lg:text-5xl xl:text-7xl font-bold text-white leading-[1.12] tracking-tight drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] py-4">
              {t.title}
            </h1>
            <p className="mt-8 sm:mt-6 text-base sm:text-lg md:text-xl xl:text-2xl text-slate-200/95 leading-relaxed max-w-xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
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

          {/* Right: video (YouTube URL or direct file — see VideoEmbed) */}
          <div
            className={`transition-all duration-1000 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative w-full max-w-3xl mx-auto lg:max-w-[min(100%,480px)] lg:ml-auto lg:mr-0 xl:max-w-[min(100%,520px)] lg:scale-105 xl:scale-110 lg:origin-right">
              <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white/35 via-white/20 to-white/30 blur-xl opacity-90" />
              <div className="absolute -inset-0.5 rounded-2xl sm:rounded-3xl ring-2 ring-white/70 shadow-[0_0_36px_-6px_rgba(255,255,255,0.45)]" />
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black/35 backdrop-blur-[2px] border-2 border-white shadow-lg shadow-black/25 ring-1 ring-white/50 p-1 sm:p-1.5">
                <VideoEmbed
                  videoUrl={HERO_VIDEO_URL}
                  posterUrl={HERO_VIDEO_POSTER}
                  title={t.heroImageAlt}
                  autoPlay
                  className="rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero3;
