import { useEffect, useRef, useState } from 'react';
import { UserPlus, BookOpen, Award } from 'lucide-react';
import processBg from '../assets/images/forward-moving.png';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up & Explore',
    description: 'Create your account and browse through our extensive catalog of courses tailored to your goals.',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Learn & Practice',
    description: 'Engage with interactive content, complete assignments, and apply your knowledge in real-world scenarios.',
  },
  {
    number: '03',
    icon: Award,
    title: 'Achieve & Certify',
    description: 'Complete your courses, earn certifications, and showcase your newly acquired skills to the world.',
  },
];

export default function Process() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSteps((prev) => [...prev, index]);
            }, index * 300);
          });
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32 md:py-40 lg:min-h-screen lg:py-28 lg:flex lg:items-center"
    >
      {/* Full-bleed background — cover + center; fixed only on lg to avoid mobile scroll jank */}
      <div
        className="absolute inset-0 bg-slate-900 bg-cover bg-center bg-no-repeat lg:bg-fixed"
        style={{ backgroundImage: `url(${processBg})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/55 to-slate-950/80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-blue-950/45 via-transparent to-amber-950/25"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <div className="text-center mb-16 sm:mb-20 md:mb-24 lg:mb-28 max-w-3xl mx-auto space-y-5 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-sm">
            Your Journey to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-lighter)] to-blue-200">
              Success
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed px-1">
            A simple, proven pathway from beginner to certified professional
          </p>
        </div>

        <div className="relative pb-4 sm:pb-6 lg:pb-0">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-800/60 via-blue-700 to-blue-600/70 rounded-full shadow-lg shadow-blue-950/40" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-10 lg:gap-12 xl:gap-16 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? 'opacity-96 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="relative h-full">
                  <div
                    className={`relative h-full rounded-3xl sm:rounded-[1.75rem] p-8 sm:p-10 md:p-9 lg:p-10 xl:p-12 border border-white/20 bg-white/45 backdrop-blur-lg shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-blue-950/25 hover:border-white/30 transition-all duration-300 ${
                      hoveredStep === index ? 'lg:-translate-y-2' : ''
                    }`}
                  >
                    <div className="flex items-start gap-5 mb-8 sm:mb-10">
                      <div className="relative shrink-0">
                        <div
                          className={`w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl flex items-center justify-center text-white  transition-transform duration-300 bg-gradient-to-br from-[var(--primary-start)] to-[var(--primary-end)] ${
                            hoveredStep === index ? 'scale-110 rotate-3' : ''
                          }`}
                        >
                          <step.icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-md bg-gradient-to-br from-[var(--primary-hover-start)] to-[var(--primary-end)]">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-[1.35rem] lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-gray-900 text-[0.9375rem] sm:text-base leading-relaxed">
                      {step.description}
                    </p>

                    <div
                      className={`mt-8 sm:mt-10 h-1 rounded-full bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] transition-all duration-500 ${
                        hoveredStep === index ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>

                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
