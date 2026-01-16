import { useNavigate } from 'react-router-dom';
import { Play, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Course } from '../../api/course';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/courses/${course.id}`, {
      state: { course }
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={course.thumbnail_url || course.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" />
          </button>
        </div>

        {/* Category Badge */}
        {course.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              {course.category}
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-4 py-2 bg-white text-blue-600 text-lg font-bold rounded-lg">
            ${course.price}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-950 mb-3 line-clamp-2">
          {course.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          )}
          {course.students_count !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students_count} students</span>
            </div>
          )}
          {course.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          )}
        </div>

        {/* Level Badge */}
        {course.level && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              {course.level}
            </span>
          </div>
        )}

        {/* Learn More Button */}
        <button
          onClick={handleLearnMore}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Learn More
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

