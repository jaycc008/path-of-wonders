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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PolicyPage dataId="a74f1387-b581-4076-bce5-05dbae563c41" title="Privacy Policy" />} />
          <Route path="/cookie-policy" element={<PolicyPage dataId="793d5b02-7a73-4068-b488-b0e293687493" title="Cookie Policy" />} />
          <Route path="/terms-and-conditions" element={<PolicyPage dataId="1ad06f9f-dfa3-4c4b-be37-6274e7f692e7" title="Terms & Conditions" />} />
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
