import React, { useState, useEffect } from 'react'
import logo from "../../assets/vision_cart_logo.png"
import googleicon from "../../assets/google_icon.png"
import { useNavigate } from 'react-router-dom'
import "../SignUp/SignUp.css"
import { auth } from '../../firebase.config'
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth'

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
        'size': 'invisible'
      });
      
      const appVerifier = window.recaptchaVerifier;
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+91${formattedPhone}`;
      }
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err) {
      console.error("Full Phone Auth Error Object:", err);
      console.error("Error Code:", err.code);
      console.error("Error Message:", err.message);
      
      if (err.code === 'auth/invalid-app-credential') {
        setError("Firebase cannot verify this request. Try opening the site in an Incognito/Private window or use a different browser.");
      } else {
        setError(err.message);
      }
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className='signup'>
    <div className='signupLeft'>
        <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
    </div>
    <div className='signupRight'>
        <div className='signupForm'>
    <h1>Log in</h1>
    {error && <p style={{color: 'red', marginBottom: '10px', fontSize: '14px'}}>{error}</p>}
    
    <div className='signup-container'> {/* New wrapper for potential animation/scoping */}
    <div className='login-toggle'>
        <p 
          className={loginMethod === 'email' ? 'active' : ''}
          onClick={() => {setLoginMethod('email'); setConfirmationResult(null);}}
        >Email Login</p>
        <p 
          className={loginMethod === 'phone' ? 'active' : ''}
          onClick={() => setLoginMethod('phone')}
        >Phone Login</p>
    </div>

    {loginMethod === 'email' ? (
      <form onSubmit={handleEmailLogin} className="login-form-inner">
        <div className='forminput'>
            <h4>Email Address</h4>
            <input 
              type="email" 
              placeholder='name@example.com' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
        </div>
        <div className='forminput'>
            <h4>Password</h4>
            <input 
              type="password" 
              placeholder='Enter your password' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </div>
        <div className='formButtons'>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
        </div>
      </form>
    ) : (
      !confirmationResult ? (
        <form onSubmit={handleSendOtp} className="login-form-inner">
          <div className='forminput'>
              <h4>Phone Number</h4>
              <input 
                type="tel" 
                placeholder='e.g. 9876543210' 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p>We'll send a 6-digit code to verify your number.</p>
          </div>
          <div className='formButtons'>
              <button type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="login-form-inner">
          <div className='forminput'>
              <h4>Enter OTP</h4>
              <input 
                type="text" 
                placeholder='6-digit code' 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p>Code sent to {phoneNumber}</p>
          </div>
          <div className='formButtons'>
              <button type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
          </div>
        </form>
      )
    )}
    
    <div id="recaptcha-container"></div>
    
    <div className='formButtons'>
        <div className='line'>
            <p></p>
            <h3>Or</h3>
            <p></p>
        </div>
        <button type="button" onClick={handleGoogleLogin} className="google-btn">
          <img src={googleicon} alt="" /> Log in with Google
        </button>
    </div>

    <div className='formContent'>
        <div className='remember-forgot'>
            <label>
              <input type="checkbox" /> 
              Remember Me
            </label>
            <p className='link-text'>Forgot Password?</p>
        </div>
        <p className='pname' style={{textAlign: 'center', marginTop: '10px'}}>
          Don’t have an account? <span className='link-text' onClick={() => navigate('/signup')}>Sign up</span>
        </p>
    </div>
    </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default Login