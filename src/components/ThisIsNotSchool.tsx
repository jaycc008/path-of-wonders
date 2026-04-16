import { useEffect, useMemo, useRef, useState } from 'react';

const LINES = [
  {
    text: 'This is not memorization.',
    className: 'text-4xl sm:text-5xl md:text-6xl text-white',
  },
  {
    text: 'This is not passive watching.',
    className: 'text-4xl sm:text-5xl md:text-7xl text-white',
  },
  {
    text: 'This is not school.',
    className: 'text-4xl sm:text-5xl md:text-8xl text-white',
  },
  {
    text: 'This is something else entirely.',
    className: 'text-xl sm:text-2xl md:text-4xl text-sky-300',
  },
] as const;

export default function ThisIsNotSchool() {
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
      aria-label="This is not school"
      className="w-full lg:h-[100vh] py-16 sm:py-20 md:py-24 flex items-center justify-center"
      style={{ backgroundColor: '#0F1B35' }}
    >
      <div className="max-w-5xl w-full mx-auto px-5 md:px-6 text-center">
        <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
          {LINES.map((line, idx) => {
            return (
              <p
                key={line.text}
                className={[
                  'font-semibold tracking-tight',
                  line.className,
                  'transition-all duration-700 ease-out will-change-transform will-change-opacity',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
                ].join(' ')}
                style={{ transitionDelay: `${idx * 300}ms` }}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}