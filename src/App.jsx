import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Toaster } from 'react-hot-toast'
/* Global Page Bundle - Fix for production CSS loading */
import './Pages/About.css'
import './Pages/Blogs.css'
import './Pages/ContactPage.css'
import './Pages/ProductDetails.css'
import './Pages/ProductPage.css'
import './Pages/Cart.css'
import './Pages/Checkout.css'
import './Pages/Profile.css'
import './Pages/Wishlist.css'
import './Pages/Orders.css'
import './Pages/OrderDetail.css'
import './Pages/OrderSuccess.css'
import './Pages/OrderFailed.css'
import './Pages/HomeTryOn.css'
import './Pages/VirtualTryOn.css'
import './Pages/BookSlot.css'
import './Pages/Invoice.css'
import './Pages/NotFound.css'
import './Pages/FAQ/FAQ.css'
import './Pages/Legal/LegalPage.css'

import SignUp from './Components/SignUp/SignUp'
import Login from './Components/Login/Login'
import Routing from './Routing/Routing'
import Loader from './Components/Loader/Loader'

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate site entrance or wait for initial assets
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <Loader fullPage={true} />;
  }

  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          success: {
            style: {
              background: '#4ade80',
              color: '#fff',
              fontWeight: '500',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#4ade80',
            },
          },
          error: {
            style: {
              background: '#f87171',
              color: '#fff',
              fontWeight: '500',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#f87171',
            },
          },
        }}
      />
      <div className='App reveal-in'>
        <Routing/>
      </div>
    </>
  )
}

export default App
