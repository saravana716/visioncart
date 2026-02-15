import React, { useState, useEffect } from 'react';
import sliderimg from "../../assets/sliderimg.png";
import image1 from "../../assets/image 1.png"; // Importing another image for rotation
import "./Slider.css";

const Slider = () => {
    const slides = [
        {
            heading: 'See',
            highlight: 'Better',
            subheading: 'Find Your Perfect Eyewear. Try Before You Buy.',
            desc1: 'Experience frames instantly with our Virtual Try-On (Live AR + Photo Upload)',
            desc2: 'and discover eyewear that fits your style perfectly.',
            image: sliderimg,
            color: '#FF0075' // Example color for "See"
        },
        {
            heading: 'Feel',
            highlight: 'Better',
            subheading: 'Comfort Meets Style. Designed for You.',
            desc1: 'Lightweight materials and ergonomic designs ensuring all-day comfort',
            desc2: 'without compromising on the trendiest looks.',
            image: image1,
             color: '#FF0075' // Example color for "Feel" - keep pink as per design request potentially
        },
        {
            heading: 'Look',
            highlight: 'Better',
            subheading: 'Elevate Your Style with Premium Frames.',
            desc1: 'Choose from a wide range of curated collections that match your personality',
            desc2: 'and make a statement wherever you go.',
            image: sliderimg, // Reusing sliderimg for the third slide for now
             color: '#FF0075' // Example color for "Look"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsAnimating(false);
            }, 500); // 500ms should match CSS transition time
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    const slide = slides[currentSlide];

    return (
        <>
            <div className='slider'>
                <div className='sliderleft'>
                    <div className='text-content'>
                        <h1>
                            <span className={`heading-text ${isAnimating ? 'slide-up-out' : 'slide-up-in'}`} style={{ display: 'inline-block', color: slide.color }}>
                                {slide.heading}
                            </span> 
                            <span> {slide.highlight}</span>
                        </h1>
                        <h3>{slide.subheading}</h3>
                        <div className='para'>
                            <p>{slide.desc1}</p>
                            <p>{slide.desc2}</p>
                        </div>
                    </div>
                    <div className='sliderbtn'>
                        <button className='sliderbtnleft'>Try Frames Virtually</button>
                        <button className='sliderbtnright'>Shop Eyewear</button>
                    </div>
                </div>
                <div className='sliderright'>
                    <div className={`image-container ${isAnimating ? 'slide-up-out' : 'slide-up-in'}`}>
                        <img src={slide.image} alt="Eyewear Model" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Slider;