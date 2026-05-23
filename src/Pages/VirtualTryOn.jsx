import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import PropCard from '../Components/PropCard/PropCard';
import VTOCanvas from '../Components/VTO/VTOCanvas';
import { getProducts, getProductById } from '../services/firestoreService';
import rateimg from '../assets/star.png';
import colorimg from '../assets/color.png';
import './VirtualTryOn.css';
import Loader from '../Components/Loader/Loader';
import { MdCameraAlt, MdPhotoLibrary, Md3dRotation } from 'react-icons/md';

const VirtualTryOn = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vtoActive, setVtoActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pid = queryParams.get('id');

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch spectacles for the list
                const data = await getProducts('Spectacles');
                const mappedData = data.slice(0, 10).map(p => ({
                    id: p.id,
                    title: p.name || p.title || p.productName || p.brand || "Visionkart",
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

                // Handle initial selected product
                if (pid) {
                    const product = await getProductById(pid);
                    if (product) {
                        setSelectedProduct({
                            ...product,
                            vtoImg: (product.photos && product.photos.length > 0) ? product.photos[0] : product.mainImage
                        });
                        setVtoActive(true);
                    }
                } else if (mappedData.length > 0) {
                    setSelectedProduct({
                        ...data[0],
                        vtoImg: mappedData[0].img
                    });
                }
            } catch (error) {
                console.error("Error fetching VTO data:", error);
            }
            setLoading(false);
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [location.search]);

    const handleSelectProduct = (product) => {
        setSelectedProduct({
            ...product,
            vtoImg: product.img
        });
        setVtoActive(true);
        setUploadedImage(null); // Reset uploaded image when selecting a new product
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target.result);
                setVtoActive(true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="virtual-tryon-page">
            <Navbar />
            
            <div className="tryon-hero-premium">
                <div className="tryon-container-grid">
                    <div className="tryon-visual-section">
                        {!vtoActive ? (
                            <div className="tryon-placeholder-card">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800" alt="Model" className="model-base" />
                                <div className="overlay-content">
                                    <div className="pulse-button" onClick={() => setVtoActive(true)}>
                                        <MdCameraAlt />
                                        <span>Start Virtual Try-On</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="vto-active-container">
                                <VTOCanvas frameImage={selectedProduct?.vtoImg} uploadedImage={uploadedImage} />
                                <div className="vto-badge-live">
                                    <span className="dot"></span> {uploadedImage ? 'PHOTO MODE' : 'LIVE AR'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="tryon-info-section">
                        <div className="premium-label">3D EXPERIENCE</div>
                        <h1>Virtual Try-On</h1>
                        <p className="subtitle">Experience the future of eyewear shopping. Try any frame instantly with our advanced 3D face tracking technology.</p>
                        
                        {selectedProduct && (
                            <div className="selected-product-vto">
                                <div className="vto-product-meta">
                                    <span className="brand">{selectedProduct.brand || 'Visionkart'}</span>
                                    <h3>{selectedProduct.name || selectedProduct.title}</h3>
                                    <span className="price">{selectedProduct.price}</span>
                                </div>
                                <div className="vto-action-btns">
                                    <button className="vto-btn-primary" onClick={() => {
                                        console.log("Toggle Camera clicked, current state:", vtoActive);
                                        setVtoActive(!vtoActive);
                                        if (uploadedImage) setUploadedImage(null);
                                    }}>
                                        {vtoActive && !uploadedImage ? 'Stop Camera' : 'Start Camera'}
                                    </button>
                                    <button className="vto-btn-outline" onClick={() => fileInputRef.current?.click()}>
                                        <MdPhotoLibrary /> Upload Photo
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handlePhotoUpload} 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                    />
                                </div>
                            </div>
                        )}

                        <div className="vto-features-grid">
                            <div className="feature-item">
                                <Md3dRotation />
                                <span>360° View</span>
                            </div>
                            <div className="feature-item">
                                <MdCameraAlt />
                                <span>Real-time Fit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="try-spectacles-section-v2">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Select a Frame to Try On</h2>
                        <p>Browse our collection and see them on your face instantly</p>
                    </div>
                    
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="vto-products-grid">
                            {products.map(p => (
                                <div 
                                    key={p.id} 
                                    className={`vto-product-card ${selectedProduct?.id === p.id ? 'active' : ''}`}
                                    onClick={() => handleSelectProduct(p)}
                                >
                                    <div className="card-img">
                                        <img src={p.img} alt={p.title} />
                                    </div>
                                    <div className="card-info">
                                        <h4>{p.title}</h4>
                                        <p>{p.price}</p>
                                    </div>
                                    {selectedProduct?.id === p.id && <div className="active-tag">Selected</div>}
                                </div>
                            ))}
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
