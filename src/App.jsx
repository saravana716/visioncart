import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Toaster } from 'react-hot-toast'
import './App.css'
import SignUp from './Components/SignUp/SignUp'
import Login from './Components/Login/Login'
import Routing from './Routing/Routing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
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
