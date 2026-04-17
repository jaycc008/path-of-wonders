import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Courses from '../components/Courses';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Hero3 from '../components/Hero3.tsx';
import ThisIsNotSchool from '../components/ThisIsNotSchool';
import WhoThisIsFor from '../components/WhoThisIsFor';
import HowItWorks from '../components/HowItWorks';
import FounderStory from '../components/FounderStory';
import Pricing from '../components/Pricing.tsx';
import FinalCTA from '../components/FinalCTA';
import NewsletterSubscribe from '../components/NewsletterSubscribe.tsx';

export default function Home() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to subscription section when hash is #subscription
  useEffect(() => {
    if (location.hash === '#subscription') {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const subscriptionElement = document.getElementById('subscription');
        if (subscriptionElement) {
          subscriptionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div>
      <Header />
      {/* <Hero /> */}
       <Hero3 />
      <ThisIsNotSchool />
      <WhoThisIsFor />
      {/* <Journey /> */}
     <Courses />
     {/* <Process /> */}
      <HowItWorks />
      <FounderStory />
      <NewsletterSubscribe />
      <Pricing />
      <FinalCTA />
      {/* <CallToAction subscription={subscription} isLoading={isLoadingSubscription} /> */}
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

