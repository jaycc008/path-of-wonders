import { useEffect, useState } from 'react';
import Header from './components/Header';
import Journey from './components/Journey';
import Courses from './components/Courses';
import Promise from './components/Promise';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Hero2 from './components/Hero2';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* <Hero /> */}
      <Hero2 />
      <Journey />
      <Courses />
      <CallToAction />
      <Testimonials />
      <Promise />
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

export default App;
