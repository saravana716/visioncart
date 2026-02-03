import React from 'react'
import logo from "../../assets/vision_cart_logo.png"
import { FaRegHeart } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import "./Navbar.css"
const Navbar = () => {
  return (
    <>
    <div className='navbar'>
        <img src={logo} alt="" />
        <div className='navtext'>
            <li>Home</li>
            <li>Products</li>
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
<FaRegUserCircle className='nicon'/>
            </div>
        </div>
    </div>
    
    {/* Mobile Navbar Structure */}
    <div className='mobile-navbar'>
        <div className='mobile-nav-top'>
            <div className='mobile-nav-left'>
                <FaRegUserCircle className='mobile-profile-icon'/>
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
            <li>Spectacles</li>
            <li>Sunglasses</li>
            <li>Contact Lenses</li>
            <li>Computer Glasses</li>
            <li>Kids Collection</li>
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