import React from 'react'
import logo from "../../assets/vision_cart_logo.png"
import googleicon from "../../assets/google_icon.png"
import { useNavigate } from 'react-router-dom'
import "./SignUp.css"

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className='signup'>
    <div className='signupLeft'>
        <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
    </div>
    <div className='signupRight'>
        <div className='signupForm'>
    <h1>Sign Up</h1>
    <div className='forminput'>
        <h4>First name</h4>
        <input type="text" placeholder='Enter Your FirstName' />
    </div>
    <div className='forminput'>
        <h4>Last name</h4>
        <input type="text" placeholder='Enter Your LastName' />
    </div>
    <div className='forminput'>
        <h4>Email</h4>
        <input type="email" placeholder='Enter Your Email' />
    </div>
    <div className='forminput'>
        <h4>Password</h4>
        <input type="password" placeholder='Enter Your Password' />
    </div>
    <div className='forminput'>
        <p>– Must be at least 8 characters</p>
        <p>– Must include one lowercase character</p>
        <p>– Must include one uppercase character</p>
        <p>– Can't be too common</p>
    </div>
    <div className='formButtons'>
        <button onClick={() => navigate('/')}>Sign up</button>
        <div className='line'>
            <p></p>
            <h3>Or</h3>
            <p></p>
        </div>
        <button><img src={googleicon} alt="" />Sign up with Google</button>
    </div>
    <div className='formContent'>
        <p className='pname'>By clicking "Sign Up" or "Sign up with Google" you accept the Terms of Service and Privacy Policy.</p>
        <p className='pname' style={{marginTop: '10px'}}>Already have an account? <span className='link-text' onClick={() => navigate('/login')}>Log in</span></p>
    </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default SignUp