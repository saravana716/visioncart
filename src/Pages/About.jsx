import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import './About.css';

const About = () => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page-wrapper">
            <Navbar />
            <div className="about-hero">
                <h1>About Visionkart</h1>
                <p>Redefining style and clarity for your eyes.</p>
            </div>
            <div className="about-content scroll-reveal">
                <h2>Our Vision</h2>
                <p>We aim to provide the most stylish and comfortable eyewear to help you see the world better and look your best.</p>
            </div>
            <Footers />
        </div>
    );
};

export default About;
