import React from 'react';
import './MegaMenu.css';
import brandPlaceholder from '../../assets/brand.png';
import promoImage from '../../assets/image 1.png';
import { useNavigate } from 'react-router-dom';

const MegaMenu = ({ category: categoryObj, onClose }) => {
    const navigate = useNavigate();
    const categoryName = categoryObj?.name || '';
    
    // Data structure for fallbacks if Firestore doesn't have these fields
    const fallbackData = {
        'Spectacles': {
            gender: ['Men', 'Women', 'Unisex', 'Kids'],
            style: ['Full Rim', 'Half Rim', 'Rimless'],
            lensType: ['ARC', 'Blue Cut', 'UV Protect', 'Auto Cooling'],
            shape: ['Rectangle', 'Round', 'Cat eye', 'Aviatar', 'Oval', 'Square'],
            brands: [brandPlaceholder, brandPlaceholder, brandPlaceholder]
        },
        'Sunglasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Aviator', 'Wayfarer', 'Clubmaster'],
            lensType: ['Polarized', 'UV Protection', 'Gradient'],
            shape: ['Aviator', 'Square', 'Round', 'Oversized'],
            brands: [brandPlaceholder, brandPlaceholder]
        },
        'Reading Glasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Full Rim', 'Rimless', 'Half Rim'],
            lensType: ['Anti-Glare', 'Blue Cut', 'Bifocal'],
            shape: ['Rectangle', 'Round', 'Oval'],
            brands: [brandPlaceholder]
        },
        'Computer Glasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Full Rim', 'Half Rim'],
            lensType: ['Blue Cut', 'Anti-Glare'],
            shape: ['Rectangle', 'Square', 'Round'],
            brands: [brandPlaceholder, brandPlaceholder]
        },
        'Kids Collection': {
            gender: ['Boys', 'Girls', 'Unisex'],
            style: ['Full Rim'],
            lensType: ['ARC', 'Blue Cut'],
            shape: ['Round', 'Square', 'Rectangle'],
            brands: [brandPlaceholder]
        }
    };

    // Merge Firestore data with fallbacks
    const currentData = {
        subcategories: categoryObj?.subcategories || [],
        gender: categoryObj?.gender || fallbackData[categoryName]?.gender || [],
        style: categoryObj?.style || fallbackData[categoryName]?.style || [],
        lensType: categoryObj?.lensType || fallbackData[categoryName]?.lensType || [],
        shape: categoryObj?.shape || fallbackData[categoryName]?.shape || [],
        brands: categoryObj?.brands || fallbackData[categoryName]?.brands || []
    };

    const handleItemClick = (type, value) => {
        let paramName = type.toLowerCase();
        if (paramName === 'style') paramName = 'frameStyle';
        if (paramName === 'shape') paramName = 'frameShape';
        if (paramName === 'lens type') paramName = 'lensType';
        if (paramName === 'subcategories') paramName = 'subcategory';
        
        navigate(`/products?category=${categoryName}&${paramName}=${value}`);
        onClose();
    };

    if (!categoryName) return null;

    return (
        <div className="mega-menu" onMouseLeave={onClose}>
            <div className="mega-menu-content">
                {/* Column 0: Subcategories (Dynamic for categories like Contact Lenses) */}
                {currentData.subcategories && currentData.subcategories.length > 0 && (
                    <div className="menu-column">
                        <h3>Sub Categories</h3>
                        <ul>
                            {currentData.subcategories.map((item, index) => (
                                <li key={index} onClick={() => handleItemClick('Subcategories', item.name || item)}>{item.name || item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Column 1: Gender */}
                {currentData.gender && currentData.gender.length > 0 && (
                    <div className="menu-column">
                        <h3>Gender</h3>
                        <ul>
                            {currentData.gender.map((item, index) => (
                                <li key={index} onClick={() => handleItemClick('Gender', item)}>{item}</li>
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
                                <li key={index} onClick={() => handleItemClick('FrameStyle', item)}>{item}</li>
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
                                <li key={index} onClick={() => handleItemClick('LensType', item)}>{item}</li>
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
                                <li key={index} onClick={() => handleItemClick('FrameShape', item)}>{item}</li>
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
