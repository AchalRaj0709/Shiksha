import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import CourseDetails from './components/CourseDetails';
import MyLearning from './pages/MyLearning';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import Payment from './pages/Payment';
import Cart from './pages/Cart';
import AccountSettings from './pages/AccountSettings';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Navbar onOpenAuth={handleOpenAuth} />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/my-learning" element={<MyLearning />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/payment/:courseId" element={<Payment />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                {/* Other routes */}
              </Routes>

              <Footer />
              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleCloseAuth}
                initialMode={authMode}
              />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
