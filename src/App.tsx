import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import CoursePurchaseSuccess from './pages/CoursePurchaseSuccess';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CoursesPage from './pages/CoursesPage';
import CourseDetails from './pages/CourseDetails';
import BookCheckout from './pages/BookCheckout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/book-checkout" element={<BookCheckout />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/course/success" element={<CoursePurchaseSuccess />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
