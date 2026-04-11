import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Footer.css"
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import logo from "../../assets/vision_cart_logo.png"

const Footers = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open("https://wa.me/919344116571", "_blank");
  };

  return (
    <footer className='footer-container'>
        {/* Marquee Section - Only Logo Scroll */}
        <div className='footer-marquee'>
            <div className='marquee-content'>
                {[...Array(8)].map((_, i) => (
                    <img key={i} src={logo} alt="VisionKart Logo" className="marquee-logo-only" />
                ))}
            </div>
            <div className='marquee-content'>
                {[...Array(8)].map((_, i) => (
                    <img key={i} src={logo} alt="VisionKart Logo" className="marquee-logo-only" />
                ))}
            </div>
        </div>

        {/* Main Footer Content */}
        <div className='footer-main'>
            <div className='footer-column brand-column'>
                <h3>The VisionKart Promise</h3>
                <p>Your trusted destination for high-quality, affordable eyewear. See better, feel better, and express your style effortlessly.</p>
            </div>

            <div className='footer-column'>
                <h3>Quick Links</h3>
                <ul>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li onClick={() => navigate('/about')}>About</li>
                    <li onClick={() => navigate('/products')}>Products</li>
                    <li onClick={() => navigate('/blogs')}>Blogs</li>
                    <li onClick={() => navigate('/contact')}>Contact</li>
                </ul>
            </div>

            <div className='footer-column'>
                <h3>Category</h3>
                <ul>
                    <li onClick={() => navigate('/products')}>Spectacles</li>
                    <li onClick={() => navigate('/products')}>Sunglasses</li>
                    <li onClick={() => navigate('/products')}>Reading Glasses</li>
                    <li onClick={() => navigate('/products')}>Computer Glasses</li>
                    <li onClick={() => navigate('/products')}>Kids Collection</li>
                    <li onClick={() => navigate('/products')}>Contact Lenses</li>
                </ul>
            </div>

            <div className='footer-column legal-column'>
                <h3>Legal</h3>
                <ul>
                    <li onClick={() => navigate('/faq')}>FAQ</li>
                    <li onClick={() => navigate('/terms-and-conditions')}>Terms & Condition</li>
                    <li onClick={() => navigate('/privacy-policy')}>Privacy Policy</li>
                    <li onClick={() => navigate('/refund-and-return')}>Refund & Return</li>
                    <li onClick={() => navigate('/shipping-policy')}>Shipping Policy</li>
                    <li onClick={() => navigate('/prescription-policy')}>Prescription Policy</li>
                    <li onClick={() => navigate('/customer-support')}>Customer Support</li>
                </ul>
            </div>

            <div className='footer-column social-column'>
                <h3>Connect & Follow</h3>
                <div className='social-icons'>
                    <div className='social-icon-wrapper'><FaInstagram /></div>
                    <div className='social-icon-wrapper'><FaFacebookF /></div>
                    <div className='social-icon-wrapper' onClick={openWhatsApp}><FaWhatsapp /></div>
                </div>
            </div>
        </div>

        {/* Fixed Floating WhatsApp Button */}
        <div className="fixed-whatsapp-btn" onClick={openWhatsApp} title="Chat with us on WhatsApp">
            <FaWhatsapp />
            <span className="tooltip-text">Chat with us</span>
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