import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import PropCard from '../Components/PropCard/PropCard';
import { getProducts } from '../services/firestoreService';
import rateimg from '../assets/star.png';
import colorimg from '../assets/color.png';
import modelImg from '../assets/discoverimg.png'; // Fallback model image
import './VirtualTryOn.css';

const VirtualTryOn = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts('Spectacles');
            const mappedData = data.slice(0, 5).map(p => ({
                id: p.id,
                title: p.brand || p.name,
                price: p.price ? (p.price.startsWith('₹') ? p.price : `₹${p.price}`) : '₹0',
                mrpprice: p.originalPrice || `₹${parseInt(p.price || 0) * 1.5}`,
                img: (p.photos && p.photos.length > 0) ? p.photos[0] : (p.mainImage || 'https://via.placeholder.com/400?text=No+Image'),
                rating: rateimg,
                color: colorimg,
                ratingcount: p.ratingCount || "0",
                colorcount: p.colors ? p.colors.length : "1",
                tryOn: true
            }));
            setProducts(mappedData);
            setLoading(false);
        };
        fetchProducts();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="virtual-tryon-page">
            <Navbar />
            
            <div className="tryon-hero">
                <div className="tryon-container">
                    <div className="tryon-header-text">
                        <h1>3D Virtual Try-On</h1>
                        <p>Try your favorite frames instantly and see how they look on you — before you buy.</p>
                    </div>

                    <div className="tryon-preview-card">
                        <div className="preview-main">
                            <div className="preview-circle">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600" alt="Model" />
                                <div className="glasses-overlay">
                                    {/* This would be the dynamic glass image in a real implementation */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tryon-actions">
                        <button className="tryon-btn secondary">
                            <span className="icon">📷</span> Try with Camera
                        </button>
                        <button className="tryon-btn primary">
                            Start 3D Virtual Try-On
                        </button>
                        <button className="tryon-btn secondary">
                            <span className="icon">📁</span> Upload your Photo
                        </button>
                    </div>
                </div>
            </div>

            <div className="try-spectacles-section">
                <div className="section-container">
                    <h2>Try Spectacles</h2>
                    {loading ? (
                        <div className="loading">Loading products...</div>
                    ) : (
                        <div className="products-scroll">
                            <PropCard cardlist={products} />
                        </div>
                    )}
                </div>
            </div>

            <div className="visionkart-banner-footer">
                <h1>VISIONKART <span className="eye-icon">👁️</span> VISION</h1>
            </div>

            <Footers />
        </div>
    );
};

export default VirtualTryOn;
