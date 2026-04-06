import React, { useState, useEffect, useRef } from 'react'
import "./UserSlider.css"
import user from "../../assets/book.png"

const UserSlider = () => {
    const images = import.meta.glob('../../assets/role/*.{png,jpg,jpeg,webp}', { eager: true });
    
    const originalUsers = Object.entries(images).map(([path, module], index) => {
        // Extract filename without extension for the title
        const fileName = path.split('/').pop().replace(/\.[^/.]+$/, "");
        return {
            id: index + 1,
            name: fileName,
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
    const visibleCards = isMobile ? 2 : 5; 
    
    // Create triple-duplicated list for a truly infinite feel even with 4 items
    const extendedUsers = [...originalUsers, ...originalUsers, ...originalUsers];

    const [currentIndex, setCurrentIndex] = useState(originalUsers.length); // Start at the first element of second set
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
        if (currentIndex >= originalUsers.length * 2) {
            setIsTransitioning(false); 
            setCurrentIndex(originalUsers.length); 
        } else if (currentIndex <= 0) {
            setIsTransitioning(false);
            setCurrentIndex(originalUsers.length);
        }
    };

    return (
        <div className='userslider-section'>
            <div className='carousel-viewport'>
                <div 
                    className='carousel-track'
                    style={{ 
                        transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                        width: `${extendedUsers.length * (cardWidth + gap)}px`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                        gap: `${gap}px`
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedUsers.map((data, index) => (
                        <div className='usercard' key={index} style={{ width: `${cardWidth}px` }}>
                            <div className='role-img-wrapper'>
                                <img src={data.img} alt="User" />
                            </div>
                            <p className='role-title'>{data.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserSlider