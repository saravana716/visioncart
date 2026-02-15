import React, { useState } from 'react'
import logo from "../../assets/vision_cart_logo.png"
import { FaRegHeart } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import "./Navbar.css"
import { useEffect } from 'react';
import MegaMenu from './MegaMenu';

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // State for mega menu
  const navigate = useNavigate();

  // Manage background scroll lock
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isSidebarOpen]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

    const handleNavigation = (path) => {
        navigate(path);
        setShowPopup(false);
        setIsSidebarOpen(false);
        document.body.classList.remove('no-scroll');
    };

    const handleCategoryClick = (category) => {
        navigate(`/products?category=${category}`);
        setIsSidebarOpen(false);
        document.body.classList.remove('no-scroll');
        setActiveCategory(null); // Close menu on click
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Mega Menu Handlers
    const handleMouseEnter = (category) => {
        setActiveCategory(category);
    };

    const handleMouseLeave = () => {
        setActiveCategory(null);
    };

    // Categories List
    const categories = [
        'Spectacles', 
        'Sunglasses', 
        'Contact Lenses', 
        'Computer Glasses', 
        'Kids Collection', 
        'Reading Glasses'
    ];

    return (
        <>
        <div className='navbar'>
            <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
            <div className='navtext'>
                <li onClick={() => navigate('/')}>Home</li>
                <li onClick={() => navigate('/about')}>About</li>
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
                    <div className='mobile-menu-icon' onClick={toggleSidebar}>
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

        {/* Mobile Sidebar */}
        <div className={`mobile-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
        <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="sidebar-logo" />
                <button className="close-sidebar" onClick={toggleSidebar}>✕</button>
            </div>
            <div className="sidebar-content">
                <ul className="sidebar-nav">
                    <li onClick={() => handleNavigation('/')}>Home</li>
                    <li onClick={() => handleNavigation('/products')}>All Products</li>
                    <li className="sidebar-section-title">Categories</li>
                    {categories.map((category) => (
                        <li key={category} onClick={() => handleCategoryClick(category)}>{category}</li>
                    ))}
                    <li className="sidebar-section-title">Others</li>
                    <li>Blogs</li>
                    <li>Contact Us</li>
                </ul>
            </div>
        </div>

        <div className='navbarnext' onMouseLeave={handleMouseLeave}>
            <div className='navleft'>
                {categories.map((category) => (
                    <li 
                        key={category}
                        onMouseEnter={() => handleMouseEnter(category)}
                        onClick={() => handleCategoryClick(category)}
                        className={activeCategory === category ? 'active' : ''}
                    >
                        {category}
                    </li>
                ))}
            </div>
            <div className='navbuttons'>
                <button className='btn1'>Home Try-On</button>
                <button className='btn2'>3D Virtual Try-On</button>
            </div>
            {/* Mega Menu Display */}
            {activeCategory && <MegaMenu category={activeCategory} onClose={handleMouseLeave} />}
        </div>
    </>
  )
}

export default Navbar