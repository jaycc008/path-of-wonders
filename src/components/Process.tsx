import { useEffect, useRef, useState } from 'react';
import { UserPlus, BookOpen, Award } from 'lucide-react';

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
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Our Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Journey to Success
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple, proven pathway from beginner to certified professional
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="relative">
                  <div className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    hoveredStep === index ? 'transform -translate-y-2' : ''
                  }`}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                          hoveredStep === index ? 'scale-110 rotate-3' : ''
                        }`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    <div className={`mt-6 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
                      hoveredStep === index ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-4 z-10">
                      <div className="w-8 h-8 bg-white border-4 border-blue-400 rounded-full shadow-lg"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
