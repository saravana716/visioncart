import React from 'react';
import './MegaMenu.css';
import brandPlaceholder from '../../assets/brand.png';
import frame1 from '../../assets/Frames/1.png';
import frame2 from '../../assets/Frames/2.png';
import frame3 from '../../assets/Frames/3.png';
import frame4 from '../../assets/Frames/4.png';
import frame5 from '../../assets/Frames/5.png';
import { useNavigate } from 'react-router-dom';

import contactBrand from '../../assets/brands/contact.jpeg';

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
            brands: [] // Removed brands for other categories
        },
        'Sunglasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Aviator', 'Wayfarer', 'Clubmaster'],
            lensType: ['Polarized', 'UV Protection', 'Gradient'],
            shape: ['Aviator', 'Square', 'Round', 'Oversized'],
            brands: []
        },
        'Reading Glasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Full Rim', 'Rimless', 'Half Rim'],
            lensType: ['Anti-Glare', 'Blue Cut', 'Bifocal'],
            shape: ['Rectangle', 'Round', 'Oval'],
            brands: []
        },
        'Computer Glasses': {
            gender: ['Men', 'Women', 'Unisex'],
            style: ['Full Rim', 'Half Rim'],
            lensType: ['Blue Cut', 'Anti-Glare'],
            shape: ['Rectangle', 'Square', 'Round'],
            brands: []
        },
        'Kids Collection': {
            gender: ['Boys', 'Girls', 'Unisex'],
            style: ['Full Rim'],
            lensType: ['ARC', 'Blue Cut'],
            shape: ['Round', 'Square', 'Rectangle'],
            brands: []
        },
        'Contact Lenses': {
            lensType: ['Monthly', 'Biweekly', 'Daily', 'Yearly'],
            brands: [contactBrand], // Imported brand image for production compatibility
            isContactLenses: true
        }
    };

    // Merge Firestore data with fallbacks
    const currentData = {
        subcategories: categoryObj?.subcategories || [],
        gender: categoryObj?.gender || fallbackData[categoryName]?.gender || [],
        style: categoryObj?.style || fallbackData[categoryName]?.style || [],
        lensType: categoryObj?.lensType || fallbackData[categoryName]?.lensType || [],
        shape: categoryObj?.shape || fallbackData[categoryName]?.shape || [],
        brands: categoryName === 'Contact Lenses' ? (fallbackData[categoryName]?.brands || []) : [] // Only show brands for Contact Lenses
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

    const isContactLenses = categoryName === 'Contact Lenses';

    return (
        <div className="mega-menu" onMouseLeave={onClose}>
            <div className="mega-menu-content">
                {/* Column 0: Subcategories (Dynamic for categories like Contact Lenses) - REMOVED for Contact Lenses */}
                {!isContactLenses && currentData.subcategories && currentData.subcategories.length > 0 && (
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
                {!isContactLenses && currentData.shape && currentData.shape.length > 0 && (
                    <div className="menu-column">
                        <h3>Shape</h3>
                        <ul>
                            {currentData.shape.map((item, index) => (
                                <li key={index} onClick={() => handleItemClick('FrameShape', item)}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Column 5: Shop By Brand (Only for Contact Lenses) */}
                 {isContactLenses && (
                    <div className="menu-column brand-column">
                        <h3>Shop By Brand</h3>
                        <div className="brand-grid">
                            {currentData.brands.map((brandImg, index) => (
                                <div key={index} className="brand-item" style={{width: '200px', height: '100px'}}>
                                    <img src={brandImg} alt="Brand" />
                                </div>
                            ))}
                        </div>
                        <div className="shop-all-brands" onClick={() => navigate('/products?category=Contact Lenses&brands=all')}>
                            Shop All Brands
                        </div>
                    </div>
                )}

                {/* Column 6: Frames Showcase */}
                {!isContactLenses && (
                    <div className="menu-column promo-column">
                        <h3 style={{marginBottom: '15px'}}>Trending Styles</h3>
                        <div className="frames-dropdown-grid">
                            <div className="frame-dropdown-item" onClick={() => { navigate(`/products?category=${categoryName}`); onClose(); }}>
                                <img src={frame1} alt="Frame Style 1" />
                            </div>
                            <div className="frame-dropdown-item" onClick={() => { navigate(`/products?category=${categoryName}`); onClose(); }}>
                                <img src={frame2} alt="Frame Style 2" />
                            </div>
                            <div className="frame-dropdown-item" onClick={() => { navigate(`/products?category=${categoryName}`); onClose(); }}>
                                <img src={frame3} alt="Frame Style 3" />
                            </div>
                            <div className="frame-dropdown-item" onClick={() => { navigate(`/products?category=${categoryName}`); onClose(); }}>
                                <img src={frame4} alt="Frame Style 4" />
                            </div>
                            <div className="frame-dropdown-item" onClick={() => { navigate(`/products?category=${categoryName}`); onClose(); }}>
                                <img src={frame5} alt="Frame Style 5" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MegaMenu;
