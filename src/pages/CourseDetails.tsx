import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Play, Clock, Users, Star, BookOpen, Award, ArrowRight, Book, FileText, Video, GraduationCap, Infinity, FolderOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Breadcrumbs from '../components/Breadcrumbs';
import { Course, getCourses, getCourseDetails } from '../api/course';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import BookCard from '../components/BookCard';
import { decodeFromBase64, encodeToBase64 } from '../utils/encoding';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const book = course?.book ?? null;

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);

        // Otherwise, fetch from API using the single course endpoint
        if (id) {
          const response = await getCourseDetails(id);
          if (response.data) {
            setCourse(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
        // Fallback to fetching all courses if single course endpoint fails
        try {
          const response = await getCourses();
          const foundCourse = response.data.items?.find(
            (c) => c.id.toString() === id
          );
          if (foundCourse) {
            setCourse(foundCourse);
          }
        } catch (fallbackError) {
          console.error('Failed to fetch courses:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, location.state]);

  // Update page metadata for SEO
  useEffect(() => {
    if (course) {
      const courseTitle = course.name || course.title || 'Course';
      const courseDescription = course.description || 'Explore this course and unlock your potential.';
      const courseImage = course.thumbnail_url || course.image || '';
      const courseUrl = `${window.location.origin}/courses/${course.id}`;

      // Update document title
      document.title = `${courseTitle} | Path Of Wonders`;

      // Update or create meta tags
      const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attribute, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Basic meta tags
      updateMetaTag('description', courseDescription);
      updateMetaTag('keywords', `${courseTitle}, online course, ${course.category || 'education'}, learning`);

      // Open Graph tags
      updateMetaTag('og:title', courseTitle, 'property');
      updateMetaTag('og:description', courseDescription, 'property');
      updateMetaTag('og:image', courseImage, 'property');
      updateMetaTag('og:type', 'website', 'property');
      updateMetaTag('og:url', courseUrl, 'property');

      // Twitter Card tags
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', courseTitle);
      updateMetaTag('twitter:description', courseDescription);
      updateMetaTag('twitter:image', courseImage);

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', courseUrl);

      // Cleanup function to reset title when component unmounts
      return () => {
        document.title = 'Path Of Wonders';
      };
    }
  }, [course]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnroll = () => {
    if (!course) return;
    
    // Always encode course data in URL (even when authenticated) so it persists after logout/login
    const checkoutUrl = '/checkout';

    const courseData = {
      id: course.id,
      name: course.name,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      price: course.price,
    };
    
    // Encode course data using UTF-8 safe encoding
    const courseJson = JSON.stringify({ course: courseData });
    const encodedCourse = encodeToBase64(courseJson);
    
    // Build checkout URL with course data as query param
    const checkoutUrlWithData = `${checkoutUrl}?course=${encodeURIComponent(encodedCourse)}`;

    // Try decode the encoded course data
    const decodedCourse = decodeFromBase64(encodedCourse);
    console.log('Decoded course:', decodedCourse);
    
    // Check if user is authenticated
    if (!authLoading && isAuthenticated) {
      // User is authenticated - navigate directly to checkout with course data in URL
      navigate(checkoutUrlWithData);
    } else {
      // User is not authenticated - encode checkout URL in return_url query param
      const returnUrl = `${window.location.origin}${checkoutUrlWithData}`;
      
      // Get login URL from environment variable
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
      
      // Check if it's a full URL (external) or relative path (internal)
      if (loginUrl.startsWith('http://') || loginUrl.startsWith('https://')) {
        // External login page - redirect with return URL as query parameter
        const returnUrlParam = encodeURIComponent(returnUrl);
        window.location.href = `${loginUrl}?return_url=${returnUrlParam}`;
      } else {
        // Internal route - use React Router to navigate to login page
        navigate(`${loginUrl}?return_url=${encodeURIComponent(returnUrl)}`);
      }
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-2 sm:px-3 pt-20 md:pt-24 lg:pt-32">
          <Breadcrumbs
            items={[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: 'Course' }]}
          />
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <Footer />
        <ScrollToTop show={showScrollTop} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-2 sm:px-3 py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Courses', to: '/courses' },
              { label: 'Course not found' },
            ]}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </div>
        <Footer />
        <ScrollToTop show={showScrollTop} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-2 sm:px-3 pt-20 md:pt-24 lg:pt-32">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Courses', to: '/courses' },
              { label: course.name || course.title || 'Course' },
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-2 sm:px-3 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Course Video/Image */}
              <div className="relative mx-0 sm:mx-0 aspect-video md:aspect-auto md:h-96 rounded-none sm:rounded-2xl overflow-hidden mb-8 bg-gray-200">
                {course.intro_video_url ? (
                  <div className="w-full h-full">
                    <video
                      src={course.intro_video_url}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full object-contain md:object-cover bg-black"
                      poster={course.thumbnail_url || course.image || undefined}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <>
                    <img
                      src={course.thumbnail_url || course.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'}
                      alt={course.name || course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-blue-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Course Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-950 mb-3">
                {course.name || course.title}
              </h1>

              {/* Course Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {(() => {
                  const modulesCount = course.modules_count ?? (course as any).modules_count ?? (course as any).modules?.length ?? (course as any).total_modules;
                  if (modulesCount !== undefined && modulesCount !== null && modulesCount !== '') {
                    return (
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{modulesCount} {modulesCount === 1 ? 'Module' : 'Modules'}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
                {(() => {
                  const chaptersCount = course.chapters_count ?? (course as any).chapters_count ?? (course as any).chapters?.length ?? (course as any).total_chapters;
                  if (chaptersCount !== undefined && chaptersCount !== null && chaptersCount !== '') {
                    return (
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                        <Book className="w-3.5 h-3.5" />
                        <span>{chaptersCount} {chaptersCount === 1 ? 'Chapter' : 'Chapters'}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
                <div className="flex items-center gap-2 px-2 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Certificate</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold">
                  <Infinity className="w-3.5 h-3.5" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-semibold">
                  <Video className="w-3.5 h-3.5" />
                  <span>HD Video</span>
                </div>
              </div>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
                {course.category && (
                  <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    {course.level}
                  </span>
                )}
                {course.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                )}
                {course.students_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5" />
                    <span>{course.students_count.toLocaleString()} students</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">About This Course</h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Modules & Chapters Tree */}
              {course.modules && course.modules.length > 0 && (
                <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                    Course Curriculum
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id || moduleIndex} className="border-l-2 border-blue-200 pl-4">
                        {/* Module Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">
                            {module.order && `${module.order}. `}
                            {module.title || module.name}
                          </h3>
                        </div>
                        {/* Chapters under this module */}
                        {module.chapters && module.chapters.length > 0 && (
                          <div className="ml-6 grid grid-cols-2 gap-2 mt-2">
                            {module.chapters
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((chapter, chapterIndex) => (
                                <div key={chapter.id || chapterIndex} className="flex items-center gap-2 text-gray-700">
                                  <Book className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="text-sm truncate">
                                    {chapter.order && `${chapter.order}. `}
                                    {chapter.title || chapter.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview Sections */}
              {course.overview_sections && course.overview_sections.length > 0 && (
                <div className="mb-8 space-y-8">
                  {course.overview_sections.map((section, index) => (
                    <div key={index} className="mb-8 bg-white rounded-2xl border border-gray-200 p-5 md:p-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        {section.header}
                      </h2>
                      <div 
                        className="overview-content prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.overview }}
                        style={{
                          // Style for paragraphs
                          '--tw-prose-body': '#374151',
                          '--tw-prose-headings': '#111827',
                          '--tw-prose-links': '#2563eb',
                          '--tw-prose-bold': '#111827',
                          '--tw-prose-counters': '#6b7280',
                          '--tw-prose-bullets': '#6b7280',
                          '--tw-prose-quotes': '#111827',
                          '--tw-prose-code': '#111827',
                        } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 md:top-28 lg:top-32">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  {/* Price */}
                  <div className="mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      ${course.price}
                    </div>
                    <p className="text-gray-600 text-sm">One-time payment</p>
                  </div>

                  {/* Enroll Button */}
                  <PrimaryButton
                    onClick={handleEnroll}
                    size="lg"
                    fullWidth
                    icon={ArrowRight}
                    iconPosition="right"
                    className="mb-4"
                  >
                    Enroll Now
                  </PrimaryButton>

                  {/* Features */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>Certificate of Completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Community Support</span>
                    </div>
                  </div>
                </div>

                {/* Book Section */}
                <BookCard book={book} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>

        {/* You May Like Section */}
        <div className="max-w-7xl mx-auto px-2 sm:px-3 py-12 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 6,
                name: 'Meditation Mastery',
                title: 'Meditation Mastery',
                description: 'Learn advanced meditation techniques to achieve inner peace and mindfulness in your daily life.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
                price: 249,
                category: 'Meditation',
                duration: '6 weeks',
                students_count: 1800,
                rating: 4.9,
                level: 'Beginner',
              },
              {
                id: 7,
                name: 'Quantum Physics for Beginners',
                title: 'Quantum Physics for Beginners',
                description: 'Discover the fascinating world of quantum mechanics explained in simple, understandable terms.',
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
                price: 299,
                category: 'Science',
                duration: '8 weeks',
                students_count: 1200,
                rating: 4.7,
                level: 'Beginner',
              },
              {
                id: 8,
                name: 'Personal Development Essentials',
                title: 'Personal Development Essentials',
                description: 'Transform your life with proven strategies for personal growth, productivity, and success.',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
                price: 279,
                category: 'Wellness',
                duration: '7 weeks',
                students_count: 2100,
                rating: 4.8,
                level: 'Intermediate',
              },
            ].map((relatedCourse) => (
              <div
                key={relatedCourse.id}
                onClick={() => navigate(`/courses/${relatedCourse.id}`, { state: { course: relatedCourse } })}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={relatedCourse.image}
                    alt={relatedCourse.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                  
                  {/* Category Badge */}
                  {relatedCourse.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {relatedCourse.category}
                      </span>
                    </div>
                  )}

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-white text-blue-600 text-lg font-bold rounded-lg">
                      ${relatedCourse.price}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-950 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {relatedCourse.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {relatedCourse.description}
                  </p>

                  {/* Course Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {relatedCourse.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{relatedCourse.duration}</span>
                      </div>
                    )}
                    {relatedCourse.students_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{relatedCourse.students_count} students</span>
                      </div>
                    )}
                    {relatedCourse.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{relatedCourse.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Level Badge */}
                  {relatedCourse.level && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        {relatedCourse.level}
                      </span>
                    </div>
                  )}

                  {/* Learn More Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${relatedCourse.id}`, { state: { course: relatedCourse } });
                    }}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

