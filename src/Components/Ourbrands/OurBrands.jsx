import React, { useState, useEffect, useRef } from 'react'
import brand from "../../assets/brand.png"
import "./OurBrands.css"

const OurBrands = () => {
    const images = import.meta.glob('../../assets/mybrands/*.{png,jpg,jpeg,webp,svg}', { eager: true });
    
    const originalBrands = Object.entries(images).map(([path, module], index) => {
        return {
            id: index + 1,
            img: module.default || module
        };
    });

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 768;
    const cardWidth = isMobile ? 180 : 240; 
    const gap = isMobile ? 20 : 30; // Matches CSS gap
    
    // Create triple-duplicated list for a truly infinite feel even with 4 items
    const extendedBrands = [...originalBrands, ...originalBrands, ...originalBrands];

    const [currentIndex, setCurrentIndex] = useState(originalBrands.length); // Start at the first element of second set
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        // Reset to middle set for seamless infinite loop
        if (currentIndex >= originalBrands.length * 2) {
            setIsTransitioning(false); 
            setCurrentIndex(originalBrands.length); 
        } else if (currentIndex <= 0) {
            setIsTransitioning(false);
            setCurrentIndex(originalBrands.length);
        }
    };

    return (
        <div className='our-brands-section'>
            <h1>Our Brands</h1>
            
            <div className='carousel-viewport'>
                <div 
                    className='carousel-track'
                    style={{ 
                        transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                        width: `${extendedBrands.length * (cardWidth + gap)}px`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                        gap: `${gap}px`
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedBrands.map((data, index) => (
                        <div className='brand-card' key={index} style={{ width: `${cardWidth}px` }}>
                            <img src={data.img} alt="Our Brand" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OurBrands