import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Home from '../Pages/Home'
import ProductPage from '../Pages/ProductPage'
import ProductDetails from '../Pages/ProductDetails'
import Profile from '../Pages/Profile'
import VirtualTryOn from '../Pages/VirtualTryOn'
import HomeTryOn from '../Pages/HomeTryOn'
import BookSlot from '../Pages/BookSlot'
import Cart from '../Pages/Cart'
import Checkout from '../Pages/Checkout'
import OrderSuccess from '../Pages/OrderSuccess'
import Orders from '../Pages/Orders'
import Wishlist from '../Pages/Wishlist'
import OrderDetail from '../Pages/OrderDetail'
import About from '../Pages/About'
import Blogs from '../Pages/Blogs'
import ContactPage from '../Pages/ContactPage'
import NotFound from '../Pages/NotFound'
import Terms from '../Pages/Legal/Terms'
import Privacy from '../Pages/Legal/Privacy'
import Refund from '../Pages/Legal/Refund'
import Shipping from '../Pages/Legal/Shipping'
import Prescription from '../Pages/Legal/Prescription'
import Support from '../Pages/Legal/Support'
import FAQ from '../Pages/FAQ/FAQ'

// Helper component to handle scroll reset on navigation
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll both window and document element to ensure it works across all browsers
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    };

    resetScroll();
    
    // Sometimes a slight delay is needed for content to finish rendering
    const timer = setTimeout(resetScroll, 10);
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
};

const Routing = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/virtual-try-on" element={<VirtualTryOn />} />
        <Route path="/home-try-on" element={<HomeTryOn />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/refund-and-return" element={<Refund />} />
        <Route path="/shipping-policy" element={<Shipping />} />
        <Route path="/prescription-policy" element={<Prescription />} />
        <Route path="/customer-support" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
