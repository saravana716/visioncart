import React from 'react'
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

    // We only need a double set for a seamless CSS loop
    const displayBrands = [...originalBrands, ...originalBrands];

    return (
        <div className='our-brands-section'>
            <h1>Our Brands</h1>
            
            <div className='carousel-viewport'>
                <div className='carousel-track'>
                    {displayBrands.map((data, index) => (
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