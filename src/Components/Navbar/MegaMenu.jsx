import React from 'react';
import './MegaMenu.css';
import brandPlaceholder from '../../assets/brand.png';
import promoImage from '../../assets/image 1.png'; // Using a placeholder image

const MegaMenu = ({ category, onClose }) => {
    // Data structure for different categories
    // Only "Spectacles" has full data based on the image, others will use similar structure or placeholders
    const menuData = {
        'Spectacles': {
            gender: ['Men', 'Women', 'Unisex', 'Kids'],
            style: ['Full Rim', 'Half Rim', 'Rimless'],
            lensType: ['ARC', 'Blue Cut', 'UV Protect', 'Auto Cooling'],
            shape: ['Rectangle', 'Round', 'Cat eye', 'Aviatar', 'Oval', 'Square'],
            brands: [brandPlaceholder, brandPlaceholder, brandPlaceholder] // Using placeholder for now
        },
        'Sunglasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Aviator', 'Wayfarer', 'Clubmaster'],
            lensType: ['Polarized', 'UV Protection', 'Gradient'],
            shape: ['Aviator', 'Square', 'Round', 'Oversized'],
            brands: [brandPlaceholder, brandPlaceholder]
        },
        'Contact Lenses': {
            gender: [], // Might not be applicable, but keeping structure
            style: ['Daily Disposable', 'Monthly Disposable', 'Yearly'],
            lensType: ['Colored', 'Clear', 'Toric'],
            shape: [],
            brands: [brandPlaceholder, brandPlaceholder]
        },
        'Computer Glasses': {
            gender: ['Men', 'Women', 'Kids'],
            style: ['Full Rim', 'Rimless'],
            lensType: ['Blue Cut', 'Anti-Glare'],
            shape: ['Rectangle', 'Round'],
            brands: [brandPlaceholder]
        },
        'Kids Collection': {
             gender: ['Boys', 'Girls'],
             style: ['Full Rim', 'Flexible'],
             lensType: ['Blue Cut', 'Unbreakable'],
             shape: ['Rectangle', 'Oval'],
             brands: [brandPlaceholder]
        },
        'Reading Glasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Full Rim', 'Rimless', 'Half Rim'],
            lensType: ['Anti-Glare', 'Blue Cut', 'Bifocal'],
            shape: ['Rectangle', 'Round', 'Oval'],
            brands: [brandPlaceholder]
       }
    };

    const currentData = menuData[category];

    if (!currentData) return null;

    return (
        <div className="mega-menu" onMouseLeave={onClose}>
            <div className="mega-menu-content">
                {/* Column 1: Gender */}
                {currentData.gender && currentData.gender.length > 0 && (
                    <div className="menu-column">
                        <h3>Gender</h3>
                        <ul>
                            {currentData.gender.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Column 2: Style */}
                {currentData.style && currentData.style.length > 0 && (
                    <div className="menu-column">
                        <h3>Style</h3>
                        <ul>
                            {currentData.style.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Column 3: Lens Type */}
                {currentData.lensType && currentData.lensType.length > 0 && (
                     <div className="menu-column">
                        <h3>Lens Type</h3>
                        <ul>
                            {currentData.lensType.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Column 4: Shape */}
                 {currentData.shape && currentData.shape.length > 0 && (
                    <div className="menu-column">
                        <h3>Shape</h3>
                        <ul>
                            {currentData.shape.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Column 5: Our Brand */}
                 {currentData.brands && currentData.brands.length > 0 && (
                    <div className="menu-column brand-column">
                        <h3>Our Brand</h3>
                        <div className="brand-grid">
                            {currentData.brands.map((brandImg, index) => (
                                <div key={index} className="brand-item">
                                    <img src={brandImg} alt="Brand" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Column 6: Promo Image */}
                <div className="menu-column promo-column">
                    <img src={promoImage} alt="Promo" className="promo-image" />
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
