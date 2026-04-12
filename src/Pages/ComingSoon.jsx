import React, { useState, useEffect } from 'react';
import './ComingSoon.css';
import { config } from '../config';
import logo from '../assets/vision_cart_logo.png';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const ComingSoon = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const targetDate = new Date(config.launchDate).getTime();
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for subscription logic
        alert('Thank you! We will notify you when we go live.');
    };

    return (
        <div className="coming-soon-container">
            <div className="cs-content reveal-in">
                <img src={logo} alt="VisionCart Logo" className="cs-logo" />
                
                <span className="cs-tag">Something big is coming</span>
                
                <h1 className="cs-title">Our Vision is<br />Coming to Life</h1>
                
                <p className="cs-description">
                    We're working hard to bring you a premium eyewear shopping experience. 
                    Get ready to see the world differently.
                </p>

                <div className="cs-countdown">
                    <div className="countdown-item">
                        <span className="countdown-value">{timeLeft.days}</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">{timeLeft.hours}</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">{timeLeft.minutes}</span>
                        <span className="countdown-label">Minutes</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">{timeLeft.seconds}</span>
                        <span className="countdown-label">Seconds</span>
                    </div>
                </div>

                <form className="cs-notify-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Enter your email for updates" 
                        className="cs-input"
                        required 
                    />
                    <button type="submit" className="cs-btn">Notify Me</button>
                </form>

                <div className="cs-socials">
                    <a href={config.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaInstagram />
                    </a>
                    <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaFacebookF />
                    </a>
                    <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaTwitter />
                    </a>
                    <a href={config.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaLinkedinIn />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
