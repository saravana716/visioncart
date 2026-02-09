import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import OurBrands from '../Components/Ourbrands/OurBrands';
import Footers from '../Components/Footer/Footers';
import PropCard from '../Components/PropCard/PropCard';
import { products } from '../data/products';
import rateimg from '../assets/star.png';
import colorimg from '../assets/color.png';
import './ProductPage.css';

const ProductPage = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [openFilters, setOpenFilters] = useState({
        gender: true,
        frameType: true,
        frameShape: true,
        frameMaterial: true,
        frameColor: true,
        frameSize: true,
        brand: true,
        priceRange: true
    });

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (category) {
            const filtered = products.filter(p => p.category === category);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
        window.scrollTo(0, 0);
    }, [category]);

    const toggleFilter = (filter) => {
        setOpenFilters({ ...openFilters, [filter]: !openFilters[filter] });
    };

    const cardlist = filteredProducts.map(p => ({
        id: p.id,
        title: p.brand,
        price: p.price,
        mrpprice: p.originalPrice,
        img: p.mainImage,
        rating: rateimg,
        color: colorimg,
        ratingcount: p.ratingCount,
        colorcount: p.colors.length
    }));

    const displayCategory = category || "All Products";
    const bannerInfo = category === "Sunglasses" ? {
        title: "Stay Protected in Style",
        subtitle: "with Premium Sunglasses",
        desc: "High-quality polarized lenses for ultimate clarity and UV protection."
    } : category === "Computer Glasses" ? {
        title: "Digital Comfort for",
        subtitle: "Screen Heavy Days",
        desc: "Advanced blue cut lenses to reduce digital eye strain and fatigue."
    } : {
        title: "Finish Spectacles for",
        subtitle: "everyday vision",
        desc: "Comfortable, modern spectacles for clean, all-day vision."
    };

    return (
        <div className="product-page-container">
            <Navbar />
            
            {/* Banner Section */}
            <div className="product-banner">
                <div className="banner-content">
                    <h1>{bannerInfo.title}</h1>
                    <h2>{bannerInfo.subtitle}</h2>
                    <p>{bannerInfo.desc}</p>
                </div>
            </div>

            <div className="product-listing-section">
                <div className="listing-header">
                    <h3>{displayCategory}</h3>
                    <p>{cardlist.length} results found</p>
                </div>

                <div className="main-content">
                    {/* Filter Overlay for Mobile */}
                    {(showMobileFilters || showSortModal) && (
                        <div className="filter-overlay" onClick={() => { setShowMobileFilters(false); setShowSortModal(false); }}></div>
                    )}
                    
                    {/* Sidebar Filters */}
                    <aside className={`sidebar-filters ${showMobileFilters ? 'show' : ''}`}>
                        <div className="filter-header">
                            <h4>Filters</h4>
                            <div className="filter-header-buttons">
                                <button className="reset-btn">Reset</button>
                                <button className="close-mobile-filters" onClick={() => setShowMobileFilters(false)}>✕</button>
                            </div>
                        </div>

                        <div className="filter-scroll-area">
                            <div className="filter-group">
                                <div className="filter-title" onClick={() => toggleFilter('gender')}>
                                    <span>Gender</span>
                                    <span>{openFilters.gender ? '▾' : '▸'}</span>
                                </div>
                                {openFilters.gender && (
                                    <div className="filter-options">
                                        <label><input type="checkbox" /> Men</label>
                                        <label><input type="checkbox" /> Women</label>
                                        <label><input type="checkbox" /> Unisex</label>
                                        <label><input type="checkbox" /> Kids</label>
                                    </div>
                                )}
                            </div>

                            <div className="filter-group">
                                <div className="filter-title" onClick={() => toggleFilter('frameType')}>
                                    <span>Frame Type</span>
                                    <span>{openFilters.frameType ? '▾' : '▸'}</span>
                                </div>
                                {openFilters.frameType && (
                                    <div className="filter-options">
                                        <label><input type="checkbox" /> Full Rim</label>
                                        <label><input type="checkbox" /> Half Rim</label>
                                        <label><input type="checkbox" /> Rimless</label>
                                    </div>
                                )}
                            </div>

                            <div className="filter-group">
                                <div className="filter-title" onClick={() => toggleFilter('frameShape')}>
                                    <span>Frame Shape</span>
                                    <span>{openFilters.frameShape ? '▾' : '▸'}</span>
                                </div>
                                {openFilters.frameShape && (
                                    <div className="filter-options">
                                        <label><input type="checkbox" /> Rectangle</label>
                                        <label><input type="checkbox" /> Round</label>
                                        <label><input type="checkbox" /> Wayfarer</label>
                                        <label><input type="checkbox" /> Aviator</label>
                                    </div>
                                )}
                            </div>

                            <div className="filter-group">
                                <div className="filter-title" onClick={() => toggleFilter('frameMaterial')}>
                                    <span>Frame Material</span>
                                    <span>{openFilters.frameMaterial ? '▾' : '▸'}</span>
                                </div>
                                {openFilters.frameMaterial && (
                                    <div className="filter-options">
                                        <label><input type="checkbox" /> Metal</label>
                                        <label><input type="checkbox" /> Plastic</label>
                                        <label><input type="checkbox" /> Acetate</label>
                                        <label><input type="checkbox" /> Titanium</label>
                                    </div>
                                )}
                            </div>

                            <div className="filter-group">
                                <div className="filter-title" onClick={() => toggleFilter('frameColor')}>
                                    <span>Frame Color</span>
                                    <span>{openFilters.frameColor ? '▾' : '▸'}</span>
                                </div>
                                {openFilters.frameColor && (
                                    <div className="filter-options">
                                        <label><input type="checkbox" /> Black</label>
                                        <label><input type="checkbox" /> Blue</label>
                                        <label><input type="checkbox" /> Brown</label>
                                        <label><input type="checkbox" /> Silver</label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="filter-footer-mobile">
                            <button className="reset-mobile-btn">Reset</button>
                            <button className="apply-mobile-btn" onClick={() => setShowMobileFilters(false)}>Apply</button>
                        </div>
                    </aside>

                    {/* Sort Modal for Mobile */}
                    <div className={`sort-modal-mobile ${showSortModal ? 'show' : ''}`}>
                        <div className="sort-modal-header">
                            <h4>Sort By Options</h4>
                            <button className="close-sort-modal" onClick={() => setShowSortModal(false)}>✕</button>
                        </div>
                        <div className="sort-options-list">
                            <label><input type="radio" name="sort" /> Popularity</label>
                            <label><input type="radio" name="sort" /> New Arrivals</label>
                            <label><input type="radio" name="sort" /> Price: High to Low</label>
                            <label><input type="radio" name="sort" /> Price: Low to High</label>
                            <label><input type="radio" name="sort" /> Customer Ratings</label>
                        </div>
                        <div className="sort-modal-footer">
                            <button className="sort-cancel-btn" onClick={() => setShowSortModal(false)}>Cancel</button>
                            <button className="sort-apply-btn" onClick={() => setShowSortModal(false)}>Apply</button>
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="product-grid-area">
                        <div className="grid-controls">
                            <div className="mobile-controls">
                                <button className="mobile-sort-toggle" onClick={() => setShowSortModal(true)}>
                                    Sort ▾
                                </button>
                                <button className="mobile-filter-toggle" onClick={() => setShowMobileFilters(true)}>
                                    Filter ▾
                                </button>
                            </div>
                            <select className="sort-dropdown-desktop">
                                <option>Sorting: Latest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                        <div className="product-grid">
                            <PropCard cardlist={cardlist} />
                        </div>
                    </div>
                </div>
            </div>

            <OurBrands />
            <Footers />
        </div>
    );
};

export default ProductPage;
