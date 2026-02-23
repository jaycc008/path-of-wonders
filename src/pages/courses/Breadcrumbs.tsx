import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Courses</span>
    </nav>
  );
}

