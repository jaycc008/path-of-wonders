import { useEffect, useRef, useState } from 'react';
import { BookOpen, Video, Users, Trophy } from 'lucide-react';

const offerings = [
  {
    icon: BookOpen,
    title: 'Consciousness Development',
    description: 'Engage with dynamic content designed to keep you motivated and learning effectively.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Video,
    title: 'Quantum Science Courses',
    description: 'Connect with expert instructors in real-time for an immersive learning experience.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Financial Literacy Programs',
    description: 'Collaborate with peers, share insights, and grow together in our vibrant community.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Trophy,
    title: 'Certified Programs',
    description: 'Earn recognized certifications that showcase your skills and boost your career.',
    color: 'from-green-500 to-teal-500',
  },
];

export default function Offer() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          offerings.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 150);
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            What We Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and resources designed to empower your educational journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 from-blue-500 to-purple-500"></div>

                <div className={`w-16 h-16 bg-gradient-to-br ${offering.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <offering.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {offering.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {offering.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
