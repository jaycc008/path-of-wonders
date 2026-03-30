import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { buildCourseDetailsUrl } from '../constants/routes';
import SecondaryButton from './SecondaryButton';

export default function Courses() {
  const navigate = useNavigate();
  const { courses, isLoading } = useCourses();
  const [activeCourse, setActiveCourse] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Reset active index if course list length changes
  useEffect(() => {
    setActiveCourse((i) => (courses.length === 0 ? 0 : Math.min(i, courses.length - 1)));
  }, [courses.length]);

  // Reset video playing state when active course changes
  useEffect(() => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [activeCourse]);

  const handleCourseClick = (index: number) => {
    if (index !== activeCourse) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCourse(index);
        setIsTransitioning(false);
      }, 200);
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
    
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Explore Our Courses
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-1 leading-relaxed">
            Discover transformative learning experiences designed to unlock your true potential
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Side - Main Course Display */}
          <div className="md:col-span-2">
            <div className={`relative group transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {/* Course Video/Image with Play Button */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 shadow-2xl">
                {isVideoPlaying && courses[activeCourse]?.intro_video_url ? (
                  <div className="relative w-full h-[min(60vw,280px)] sm:h-[320px] md:h-[400px] bg-black">
                    <video
                      ref={videoRef}
                      src={courses[activeCourse]?.intro_video_url}
                      controls
                      controlsList="nodownload"
                      autoPlay
                      className="w-full h-full object-contain"
                      onEnded={() => setIsVideoPlaying(false)}
                      onPause={() => {
                        // Optionally reset when paused
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <button
                      onClick={() => {
                        setIsVideoPlaying(false);
                        if (videoRef.current) {
                          videoRef.current.pause();
                          videoRef.current.currentTime = 0;
                        }
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 hover:bg-black/90 text-white rounded-full font-semibold text-xs sm:text-sm transition-colors backdrop-blur-sm"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={courses[activeCourse]?.thumbnail_url || courses[activeCourse]?.image || ''}
                      alt={courses[activeCourse]?.title || courses[activeCourse]?.name || 'Course'}
                      className="w-full h-[min(60vw,280px)] sm:h-[320px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {courses[activeCourse]?.intro_video_url ? (
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer group/play"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/95 rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300 shadow-2xl backdrop-blur-sm">
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 ml-1" fill="currentColor" />
                        </div>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          const course = courses[activeCourse];
                          if (course?.id != null) {
                            navigate(buildCourseDetailsUrl(course), { state: { course } });
                          }
                        }}
                        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer group/play"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/95 rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300 shadow-2xl backdrop-blur-sm">
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 ml-1" fill="currentColor" />
                        </div>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Course Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 transition-all duration-500 leading-tight">
                {courses[activeCourse]?.title || courses[activeCourse]?.name || 'Course'}
              </h3>

              {/* Course Description */}
              <div className="mb-6 sm:mb-8 transition-all duration-500">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed line-clamp-3 mb-3 sm:mb-4">
                  {courses[activeCourse]?.description || ''}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const course = courses[activeCourse];
                    if (course?.id != null) {
                      navigate(buildCourseDetailsUrl(course), { state: { course } });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline-offset-4 hover:underline"
                >
                  Learn More →
                </button>
              </div>

              {/* What You Will Learn Section */}
              {courses[activeCourse]?.whatYouWillLearn && courses[activeCourse].whatYouWillLearn.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full shrink-0"></span>
                  What You Will Learn
                </h4>
                <ul className="space-y-3 sm:space-y-4">
                  {courses[activeCourse].whatYouWillLearn.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 font-medium pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              )}

              {/* All Courses Button */}
              <SecondaryButton
                onClick={() => navigate('/courses')}
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full md:w-auto !text-sm sm:!text-base !px-5 !py-2.5 sm:!px-8 sm:!py-3.5"
              >
                All Courses
              </SecondaryButton>
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
                        ? 'transform md:scale-[1.05] md:translate-x-2 scale-[1.02]'
                        : 'hover:translate-x-0.5 md:hover:translate-x-1'
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl transition-all duration-500 ${
                        index === activeCourse
                          ? 'ring-2 ring-blue-500 shadow-md shadow-blue-500/20'
                          : 'shadow-md hover:shadow-lg ring-1 ring-transparent hover:ring-blue-200'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail_url || course.image || ''}
                          alt={course.title || course.name || 'Course'}
                          className={`w-full h-44 object-cover rounded-2xl transition-all duration-500 ${
                            index === activeCourse ? 'brightness-110' : 'brightness-90 hover:brightness-100'
                          }`}
                        />
                        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                          index === activeCourse 
                            ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent' 
                            : 'bg-gradient-to-t from-black/70 via-black/30 to-transparent'
                        }`}></div>
                        
                        {/* Course Number Badge */}
                        <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                          index === activeCourse
                            ? 'bg-blue-500 text-white shadow-lg scale-110'
                            : 'bg-white/90 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <h4 className={`text-white font-bold transition-all duration-500 leading-snug ${
                            index === activeCourse ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'
                          }`}>
                            {course.title || course.name || 'Course'}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
              
              {/* Coming Next Month Card - Show when less than 5 courses */}
              {courses.length < 5 && (
                <div className="relative">
                  {/* Connecting Line */}
                  {courses.length > 0 && (
                    <div className={`absolute left-8 top-24 w-0.5 h-6 transition-all duration-500 ${
                      'bg-gray-200'
                    }`}></div>
                  )}
                  
                  <div className="relative rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden group hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                    <div className="relative h-40 sm:h-44 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 p-3">
                        <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      
                      {/* Text Content */}
                      <div className="relative z-10">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">
                          Coming Next Month
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          More exciting courses are on the way. Stay tuned for new learning adventures!
                        </p>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

