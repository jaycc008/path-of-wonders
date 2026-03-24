import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Journey from '../components/Journey';
import Courses from '../components/Courses';
import Promise from '../components/Promise';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Hero2 from '../components/Hero2';
import { getSubscription, Subscription } from '../api/subscription';

export default function Home() {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // Fetch subscription data on component mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscription();
        setSubscription(data);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, []);

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
       <Hero2 />
      <Journey />
     {/* <Courses /> */}
      <CallToAction subscription={subscription} isLoading={isLoadingSubscription} />
      <Testimonials />
      <Promise />
      <Footer />
      <ScrollToTop show={showScrollTop} />
    </div>
  );
}

