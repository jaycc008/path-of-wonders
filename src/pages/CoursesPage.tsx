import { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Breadcrumbs from '../components/Breadcrumbs';
import CategoryPills from './courses/CategoryPills';
import CourseCard from './courses/CourseCard';
import { getCourses, Course } from '../api/course';
import { Loader2, Search } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fake categories with counts
  const fakeCategories = [
    { name: 'Consciousness', count: 12 },
    { name: 'Science', count: 8 },
    { name: 'Finance', count: 15 },
    { name: 'Leadership', count: 6 },
    { name: 'Meditation', count: 10 },
    { name: 'Wellness', count: 9 },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await getCourses();
        setCourses(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Fallback to sample data if API fails
        setCourses([
          {
            id: 1,
            name: 'Consciousness Development',
            title: 'Consciousness Development',
            description: 'Explore the depths of human consciousness through evidence-based practices and quantum science principles.',
            thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
            price: 299,
            category: 'Consciousness',
            duration: '8 weeks',
            students_count: 1250,
            rating: 4.8,
            level: 'Beginner',
          },
          {
            id: 2,
            name: 'Quantum Science Fundamentals',
            title: 'Quantum Science Fundamentals',
            description: 'Master the principles of quantum mechanics and their applications in understanding reality and consciousness.',
            thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
            price: 349,
            category: 'Science',
            duration: '10 weeks',
            students_count: 890,
            rating: 4.9,
            level: 'Intermediate',
          },
          {
            id: 3,
            name: 'Financial Literacy Mastery',
            title: 'Financial Literacy Mastery',
            description: 'Build wealth and financial independence through proven strategies and mindful money management.',
            thumbnail_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
            price: 279,
            category: 'Finance',
            duration: '6 weeks',
            students_count: 2100,
            rating: 4.7,
            level: 'Beginner',
          },
          {
            id: 4,
            name: 'Mindful Leadership',
            title: 'Mindful Leadership',
            description: 'Develop leadership skills through consciousness-based practices and authentic self-expression.',
            thumbnail_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
            price: 329,
            category: 'Leadership',
            duration: '8 weeks',
            students_count: 650,
            rating: 4.6,
            level: 'Advanced',
          },
          {
            id: 5,
            name: 'Advanced Consciousness Studies',
            title: 'Advanced Consciousness Studies',
            description: 'Deep dive into advanced topics of consciousness, meditation, and transformative practices.',
            thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
            price: 399,
            category: 'Consciousness',
            duration: '12 weeks',
            students_count: 420,
            rating: 5.0,
            level: 'Advanced',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Always open Courses page from top
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

  // Filter courses by selected category and search query
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((course) => {
        const name = (course.name || course.title || '').toLowerCase();
        const description = (course.description || '').toLowerCase();
        return name.includes(query) || description.includes(query);
      });
    }

    return filtered;
  }, [courses, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20">
      
        
        <div className="my-10 sm:my-16 md:my-20">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Courses' }]} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Explore Our Courses
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Discover transformative learning experiences designed to unlock your true potential
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Pills */}
        <CategoryPills
          categories={fakeCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mt-6 sm:mt-10">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">No courses found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

