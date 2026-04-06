import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import './ContactPage.css';

const ContactPage = () => {
    return (
        <div className="contact-page-wrapper">
            <Navbar />
            <div className="contact-container">
                <div className="contact-info-section scroll-reveal">
                    <h1>Get in Touch</h1>
                    <p>Have questions? We're here to help.</p>
                    <div className="contact-details">
                        <div className="contact-item">
                            <strong>Email:</strong>
                            <span>visionkart.onlinestore@gmail.com</span>
                        </div>
                        <div className="contact-item">
                            <strong>Phone:</strong>
                            <span>+91 70104 00258</span>
                        </div>
                        <div className="contact-item">
                            <strong>Address:</strong>
                            <span>19,Thiruthangal Road, Near Senaithalaivar kalyana Mandapam, Sivakasi-626123</span>
                        </div>
                    </div>
                </div>
                <div className="contact-form-section scroll-reveal">
                    <form className="premium-form">
                        <input type="text" placeholder="Full Name" />
                        <input type="email" placeholder="Email Address" />
                        <textarea placeholder="Your Message" rows="5"></textarea>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
            <Footers />
        </div>
    );
};

export default ContactPage;
