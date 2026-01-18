import { useEffect, useRef, useState } from 'react';
import { Award, Users, Zap } from 'lucide-react';
import journeyImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM (2).jpeg';

export default function Journey() {
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
    <section id="about" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div
            className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Empowering Teens Through Story-Driven Science Education
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
            Path Of Wonders is dedicated to nurturing curiosity, confidence, and purpose in teenagers through engaging and meaningful learning experiences.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { icon: Users, value: '10K+', label: 'Students' },
                { icon: Award, value: '500+', label: 'Courses' },
                { icon: Zap, value: '95%', label: 'Success Rate' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
              Discover Our Story
            </button>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div className="aspect-square rounded-2xl overflow-hidden relative">
                  <img
                    src={journeyImage}
                    alt="Students learning together"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Excellence in Education</h3>
                    <p className="text-lg opacity-90">Empowering the next generation of learners</p>
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
