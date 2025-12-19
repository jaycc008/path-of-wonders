import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Consciousness Development',
    description: 'Explore the depths of human consciousness through evidence-based practices and quantum science principles. Transform your understanding of reality and unlock your true potential.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    videoUrl: '#',
    price: 299,
    whatYouWillLearn: [
      'Understanding consciousness and its levels',
      'Meditation and mindfulness practices',
      'Quantum principles in consciousness',
      'Practical applications in daily life',
    ],
  },
  {
    id: 2,
    title: 'Quantum Science Fundamentals',
    description: 'Master the principles of quantum mechanics and their applications in understanding reality and consciousness. Learn from leading experts in the field.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    videoUrl: '#',
    price: 349,
    whatYouWillLearn: [
      'Quantum mechanics basics',
      'Wave-particle duality',
      'Quantum entanglement',
      'Applications in technology',
    ],
  },
  {
    id: 3,
    title: 'Financial Literacy Mastery',
    description: 'Build wealth and financial independence through proven strategies and mindful money management. Learn to make your money work for you.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    videoUrl: '#',
    price: 279,
    whatYouWillLearn: [
      'Investment fundamentals',
      'Budgeting and saving strategies',
      'Building passive income',
      'Financial planning and goals',
    ],
  },
  {
    id: 4,
    title: 'Mindful Leadership',
    description: 'Develop leadership skills through consciousness-based practices and authentic self-expression. Lead with purpose and impact.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    videoUrl: '#',
    price: 329,
    whatYouWillLearn: [
      'Leadership principles',
      'Communication skills',
      'Team building strategies',
      'Ethical decision making',
    ],
  },
  {
    id: 5,
    title: 'Advanced Consciousness Studies',
    description: 'Deep dive into advanced topics of consciousness, meditation, and transformative practices. Elevate your understanding to the next level.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    videoUrl: '#',
    price: 399,
    whatYouWillLearn: [
      'Advanced meditation techniques',
      'Consciousness expansion methods',
      'Transcendental practices',
      'Integration and application',
    ],
  },
];

export default function Courses() {
  const navigate = useNavigate();
  const [activeCourse, setActiveCourse] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleCourseClick = (index: number) => {
    if (index !== activeCourse) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCourse(index);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleEnroll = (course: typeof courses[0]) => {
    navigate('/checkout', {
      state: { course }
    });
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Course Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover transformative learning experiences designed to unlock your true potential
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left Side - Main Course Display */}
          <div className="md:col-span-2">
            <div className={`relative group transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {/* Course Image with Play Button */}
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img
                  src={courses[activeCourse].image}
                  alt={courses[activeCourse].title}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <button className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer group/play">
                  <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300 shadow-2xl backdrop-blur-sm">
                    <Play className="w-12 h-12 text-blue-600 ml-1" fill="currentColor" />
                  </div>
                </button>
              </div>

              {/* Course Title */}
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-500">
                {courses[activeCourse].title}
              </h3>

              {/* Course Description */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8 transition-all duration-500">
                {courses[activeCourse].description}
              </p>

              {/* What You Will Learn Section */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                  What You Will Learn
                </h4>
                <ul className="space-y-4">
                  {courses[activeCourse].whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enroll Now Button */}
              <button 
                onClick={() => handleEnroll(courses[activeCourse])}
                className="group relative w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Enroll Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Right Side - Course Reel */}
          <div className="md:col-span-1 relative">
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div key={course.id} className="relative">
                  {/* Connecting Line */}
                  {index < courses.length - 1 && (
                    <div className={`absolute left-8 top-24 w-0.5 h-6 transition-all duration-500 ${
                      index < activeCourse ? 'bg-blue-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                  
                  <button
                    onClick={() => handleCourseClick(index)}
                    className={`w-full text-left transition-all duration-500 relative ${
                      index === activeCourse
                        ? 'transform scale-[1.05] translate-x-2'
                        : 'hover:translate-x-1'
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl transition-all duration-500 ${
                        index === activeCourse
                          ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-500/50'
                          : 'shadow-lg hover:shadow-xl ring-2 ring-transparent hover:ring-blue-200'
                      }`}
                    >
                      {/* Glow Effect for Active Course */}
                      {index === activeCourse && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 -z-10 animate-pulse"></div>
                      )}
                      
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className={`w-full h-44 object-cover rounded-2xl transition-all duration-500 ${
                            index === activeCourse ? 'brightness-110' : 'brightness-90 hover:brightness-100'
                          }`}
                        />
                        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                          index === activeCourse 
                            ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent' 
                            : 'bg-gradient-to-t from-black/70 via-black/30 to-transparent'
                        }`}></div>
                        
                        {/* Enroll Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnroll(course);
                          }}
                          className={`absolute top-4 right-4 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                            index === activeCourse
                              ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105'
                              : 'bg-white/90 text-gray-800 hover:bg-white hover:scale-105 backdrop-blur-sm'
                          }`}
                        >
                          Enroll Now
                        </button>
                        
                        {/* Course Number Badge */}
                        <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                          index === activeCourse
                            ? 'bg-blue-500 text-white shadow-lg scale-110'
                            : 'bg-white/90 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className={`text-white font-bold transition-all duration-500 ${
                            index === activeCourse ? 'text-xl' : 'text-lg'
                          }`}>
                            {course.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

