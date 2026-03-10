import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PolicyPage dataId="a74f1387-b581-4076-bce5-05dbae563c41" />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/terms-and-conditions" element={<PolicyPage dataId="1ad06f9f-dfa3-4c4b-be37-6274e7f692e7" />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/book-checkout" element={<BookCheckout />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/course/success" element={<CoursePurchaseSuccess />} />
          <Route path="/book/success" element={<BookPurchaseSuccess />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
