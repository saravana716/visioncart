import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import OurBrands from '../Components/Ourbrands/OurBrands';
import Footers from '../Components/Footer/Footers';
import PropCard from '../Components/PropCard/PropCard';
import { getProducts, getCategoryByName } from '../services/firestoreService';
import { IoIosSearch } from "react-icons/io";
import rateimg from '../assets/star.png';
import colorimg from '../assets/color.png';
import './ProductPage.css';
import Loader from '../Components/Loader/Loader';

const fallbackData = {
    'Spectacles': {
        gender: ['Men', 'Women', 'Unisex', 'Kids'],
        style: ['Full Rim', 'Half Rim', 'Rimless'],
        lensType: ['ARC', 'Blue Cut', 'UV Protect', 'Auto Cooling'],
        shape: ['Rectangle', 'Round', 'Cat eye', 'Aviatar', 'Oval', 'Square'],
    },
    'Sunglasses': {
        gender: ['Men', 'Women', 'Unisex'],
        style: ['Aviator', 'Wayfarer', 'Clubmaster'],
        lensType: ['Polarized', 'UV Protection', 'Gradient'],
        shape: ['Aviator', 'Square', 'Round', 'Oversized'],
    },
    'Reading Glasses': {
        gender: ['Men', 'Women', 'Unisex'],
        style: ['Full Rim', 'Rimless', 'Half Rim'],
        lensType: ['Anti-Glare', 'Blue Cut', 'Bifocal'],
        shape: ['Rectangle', 'Round', 'Oval'],
    },
    'Computer Glasses': {
        gender: ['Men', 'Women', 'Unisex'],
        style: ['Full Rim', 'Half Rim'],
        lensType: ['Blue Cut', 'Anti-Glare'],
        shape: ['Rectangle', 'Square', 'Round'],
    },
    'Kids Collection': {
        gender: ['Boys', 'Girls', 'Unisex'],
        style: ['Full Rim'],
        lensType: ['ARC', 'Blue Cut'],
        shape: ['Round', 'Square', 'Rectangle'],
    }
};
const ProductPage = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('latest');
    const [openFilters, setOpenFilters] = useState({
        gender: true,
        frameStyle: true,
        frameShape: true,
        lensType: true,
        frameMaterial: true,
        frameColor: true,
        priceRange: true
    });

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryConfig, setCategoryConfig] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        gender: [],
        frameStyle: [],
        frameShape: [],
        lensType: [],
        frameMaterial: [],
        frameColor: [],
        priceRange: []
    });

    const navigate = useNavigate();

    // Sync URL params to State on load/change
    useEffect(() => {
        const newFilters = {
            gender: searchParams.getAll('gender'),
            frameStyle: searchParams.getAll('frameStyle'),
            frameShape: searchParams.getAll('frameShape'),
            lensType: searchParams.getAll('lensType'),
            frameMaterial: searchParams.getAll('frameMaterial'),
            frameColor: searchParams.getAll('frameColor'),
            priceRange: searchParams.getAll('priceRange')
        };
        
        // Handle single values (if they came as single params like in MegaMenu)
        const getParams = (key) => {
            const all = searchParams.getAll(key);
            const single = searchParams.get(key);
            if (all.length > 0) return all;
            if (single) return [single];
            return [];
        };

        setSelectedFilters({
            gender: getParams('gender'),
            frameStyle: getParams('frameStyle'),
            frameShape: getParams('frameShape'),
            lensType: getParams('lensType'),
            frameMaterial: getParams('frameMaterial'),
            frameColor: getParams('frameColor'),
            priceRange: getParams('priceRange')
        });

        // Sync SortBy from URL
        const sortParam = searchParams.get('sort');
        if (sortParam) setSortBy(sortParam);
    }, [searchParams]);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (category) {
                const config = await getCategoryByName(category);
                setCategoryConfig(config);
            }
        };
        fetchCategoryData();
    }, [category]);

    useEffect(() => {
        const fetchProductsData = async () => {
            setLoading(true);
            
            // Build filters directly from the state (which is synced with searchParams)
            const activeFilters = {};
            Object.keys(selectedFilters).forEach(key => {
                if (selectedFilters[key].length > 0) {
                    activeFilters[key] = selectedFilters[key];
                }
            });

            // Handle special cases from URL that might not be in state (like subcategory)
            const sub = searchParams.get('subcategory');
            if (sub) activeFilters.subcategory = sub;

            const data = await getProducts(category, activeFilters, sortBy);
            setFilteredProducts(data);
            // Small delay for premium feel
            setTimeout(() => setLoading(false), 500);
            window.scrollTo(0, 0);
        };
        fetchProductsData();
    }, [category, selectedFilters, searchParams, sortBy]); // selectedFilters is updated by searchParams sync

    const handleFilterChange = (type, value) => {
        // Update URL, which will trigger searchParams sync effect
        const newParams = new URLSearchParams(searchParams);
        const currentVals = newParams.getAll(type);
        
        if (currentVals.includes(value)) {
            // Remove
            const updated = currentVals.filter(v => v !== value);
            newParams.delete(type);
            updated.forEach(v => newParams.append(type, v));
        } else {
            // Add
            newParams.append(type, value);
        }
        
        navigate(`/products?${newParams.toString()}`);
    };

    const resetFilters = () => {
        navigate(`/products?category=${category || ''}`);
    };

    const handleSortChange = (val) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', val);
        navigate(`/products?${newParams.toString()}`);
        setShowSortModal(false);
    };

    const toggleFilter = (filter) => {
        setOpenFilters({ ...openFilters, [filter]: !openFilters[filter] });
    };

    const currentFilters = {
        gender: categoryConfig?.gender || fallbackData[category]?.gender || [],
        style: categoryConfig?.style || fallbackData[category]?.style || [],
        shape: categoryConfig?.shape || fallbackData[category]?.shape || [],
        lensType: categoryConfig?.lensType || fallbackData[category]?.lensType || [],
        material: categoryConfig?.material || fallbackData[category]?.material || ['Metal', 'Plastic', 'Acetate', 'Titanium'],
        color: categoryConfig?.color || fallbackData[category]?.color || ['Black', 'Blue', 'Brown', 'Silver']
    };

    const cardlist = filteredProducts.map(p => {
        const displayPrice = p.offerPrice || p.price;
        return {
            id: p.id,
            brand: p.brand,
            title: p.name || p.model || p.brand,
            price: displayPrice ? (displayPrice.toString().startsWith('₹') ? displayPrice : `₹${displayPrice}`) : '₹0',
            mrpprice: p.price || p.originalPrice || '0',
            img: (p.photos && p.photos.length > 0) ? p.photos[0] : (p.mainImage || 'https://via.placeholder.com/400?text=No+Image'),
            rating: rateimg,
            color: colorimg,
            ratingcount: p.ratingCount || "0",
            colorcount: p.colors ? p.colors.length : "1"
        };
    });

    const displayCategory = category || "All Products";
    const bannerInfo = category === "Sunglasses" ? {
        title: "Stay Protected in Style",
        subtitle: "with Premium Sunglasses",
        desc: "High-quality polarized lenses for ultimate clarity and UV protection."
    } : category === "Computer Glasses" ? {
        title: "Digital Comfort for",
        subtitle: "Screen Heavy Days",
        desc: "Advanced blue cut lenses to reduce digital eye strain and fatigue."
    } : category === "Kids Collection" ? {
        title: "Fun & Durable",
        subtitle: "Eyewear for Little Ones",
        desc: "Specialized frames designed for children's active lifestyles and comfort."
    } : {
        title: "Finish Spectacles for",
        subtitle: "everyday vision",
        desc: "Comfortable, modern spectacles for clean, all-day vision."
    };

    return (
        <div className="product-page-container">
            <Navbar />
            
            {/* Banner Section */}
            <div 
                className="product-banner" 
                style={categoryConfig?.imageUrl || categoryConfig?.image || categoryConfig?.bannerImage ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${categoryConfig.imageUrl || categoryConfig.image || categoryConfig.bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}
            >
                <div className="banner-content">
                    <h1>{bannerInfo.title}</h1>
                    <h2>{bannerInfo.subtitle}</h2>
                    <p>{bannerInfo.desc}</p>
                </div>
            </div>

            <div className="product-listing-section">
                <div className="listing-header scroll-reveal">
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
                            <button className="close-mobile-filters" onClick={() => setShowMobileFilters(false)}>✕</button>
                        </div>

                        <div className="filter-scroll-area">
                            {/* Gender Filter */}
                            {currentFilters.gender.length > 0 && (
                                <div className="filter-group">
                                    <div className="filter-title" onClick={() => toggleFilter('gender')}>
                                        <span>Gender</span>
                                        <span>{openFilters.gender ? '▾' : '▸'}</span>
                                    </div>
                                    {openFilters.gender && (
                                        <div className="filter-options">
                                            {currentFilters.gender.map((opt, i) => (
                                                <label key={i}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFilters.gender.includes(opt)}
                                                        onChange={() => handleFilterChange('gender', opt)}
                                                    /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Style Filter */}
                            {currentFilters.style.length > 0 && (
                                <div className="filter-group">
                                    <div className="filter-title" onClick={() => toggleFilter('frameStyle')}>
                                        <span>Style</span>
                                        <span>{openFilters.frameStyle ? '▾' : '▸'}</span>
                                    </div>
                                    {openFilters.frameStyle && (
                                        <div className="filter-options">
                                            {currentFilters.style.map((opt, i) => (
                                                <label key={i}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFilters.frameStyle.includes(opt)}
                                                        onChange={() => handleFilterChange('frameStyle', opt)}
                                                    /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Shape Filter */}
                            {currentFilters.shape.length > 0 && (
                                <div className="filter-group">
                                    <div className="filter-title" onClick={() => toggleFilter('frameShape')}>
                                        <span>Frame Shape</span>
                                        <span>{openFilters.frameShape ? '▾' : '▸'}</span>
                                    </div>
                                    {openFilters.frameShape && (
                                        <div className="filter-options">
                                            {currentFilters.shape.map((opt, i) => (
                                                <label key={i}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFilters.frameShape.includes(opt)}
                                                        onChange={() => handleFilterChange('frameShape', opt)}
                                                    /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Lens Type Filter */}
                            {currentFilters.lensType.length > 0 && (
                                <div className="filter-group">
                                    <div className="filter-title" onClick={() => toggleFilter('lensType')}>
                                        <span>Lens Type</span>
                                        <span>{openFilters.lensType ? '▾' : '▸'}</span>
                                    </div>
                                    {openFilters.lensType && (
                                        <div className="filter-options">
                                            {currentFilters.lensType.map((opt, i) => (
                                                <label key={i}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFilters.lensType.includes(opt)}
                                                        onChange={() => handleFilterChange('lensType', opt)}
                                                    /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Frame Material */}
                            {currentFilters.material.length > 0 && (
                                <div className="filter-group">
                                    <div className="filter-title" onClick={() => toggleFilter('frameMaterial')}>
                                        <span>Frame Material</span>
                                        <span>{openFilters.frameMaterial ? '▾' : '▸'}</span>
                                    </div>
                                    {openFilters.frameMaterial && (
                                        <div className="filter-options">
                                            {currentFilters.material.map((opt, i) => (
                                                <label key={i}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFilters.frameMaterial.includes(opt)}
                                                        onChange={() => handleFilterChange('frameMaterial', opt)}
                                                    /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Frame Color */}
                            {currentFilters.color.length > 0 && (
                                <div className="filter-group">
                                    <div className="filter-title" onClick={() => toggleFilter('frameColor')}>
                                        <span>Frame Color</span>
                                        <span>{openFilters.frameColor ? '▾' : '▸'}</span>
                                    </div>
                                    {openFilters.frameColor && (
                                        <div className="filter-options">
                                            {currentFilters.color.map((opt, i) => (
                                                <label key={i}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedFilters.frameColor.includes(opt)}
                                                        onChange={() => handleFilterChange('frameColor', opt)}
                                                    /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Price Range */}
                            <div className="filter-group">
                                <div className="filter-title" onClick={() => toggleFilter('priceRange')}>
                                    <span>Price Range</span>
                                    <span>{openFilters.priceRange ? '▾' : '▸'}</span>
                                </div>
                                {openFilters.priceRange && (
                                    <div className="filter-options">
                                        {[
                                            { label: 'Under ₹500', val: 'under500' },
                                            { label: '₹500 - ₹1000', val: '500-1000' },
                                            { label: '₹1000 - ₹2000', val: '1000-2000' },
                                            { label: 'Over ₹2000', val: 'over2000' }
                                        ].map((range, i) => (
                                            <label key={i}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedFilters.priceRange.includes(range.val)}
                                                    onChange={() => handleFilterChange('priceRange', range.val)}
                                                /> {range.label}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Sidebar Footer */}
                        <div className="sidebar-footer-desktop">
                            <button className="reset-btn-desktop" onClick={resetFilters}>Reset</button>
                            <button className="apply-btn-desktop" onClick={() => window.scrollTo(0, 0)}>Apply Filters</button>
                        </div>

                        {/* <div className="filter-footer-mobile">
                            <button className="reset-mobile-btn">Reset</button>
                            <button className="apply-mobile-btn" onClick={() => setShowMobileFilters(false)}>Apply</button>
                        </div> */}
                    </aside>

                    {/* Sort Modal for Mobile */}
                    <div className={`sort-modal-mobile ${showSortModal ? 'show' : ''}`}>
                        <div className="sort-modal-header">
                            <h4>Sort By Options</h4>
                            <button className="close-sort-modal" onClick={() => setShowSortModal(false)}>✕</button>
                        </div>
                        <div className="sort-options-list">
                            <label><input type="radio" name="sort" checked={sortBy === 'latest'} onChange={() => handleSortChange('latest')} /> Popularity</label>
                            <label><input type="radio" name="sort" checked={sortBy === 'new'} onChange={() => handleSortChange('new')} /> New Arrivals</label>
                            <label><input type="radio" name="sort" checked={sortBy === 'highToLow'} onChange={() => handleSortChange('highToLow')} /> Price: High to Low</label>
                            <label><input type="radio" name="sort" checked={sortBy === 'lowToHigh'} onChange={() => handleSortChange('lowToHigh')} /> Price: Low to High</label>
                            <label><input type="radio" name="sort" checked={sortBy === 'rating'} onChange={() => handleSortChange('rating')} /> Customer Ratings</label>
                        </div>
                        <div className="sort-modal-footer">
                            <button className="sort-cancel-btn" onClick={() => setShowSortModal(false)}>Cancel</button>
                            <button className="sort-apply-btn" onClick={() => setShowSortModal(false)}>Apply</button>
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="product-grid-area scroll-reveal">
                        <div className="grid-controls">
                            <div className="mobile-controls">
                                <button className="mobile-sort-toggle" onClick={() => setShowSortModal(true)}>
                                    Sort ▾
                                </button>
                                <button className="mobile-filter-toggle" onClick={() => setShowMobileFilters(true)}>
                                    Filter ▾
                                </button>
                            </div>
                            <select 
                                className="sort-dropdown-desktop" 
                                value={sortBy} 
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="latest">Sorting: Latest</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>
                        <div className="product-grid">
                            {loading ? (
                                <Loader />
                            ) : cardlist.length > 0 ? (
                                <PropCard cardlist={cardlist} />
                            ) : (
                                <div className="no-products-found">
                                    <div className="no-products-content">
                                        <div className="no-products-icon">
                                            <IoIosSearch size={60} />
                                        </div>
                                        <h3>No products found</h3>
                                        <p>We couldn't find any products matching your current filters. Try adjusting them or clearing all filters to see more results.</p>
                                        <button className="clear-all-btn" onClick={() => navigate(`/products?category=${category || ''}`)}>
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            )}
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
