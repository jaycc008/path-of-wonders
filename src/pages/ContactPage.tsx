import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ContactUs from '../components/ContactUs';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function ContactPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Header />
      <ContactUs />
      <FinalCTA />
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}
