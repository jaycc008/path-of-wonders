import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import img1 from '../assets/images/pexels-alex-green-5699868.jpg';
import img2 from '../assets/images/pexels-cottonbro-4855373.jpg';
import img3 from '../assets/images/pexels-katerina-holmes-5905497.jpg';
import img4 from '../assets/images/pexels-olly-3769021.jpg';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Developer',
    image: img1,
    rating: 5,
    text: 'Path Of Wonders transformed my career. The courses are incredibly well-structured, and the instructors are world-class. I landed my dream job within 3 months of completing the program.',
  },
  {
    name: 'Michael Chen',
    role: 'Data Scientist',
    image: img2,
    rating: 5,
    text: 'The interactive learning approach kept me engaged throughout. The community support and live sessions made complex topics easy to understand. Highly recommended!',
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    image: img3,
    rating: 5,
    text: 'What sets Path Of Wonders apart is their commitment to practical, real-world applications. Every project I completed added directly to my portfolio. Outstanding experience!',
  },
  {
    name: 'David Kim',
    role: 'Product Manager',
    image: img4,
    rating: 5,
    text: 'The flexibility to learn at my own pace while having access to expert guidance was perfect for my busy schedule. The certification has been invaluable for my career growth.',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleDotClick = (index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section id="testimonials" className="py-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real students who transformed their careers with Path Of Wonders
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="p-10 md:p-12 min-h-[350px] md:min-h-[400px] flex items-center">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
              {/* Left Side - User Info */}
              <div className="text-center flex flex-col items-center justify-center">
                <div
                  className={`transition-all duration-500 ${
                    isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mx-auto mb-6 shadow-lg ring-4 ring-blue-200">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>

              {/* Right Side - Testimonial Text and Stars */}
              <div
                className={`transition-all duration-500 ${
                  isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                }`}
              >
                <div className="flex gap-1 mb-6 justify-center md:justify-start">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 leading-relaxed italic">
                  "{testimonials[currentIndex].text}"
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-blue-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
