import React, { useState, useEffect, useRef } from 'react'
import brand from "../../assets/brand.png"
import "./OurBrands.css"

const OurBrands = () => {
    const originalBrands = [
        { id: 1, img: brand },
        { id: 2, img: brand },
        { id: 3, img: brand },
        { id: 4, img: brand },
        { id: 5, img: brand },
        { id: 6, img: brand },
        { id: 7, img: brand },
        { id: 8, img: brand },
        { id: 9, img: brand }
    ];

    const cardWidth = 240; // 220px width + 20px gap
    const visibleCards = 5; 
    
    // Create an extended list: Original + First few items (buffer)
    // We need enough buffer to cover the view while resetting
    const extendedBrands = [...originalBrands, ...originalBrands.slice(0, visibleCards)];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        if (currentIndex >= originalBrands.length) {
            // We are at the end buffer, logic handled in transitionEnd, but safe guard here
             return;
        }
        
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        // Check if we've reached the duplicated part (the buffer start)
        // logic: if currentIndex == originalBrands.length, we are showing the first item again (but it's the duplicate)
        if (currentIndex === originalBrands.length) {
            setIsTransitioning(false); // Disable transition for instant jump
            setCurrentIndex(0); // Jump back to real start
        }
    };

    return (
        <div className='our-brands-section'>
            <h1>Our Brands</h1>
            
            <div className='carousel-viewport'>
                <div 
                    className='carousel-track'
                    style={{ 
                        transform: `translateX(-${currentIndex * cardWidth}px)`,
                        width: `${extendedBrands.length * cardWidth}px`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedBrands.map((data, index) => (
                        <div className='brand-card' key={index}>
                            <img src={data.img} alt="Our Brand" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OurBrands