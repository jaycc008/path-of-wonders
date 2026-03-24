import { useEffect, useRef, useState } from 'react';
import { Target, Shield, Sparkles } from 'lucide-react';
import promiseBg from '../assets/images/wangs_74.jpg';

const promises = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We focus on measurable outcomes and real-world skills that matter.',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Every course is vetted by experts to ensure the highest educational standards.',
  },
  {
    icon: Sparkles,
    title: 'Innovation First',
    description: 'Cutting-edge teaching methods that adapt to modern learning needs.',
  },
];

export default function Promise() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          promises.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems((prev) => [...prev, index]);
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${promiseBg})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-blue-900/80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-[1.6875rem] sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Our Commitment to Excellence
          </h2>
          <p className="text-[0.9375rem] sm:text-lg md:text-xl text-blue-200 max-w-2xl mx-auto px-1 leading-relaxed">
            Three pillars that define our unwavering dedication to your success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {promises.map((promise, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${
                visibleItems.includes(index)
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <promise.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-snug">
                    {promise.title}
                  </h3>

                  <p className="text-[0.8125rem] sm:text-base text-blue-200 leading-relaxed">
                    {promise.description}
                  </p>
                </div>

                {index < promises.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
