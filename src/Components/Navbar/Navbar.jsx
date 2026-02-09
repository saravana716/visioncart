import React, { useState } from 'react'
import logo from "../../assets/vision_cart_logo.png"
import { FaRegHeart } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import "./Navbar.css"

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

    const handleNavigation = (path) => {
        navigate(path);
        setShowPopup(false);
    };

    const handleCategoryClick = (category) => {
        navigate(`/products?category=${category}`);
    };

    return (
        <>
        <div className='navbar'>
            <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
            <div className='navtext'>
                <li onClick={() => navigate('/')}>Home</li>
                <li onClick={() => navigate('/products')}>Products</li>
                <li>Blogs</li>
                <li>Contact</li>
            </div>
            <div className='icons'>
                <div className='searchinput'>
                    <input type="text" placeholder="Search..." />
                    <IoIosSearch  className='search'/>
                </div>
                <div className='iconlist'>
                    <FaRegHeart  className='nicon'/>
                    <div className='iconlist'>
                        <IoCartOutline className='nicon'/>
                        <p>0</p>
                    </div>
                    <div className='user-icon-container'>
                        <FaRegUserCircle className='nicon' onClick={togglePopup}/>
                        {showPopup && (
                            <div className='user-popup'>
                                <button onClick={() => handleNavigation('/login')}>Login</button>
                                <button onClick={() => handleNavigation('/signup')}>Sign Up</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Mobile Navbar Structure */}
        <div className='mobile-navbar'>
            <div className='mobile-nav-top'>
                <div className='mobile-nav-left'>
                    <div className='user-icon-container'>
                        <FaRegUserCircle className='mobile-profile-icon' onClick={togglePopup}/>
                        {showPopup && (
                            <div className='user-popup mobile-popup'>
                                <button onClick={() => handleNavigation('/login')}>Login</button>
                                <button onClick={() => handleNavigation('/signup')}>Sign Up</button>
                            </div>
                        )}
                    </div>
                    <div className='mobile-location'>
                        <span className='fast-delivery'>Fast Delivery</span>
                        <span className='select-location'>Select Location ▾</span>
                    </div>
                </div>
                <div className='mobile-nav-right'>
                    <FaRegHeart className='mobile-icon'/>
                    <div className='mobile-bag'>
                        <IoCartOutline className='mobile-icon'/>
                        <span className='badge'>1</span>
                    </div>
                    <div className='mobile-menu-icon'>
                        <div className='bar'></div>
                        <div className='bar'></div>
                        <div className='bar'></div>
                    </div>
                </div>
            </div>
            <div className='mobile-nav-bottom'>
                <div className='mobile-search-container'>
                    <input type="text" placeholder="Search" />
                    <IoIosSearch className='mobile-search-icon'/>
                </div>
                <button className='mobile-try-on-btn'>3D Try-On</button>
            </div>
        </div>

        <div className='navbarnext'>
            <div className='navleft'>
                <li onClick={() => handleCategoryClick('Spectacles')}>Spectacles</li>
                <li onClick={() => handleCategoryClick('Sunglasses')}>Sunglasses</li>
                <li onClick={() => handleCategoryClick('Contact Lenses')}>Contact Lenses</li>
                <li onClick={() => handleCategoryClick('Computer Glasses')}>Computer Glasses</li>
                <li onClick={() => handleCategoryClick('Kids Collection')}>Kids Collection</li>
            </div>
        <div className='navbuttons'>
            <button className='btn1'>Home Try-On</button>
            <button className='btn2'>3D Virtual Try-On</button>
        </div>
    </div>
    </>
  )
}

export default Navbar