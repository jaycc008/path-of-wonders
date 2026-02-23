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
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${promiseBg})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-blue-900/80"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Commitment to Excellence
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Three pillars that define our unwavering dedication to your success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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

                <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <promise.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {promise.title}
                  </h3>

                  <p className="text-blue-200 leading-relaxed">
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
