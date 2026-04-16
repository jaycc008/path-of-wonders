import { useEffect, useMemo, useRef, useState } from 'react';

const CARDS = [
  'For the teenager who asks questions school refuses to answer.',
  'For the parent who knows their child is capable of more than grades show.',
  'For families who believe stories can change how we think.',
  'For the next generation that will have to think for itself.',
] as const;

export default function WhoThisIsFor() {
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
      <div className="max-w-7xl w-full mx-auto px-5 md:px-6">
        <h2 className="text-center mb-20 text-xl sm:text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Is this for you?
        </h2>

        <div className="mt-20 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {CARDS.map((text, idx) => (
            <div
              key={text}
              className={[
                'relative bg-white/70 backdrop-blur-sm p-6 sm:p-7',
                'before:content-[""] before:absolute before:left-0 before:top-5 before:bottom-5 before:w-0.5',
                'before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent',
                'transition-all duration-700 ease-out will-change-transform will-change-opacity',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
              ].join(' ')}
              style={{ transitionDelay: `${idx * 300}ms` }}
            >
              <p className="text-gray-900 text-base sm:text-lg md:text-xl xl:text-2xl font-semibold leading-snug">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}