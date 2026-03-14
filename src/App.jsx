import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Toaster } from 'react-hot-toast'
import './App.css'
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
    <div className='App reveal-in'>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
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
      <Routing/>
    </div>
  )
}

export default App
