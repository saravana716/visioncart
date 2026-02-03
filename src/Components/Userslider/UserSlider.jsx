import React, { useState, useEffect, useRef } from 'react'
import "./UserSlider.css"
import user from "../../assets/book.png"

const UserSlider = () => {
    const originalUsers = [
        { id: 1, name: "jknkh", img: user },
        { id: 2, name: "jknkh", img: user },
        { id: 3, name: "jknkh", img: user },
        { id: 4, name: "jknkh", img: user },
        { id: 5, name: "jknkh", img: user },
        { id: 6, name: "jknkh", img: user },
        { id: 7, name: "jknkh", img: user },
        { id: 8, name: "jknkh", img: user },
        { id: 9, name: "jknkh", img: user },
        { id: 10, name: "jknkh", img: user }
    ];

    const cardWidth = 240; // 220px width + 20px gap
    const visibleCards = 5; 
    
    // Create duplicated list for seamless looping
    const extendedUsers = [...originalUsers, ...originalUsers.slice(0, visibleCards)];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        if (currentIndex >= originalUsers.length) {
             return;
        }
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        if (currentIndex === originalUsers.length) {
            setIsTransitioning(false); 
            setCurrentIndex(0); 
        }
    };

    return (
        <div className='userslider-section'>
            <div className='carousel-viewport'>
                <div 
                    className='carousel-track'
                    style={{ 
                        transform: `translateX(-${currentIndex * cardWidth}px)`,
                        width: `${extendedUsers.length * cardWidth}px`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {extendedUsers.map((data, index) => (
                        <div className='usercard' key={index}>
                            <div className='userimg'>
                                <img src={data.img} alt="User" />
                            </div>
                            <p>{data.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserSlider