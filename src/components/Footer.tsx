import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logo from '../assets/images/10dlogo2.png';
import NewsletterSubscribe from './NewsletterSubscribe';
import { useCourses } from '../contexts/CoursesContext';
import { buildCourseDetailsUrl, ROUTES } from '../constants/routes';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { courses, isLoading } = useCourses();

  return (
    <>
      <NewsletterSubscribe />
      <footer id="contact" className="bg-gray-800 text-gray-200 pt-16 md:pt-24 pb-10 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-10 md:gap-16 mb-12 md:mb-16">
          <div className="space-y-6">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Path Of Wonders Logo" 
                className="h-36 md:h-48 w-auto object-contain"
              />
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Empowering learners worldwide with innovative education solutions for the digital age.
            </p>
            <div className="flex gap-3 md:gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Courses</h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              {isLoading ? (
                <li className="text-sm text-gray-400">Loading courses…</li>
              ) : (
                courses.map((course) =>
                  course.id != null ? (
                    <li key={course.id}>
                      <Link
                        to={buildCourseDetailsUrl(course)}
                        state={{ course }}
                        className="hover:text-blue-400 transition-colors duration-300"
                      >
                        {course.title || course.name || 'Course'}
                      </Link>
                    </li>
                  ) : null
                )
              )}
              {!isLoading && courses.length === 0 ? (
                <li className="text-sm text-gray-400">New courses coming soon.</li>
              ) : null}
              <li>
                <Link to={ROUTES.COURSES} className="hover:text-blue-400 transition-colors duration-300">
                  All courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Company</h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Support</h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-blue-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors duration-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <p className="text-gray-300 text-sm">
            &copy; {currentYear} Path Of Wonders. All rights reserved.
          </p>
          <div className="hidden md:flex gap-6 text-sm">
            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="hover:text-blue-400 transition-colors duration-300">
              Cookie Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors duration-300">
              Terms & Conditions
            </Link>
            {/* <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Accessibility
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Sitemap
            </a> */}
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
