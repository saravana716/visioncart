import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './Components/SignUp/SignUp'
import Login from './Components/Login/Login'
import Routing from './Routing/Routing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
     <Routing/>
    </div>
  )
}

export default App
