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