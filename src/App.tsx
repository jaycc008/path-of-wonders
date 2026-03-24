import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CoursesProvider } from './contexts/CoursesContext';
import Home from './pages/Home';
import About from './pages/About';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import CoursePurchaseSuccess from './pages/CoursePurchaseSuccess';
import BookPurchaseSuccess from './pages/BookPurchaseSuccess';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CoursesPage from './pages/CoursesPage';
import CourseDetails from './pages/CourseDetails';
import BookCheckout from './pages/BookCheckout';
import PolicyPage from './pages/PolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import FAQPage from './pages/FAQPage';

function ScrollManager() {
  const location = useLocation();

  // Prevent browser from restoring previous scroll position on SPA route changes.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = 'auto';
      };
    }
    return undefined;
  }, []);

  // Snap to top immediately on navigation (no smooth scroll animation).
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CoursesProvider>
          <ScrollManager />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/privacy-policy"
            element={<PolicyPage dataId="a74f1387-b581-4076-bce5-05dbae563c41" pageTitle="Privacy Policy" />}
          />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route
            path="/terms-and-conditions"
            element={<PolicyPage dataId="1ad06f9f-dfa3-4c4b-be37-6274e7f692e7" pageTitle="Terms and Conditions" />}
          />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/book-checkout" element={<BookCheckout />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          {/* Stripe success_url may use /course-purchase/success; keep legacy /course/success */}
          <Route path="/course-purchase/success" element={<CoursePurchaseSuccess />} />
          <Route path="/course/success" element={<CoursePurchaseSuccess />} />
          <Route path="/book/success" element={<BookPurchaseSuccess />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          </Routes>
        </CoursesProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
