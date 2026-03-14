import React, { useState } from 'react'
import logo from "../../assets/vision_cart_logo.png"
import googleicon from "../../assets/google_icon.png"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import "./SignUp.css"
import { auth, db } from '../../firebase.config'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password || !formData.firstName || !formData.phoneNumber) {
      toast.error('Please fill in all required fields (including phone number).');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save additional user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        createdAt: new Date().toISOString()
      });

      toast.success("Account created successfully!");
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save Google user to Firestore if they don't exist
      await setDoc(doc(db, "users", user.uid), {
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ').slice(1).join(' '),
        email: user.email,
        createdAt: new Date().toISOString()
      }, { merge: true });

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }; */

  return (
    <>
    <div className='signup'>
    <div className='signupLeft'>
        <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
    </div>
    <div className='signupRight'>
        <form className='signupForm' onSubmit={handleSignUp}>
    <h1>Sign Up</h1>
    <div className='forminput'>
        <h4>First name</h4>
        <input 
          type="text" 
          name="firstName"
          placeholder='Enter Your FirstName' 
          value={formData.firstName}
          onChange={handleChange}
          required
        />
    </div>
    <div className='forminput'>
        <h4>Last name</h4>
        <input 
          type="text" 
          name="lastName"
          placeholder='Enter Your LastName' 
          value={formData.lastName}
          onChange={handleChange}
        />
    </div>
    <div className='forminput'>
        <h4>Email</h4>
        <input 
          type="email" 
          name="email"
          placeholder='Enter Your Email' 
          value={formData.email}
          onChange={handleChange}
          required
        />
    </div>
    <div className='forminput'>
        <h4>Password</h4>
        <input 
          type="password" 
          name="password"
          placeholder='Enter Your Password' 
          value={formData.password}
          onChange={handleChange}
          required
        />
    </div>
    <div className='forminput'>
        <h4>Phone Number</h4>
        <input 
          type="tel" 
          name="phoneNumber"
          placeholder='Enter Your Phone Number (e.g. 9876543210)' 
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
    </div>
    <div className='forminput'>
        <p>– Must be at least 8 characters</p>
        <p>– Must include one lowercase character</p>
        <p>– Must include one uppercase character</p>
        <p>– Can't be too common</p>
    </div>
    <div className='formButtons'>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        {/* <div className='line'>
            <p></p>
            <h3>Or</h3>
            <p></p>
        </div>
        <button type="button" onClick={handleGoogleSignUp}>
          <img src={googleicon} alt="" />Sign up with Google
        </button> */}
    </div>
    <div className='formContent'>
        <p className='pname'>By clicking "Sign Up" you accept the Terms of Service and Privacy Policy.</p>
        <p className='pname' style={{textAlign: 'center', marginTop: '10px'}}>
          Already have an account? <span className='link-text' onClick={() => navigate('/login')}>Log in</span>
        </p>
    </div>
        </form>
    </div>
    </div>
    </>
  )
}

export default SignUp
