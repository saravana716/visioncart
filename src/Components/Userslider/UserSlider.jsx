import React, { useState, useEffect, useRef } from 'react'
import "./UserSlider.css"
import user from "../../assets/book.png"

const UserSlider = () => {
    const images = import.meta.glob('../../assets/role/*.{png,jpg,jpeg,webp}', { eager: true });
    
    const originalUsers = Object.entries(images).map(([path, module], index) => {
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
    const isTablet = windowWidth > 768 && windowWidth <= 1024;
    
    const visibleCount = isMobile ? 2 : (isTablet ? 3 : 5);
    const cardWidth = windowWidth / visibleCount; 
    const gap = 0;
    
    const extendedUsers = [...originalUsers, ...originalUsers, ...originalUsers];

    const [currentIndex, setCurrentIndex] = useState(originalUsers.length);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        if (currentIndex >= originalUsers.length * 2) {
            setIsTransitioning(false); 
            setCurrentIndex(originalUsers.length); 
        } else if (currentIndex < originalUsers.length) {
            if (currentIndex <= 0) {
                setIsTransitioning(false);
                setCurrentIndex(originalUsers.length);
            }
        }
    };

    return (
        <div className='userslider-section'>
            <div className='carousel-container'>
                <div className='carousel-viewport'>
                    <div 
                        className='carousel-track'
                        style={{ 
                            transform: `translateX(-${currentIndex * cardWidth}px)`,
                            width: `${extendedUsers.length * cardWidth}px`,
                            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
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
        </div>
    )
}

export default UserSlider