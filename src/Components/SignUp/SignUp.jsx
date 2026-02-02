import React from 'react'
import logo from "../../assets/vision_cart_logo.png"
import googleicon from "../../assets/google_icon.png"
import "./SignUp.css"
const SignUp = () => {
  return (
    <>
    <div className='signup'>
    <div className='signupLeft'>
        <img src={logo} alt="" />
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
        <input type="text" placeholder='Enter Your Password' />
    </div>
    <div className='forminput'>
        <p>– Must be at least 8 characters</p>
        <p>– Must include one lowercase character</p>
        <p>– Must include one uppercase character</p>
        <p>– Can't be too common</p>
    </div>
    <div className='formButtons'>
        <button>Sign up</button>
        <div className='line'>
            <p></p>
            <h3>Or</h3>
            <p></p>
        </div>
        <button><img src={googleicon} alt="" />Sign up with Google</button>
    </div>
    <div className='formContent'>
        <p className='pname'>By clicking "Sign Up" or "Sign up with Google" you accept the Terms of Service and Privacy Policy.</p>
        <p className='pname'>Already have an account?    Log in</p>
    </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default SignUp