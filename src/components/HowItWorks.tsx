import { useEffect, useMemo, useRef, useState } from 'react';
import { en } from '../assets/lang/en';

const t = en.howItWorks;

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const observerOptions = useMemo(
    () => ({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' }),
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [observerOptions]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-20 md:py-24 bg-white lg:h-[90vh] lg:flex lg:items-center"
    >
      <div className="max-w-7xl w-full mx-auto px-5 md:px-6 lg:my-auto">
        <h2
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight py-8"
          style={{ color: 'var(--brand-blue)' }}
        >
          {t.heading}
        </h2>

        <p className="mt-1 sm:mt-2 max-w-none whitespace-nowrap text-base sm:text-lg md:text-xl leading-relaxed text-slate-600">
          {t.subheading}
        </p>

        <div className="relative mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:items-stretch">
          {t.steps.map((s, idx) => {
            const showMobileConnector = idx !== t.steps.length - 1;
            const showMdConnector = idx % 2 === 0 && idx !== t.steps.length - 1;
            const showLgConnector = idx % 4 !== 3 && idx !== t.steps.length - 1;

            return (
              <div
                key={s.step}
                className={[
                  'relative h-full',
                  // Mobile: vertical timeline connector
                  showMobileConnector
                    ? 'after:pointer-events-none after:absolute after:left-7 after:top-[calc(100%-0.25rem)] after:h-[calc(100%+1.25rem)] after:w-[2px] after:bg-gradient-to-b after:from-[color:var(--brand-blue)]/70 after:via-[color:var(--accent-blue)]/55 after:to-transparent md:after:hidden'
                    : 'md:after:hidden',
                  // Desktop: connector to next column (md: 2 cols, lg: 4 cols)
                  showMdConnector
                    ? 'md:before:pointer-events-none md:before:absolute md:before:right-[-40px] md:before:top-1/2 md:before:h-[4px] md:before:w-[84px] md:before:-translate-y-1/2 md:before:bg-gradient-to-r md:before:from-[color:var(--brand-blue)] md:before:via-[color:var(--accent-blue)] md:before:to-transparent md:before:rounded-full md:before:shadow-[0_0_20px_rgba(15,27,53,0.45)] md:before:block'
                    : 'md:before:hidden',
                  showLgConnector ? 'lg:before:block' : 'lg:before:hidden',
                ].join(' ')}
              >
                <div
                  className={[
                    'relative overflow-hidden rounded-2xl bg-white p-6 sm:p-7 shadow-md w-full h-full flex flex-col md:min-h-[280px]',
                    'transition-all duration-700 ease-out will-change-transform will-change-opacity',
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6',
                  ].join(' ')}
                  style={{
                    borderColor: 'color-mix(in srgb, var(--primary-start) 22%, white)',
                    transitionDelay: `${idx * 500}ms`,
                  }}
                >
                  <div className="relative z-10 flex flex-col flex-1">
                    <div className="flex items-center gap-4 min-w-0 pr-14 sm:pr-16">
                      <div
                        className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full text-white flex items-center justify-center text-sm sm:text-base font-bold shadow-sm ring-1 ring-black/5"
                        style={{
                          backgroundColor: 'var(--primary-start)',
                        }}
                      >
                        {s.step}
                      </div>

                      <div className="min-w-0 flex-1 flex items-center gap-3">
                        <div
                          className="text-base sm:text-lg md:text-xl font-bold tracking-tight"
                          style={{ color: 'var(--primary-start)' }}
                        >
                          {s.title}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 min-w-0 flex-1 py-3">
                      <p
                        className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600"
                      >
                        {s.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
