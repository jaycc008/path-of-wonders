import { useEffect, useRef, useState } from 'react';
import { Heart, Lightbulb, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Breadcrumbs from '../components/Breadcrumbs';
import journeyImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM (2).jpeg';
import heroImage from '../assets/images/WhatsApp Image 2025-12-23 at 4.50.03 PM.jpeg';

export default function About() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  // Always open About page from top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Passion for Education',
      description: 'We believe in the transformative power of education and are committed to making quality learning accessible to everyone.',
    },
    {
      icon: BookOpen,
      title: 'Student-Centered',
      description: 'Every decision we make is focused on creating the best possible learning experience for our students.',
    },
    {
      icon: Lightbulb,
      title: 'Curiosity-Led',
      description: 'We design learning experiences that spark questions first, then build lasting understanding.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Breadcrumbs
            className="mb-6 !text-left justify-start"
            items={[{ label: 'Home', to: '/' }, { label: 'About' }]}
          />
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              About Path Of Wonders
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              The World's First Science-Backed Consciousness School. Empowering teens through transformative education that awakens their true potential.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)}
        className={`py-24 transition-all duration-1000 ${
          visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                At Path Of Wonders, we are dedicated to nurturing curiosity, confidence, and purpose in teenagers through engaging and meaningful learning experiences. We believe that education should not just inform, but transform.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Our science-backed approach combines cutting-edge research with practical application, ensuring that every student not only learns but truly understands and can apply their knowledge in real-world scenarios.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're committed to creating a learning environment where students can discover their passions, develop critical thinking skills, and build the confidence needed to pursue their dreams.
              </p>
            </div>
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
                    <p className="text-lg opacity-90">Empowering the next generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section 
        ref={(el) => (sectionRefs.current[1] = el)}
        className={`py-24 bg-white transition-all duration-1000 ${
          visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl transform -rotate-3"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div className="aspect-video rounded-2xl overflow-hidden relative">
                  <img
                    src={heroImage}
                    alt="Learning environment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                We envision a world where every teenager has access to transformative education that not only teaches them facts but helps them discover who they are and what they're capable of achieving.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Our vision extends beyond traditional learning. We're building a community of curious minds, critical thinkers, and confident individuals who are ready to make a positive impact on the world.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our science-backed consciousness approach, we're pioneering a new way of learning that integrates knowledge, awareness, and personal growth into a cohesive educational experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        ref={(el) => (sectionRefs.current[2] = el)}
        className={`py-24 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Path Of Wonders
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section 
        ref={(el) => (sectionRefs.current[3] = el)}
        className={`py-24 bg-white transition-all duration-1000 ${
          visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Path Of Wonders was born from a simple yet powerful observation: traditional education often focuses on memorization and test-taking, but fails to truly engage students or help them discover their unique potential.
              </p>
              <p>
                We set out to create something different—a learning platform that combines rigorous academic content with consciousness-based education, helping students not just learn, but truly understand and grow.
              </p>
              <p>
                Today, we're proud to be the world's first science-backed consciousness school, serving thousands of students worldwide and continuously evolving our approach based on the latest research in education, psychology, and neuroscience.
              </p>
              <p className="text-xl font-semibold text-gray-900 pt-4">
                Join us on this journey of transformation and discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

