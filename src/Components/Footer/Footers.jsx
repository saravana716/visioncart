import React from 'react'
import "./Footer.css"
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import eyeIcon from "../../assets/eyeimg.png" // Assuming this is the eye icon used in the marquee

const Footers = () => {
  return (
    <footer className='footer-container'>
        {/* Marquee Section */}
        <div className='footer-marquee'>
            <div className='marquee-content'>
                <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
            </div>
             <div className='marquee-content'>
                <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
                 <span>VISIONKART</span>
                <img src={eyeIcon} alt="VisionKart Eye" className="marquee-icon" />
            </div>
        </div>

        {/* Main Footer Content */}
        <div className='footer-main'>
            <div className='footer-column brand-column'>
                <h3>The VisionKart Promise</h3>
                <p>Your trusted destination for high-quality, affordable eyewear. See better, feel better, and express your style effortlessly.</p>
                
                <div className='footer-mini-links'>
                    <a href="#">FAQ</a>
                    <a href="#">Terms & Condition</a>
                </div>
            </div>

            <div className='footer-column'>
                <h3>Quick Links</h3>
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Blogs</li>
                    <li>Contact</li>
                </ul>
            </div>

            <div className='footer-column'>
                <h3>Category</h3>
                <ul>
                    <li>Spectacles</li>
                    <li>Sunglasses</li>
                    <li>Contact Lenses</li>
                    <li>Computer Glasses</li>
                    <li>Kids Collection</li>
                </ul>
            </div>

            <div className='footer-column social-column'>
                <h3>Connect & Follow</h3>
                <div className='social-icons'>
                    <FaInstagram />
                    <FaFacebookF />
                    <FaWhatsapp />
                    <FaXTwitter />
                </div>
            </div>
        </div>

        {/* Copyright Section */}
        <div className='footer-copyright'>
            <p>© Copyright 2025 VisionKart — All Rights Reserved.</p>
            <p>Made with <span style={{color: 'red'}}>♥</span> by VisionKart Team</p>
        </div>
    </footer>
  )
}

export default Footers