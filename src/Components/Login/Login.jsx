import React from 'react'
import logo from "../../assets/vision_cart_logo.png"
import googleicon from "../../assets/google_icon.png"
import { useNavigate } from 'react-router-dom'
import "../SignUp/SignUp.css"

const Login = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className='signup'>
    <div className='signupLeft'>
        <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
    </div>
    <div className='signupRight'>
        <div className='signupForm'>
    <h1>Log in</h1>
   
    <div className='forminput'>
        <h4>Email or username</h4>
        <input type="email" placeholder='Enter Your Email' />
    </div>
    <div className='forminput'>
        <h4>Password</h4>
        <input type="password" placeholder='Enter Your Password' />
    </div>
    
    <div className='formButtons'>
        <button onClick={() => navigate('/')}>Log in</button>
        <div className='line'>
            <p></p>
            <h3>Or</h3>
            <p></p>
        </div>
        <button><img src={googleicon} alt="" />Log in with Google</button>
    </div>
    <div className='formContent'>
        <div className='remember-forgot'>
            <p className='p'> <input type="checkbox" />Remember Me</p>
            <p className='p link-text'>Forgot Password ?</p>
        </div>
        <p className='p link-text' onClick={() => navigate('/signup')}>Don’t have an account? Sign up</p>
    </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default Login