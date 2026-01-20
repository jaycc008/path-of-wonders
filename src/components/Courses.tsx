import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { getCourses, Course } from '../api/course';
import { encodeToBase64 } from '../utils/encoding';
import SecondaryButton from './SecondaryButton';

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await getCourses();
        const courseList = response.data.items || [];
        setCourses(courseList.slice(0, 5)); // Show only first 5 courses
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Keep empty array on error
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover transformative learning experiences designed to unlock your true potential
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left Side - Main Course Display */}
          <div className="md:col-span-2">
            <div className={`relative group transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              {/* Course Video/Image with Play Button */}
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl">
                {isVideoPlaying && courses[activeCourse]?.intro_video_url ? (
                  <div className="relative w-full h-[400px] bg-black">
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
                      className="absolute top-4 right-4 z-10 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-full font-semibold text-sm transition-colors backdrop-blur-sm"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={courses[activeCourse]?.thumbnail_url || courses[activeCourse]?.image || ''}
                      alt={courses[activeCourse]?.title || courses[activeCourse]?.name || 'Course'}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    {courses[activeCourse]?.intro_video_url ? (
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer group/play"
                      >
                        <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300 shadow-2xl backdrop-blur-sm">
                          <Play className="w-12 h-12 text-blue-600 ml-1" fill="currentColor" />
                        </div>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          // If no video, navigate to course details
                          const course = courses[activeCourse];
                          if (course && course.id) {
                            const courseJson = JSON.stringify({ course });
                            const encodedCourse = encodeToBase64(courseJson);
                            const courseId = String(course.id);
                            navigate(`/courses/${courseId}?course=${encodeURIComponent(encodedCourse)}`, {
                              state: { course }
                            });
                          }
                        }}
                        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer group/play"
                      >
                        <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300 shadow-2xl backdrop-blur-sm">
                          <Play className="w-12 h-12 text-blue-600 ml-1" fill="currentColor" />
                        </div>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Course Title */}
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-500">
                {courses[activeCourse]?.title || courses[activeCourse]?.name || 'Course'}
              </h3>

              {/* Course Description */}
              <div className="mb-8 transition-all duration-500">
                <p className="text-lg text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {courses[activeCourse]?.description || ''}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const course = courses[activeCourse];
                    if (course && course.id) {
                      // Encode course data in URL using UTF-8 safe encoding
                      const courseJson = JSON.stringify({ course });
                      const encodedCourse = encodeToBase64(courseJson);
                      // Convert course.id to string to ensure proper routing
                      const courseId = String(course.id);
                      navigate(`/courses/${courseId}?course=${encodeURIComponent(encodedCourse)}`, {
                        state: { course }
                      });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline-offset-4 hover:underline"
                >
                  Learn More →
                </button>
              </div>

              {/* What You Will Learn Section */}
              {courses[activeCourse]?.whatYouWillLearn && courses[activeCourse].whatYouWillLearn.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                  What You Will Learn
                </h4>
                <ul className="space-y-4">
                  {courses[activeCourse].whatYouWillLearn.map((item: string, index: number) => (
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
              )}

              {/* All Courses Button */}
              <SecondaryButton
                onClick={() => navigate('/courses')}
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full md:w-auto"
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
                        ? 'transform scale-[1.05] translate-x-2'
                        : 'hover:translate-x-1'
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
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className={`text-white font-bold transition-all duration-500 ${
                            index === activeCourse ? 'text-xl' : 'text-lg'
                          }`}>
                            {course.title || course.name || 'Course'}
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
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

