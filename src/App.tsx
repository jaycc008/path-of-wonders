import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
