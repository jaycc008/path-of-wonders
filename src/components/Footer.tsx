import { GraduationCap, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">10D School</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering learners worldwide with innovative education solutions for the digital age.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Courses</h3>
            <ul className="space-y-4">
              {['Web Development', 'Data Science', 'Design', 'Business'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
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
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} 10D School. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Accessibility
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Sitemap
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
