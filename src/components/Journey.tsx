import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { en } from '../assets/lang/en';
import SecondaryButton from './SecondaryButton';
import journeyImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM (2).jpeg';

const t = en.journey;

export default function Journey() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-24 bg-white/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div
            className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              {t.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">{t.description}</p>
            <SecondaryButton 
              onClick={() => navigate('/about')}
              size="sm"
              className="md:px-8 md:py-3.5 md:text-lg md:font-semibold"
              icon={ArrowRight}
              iconPosition="right"
            >
              {t.learnMore}
            </SecondaryButton>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl md:transform md:rotate-3"></div>
              <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl md:rounded-3xl p-5 md:p-8 md:transform md:-rotate-3 md:hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div className="aspect-square rounded-2xl overflow-hidden relative">
                  <img
                    src={journeyImage}
                    alt={t.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2">{t.overlayTitle}</h3>
                    <p className="text-sm sm:text-base md:text-lg opacity-90">{t.overlaySubtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
