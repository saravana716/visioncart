import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import OurBrands from '../Components/Ourbrands/OurBrands';
import PropCard from '../Components/PropCard/PropCard';
import { getProductById, getProducts, getLensEnhancements } from '../services/firestoreService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ReviewsSection from '../Components/Reviews/ReviewsSection';
import RecentlyViewed from '../Components/RecentlyViewed/RecentlyViewed';
import Recommendations from '../Components/Recommendations/Recommendations';
import rateimg from '../assets/star.png';
import './ProductDetails.css';
import Loader from '../Components/Loader/Loader';
import Product360Viewer from '../Components/Product360Viewer/Product360Viewer';
import ImageZoom from '../Components/ImageZoom/ImageZoom';
import { MdOutline360 } from "react-icons/md";
import LensSelectionModal from '../Components/LensSelectionModal/LensSelectionModal';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState('');
    const [showLensModal, setShowLensModal] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [lensEnhancements, setLensEnhancements] = useState([]);
    const [is360Open, setIs360Open] = useState(false);
    
    const { addItemToCart, setCartOpen, setDrawerTab } = useCart();

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            const data = await getProductById(id);
            if (data) {
                // Map Firestore fields to local state
                const mappedProduct = {
                    ...data,
                    mainImage: (data.photos && data.photos.length > 0) ? data.photos[0] : (data.mainImage || 'https://via.placeholder.com/600?text=No+Image'),
                    thumbnails: (data.photos && data.photos.length > 0) ? data.photos : (data.mainImage ? [data.mainImage] : ['https://via.placeholder.com/600?text=No+Image']),
                    brand: data.brand || 'Visionkart',
                    title: data.name || data.model || 'Product Details',
                    price: data.price ? (data.price.startsWith('₹') ? data.price : `₹${data.price}`) : '₹0',
                    originalPrice: data.originalPrice || `₹${parseInt(data.price || 0) * 1.5}`,
                    discount: data.discount || '50% OFF',
                    rating: data.rating || '4.5',
                    ratingCount: data.ratingCount || '0',
                    size: data.size || 'Medium',
                    colors: data.colors || [{ name: 'Default', hex: '#000' }],
                    category: data.category || 'Spectacles',
                    stock: data.stock !== undefined ? data.stock : 10, // Default to 10 if not set
                    technicalSpecs: data.technicalSpecs || [
                        { label: 'Brand', value: data.brand || 'Visionkart' },
                        { label: 'Model No.', value: data.sku || 'N/A' },
                        { label: 'Frame Type', value: data.frameType || 'Full Rim' },
                        { label: 'Frame Shape', value: data.frameShape || 'Rectangle' },
                        { label: 'Frame Material', value: data.frameMaterial || 'Plastic' }
                    ]
                };
                setProduct(mappedProduct);
                setSelectedImg(mappedProduct.mainImage);

                // Fetch similar products
                const similar = await getProducts(data.category);
                const similarMapped = similar.filter(p => p.id !== id).slice(0, 4).map(p => ({
                    id: p.id,
                    img: (p.photos && p.photos.length > 0) ? p.photos[0] : (p.mainImage || 'https://via.placeholder.com/400?text=No+Image'),
                    title: p.brand || p.name,
                    rating: rateimg,
                    ratingcount: p.ratingCount || "0",
                    price: p.price ? (p.price.startsWith('₹') ? p.price : `₹${p.price}`) : '₹0',
                    mrpprice: p.originalPrice || `₹${parseInt(p.price || 0) * 1.5}`,
                    color: "",
                    colorcount: p.colors ? p.colors.length : "1"
                }));
                setSimilarProducts(similarMapped);

                // Dynamic Theme Adaptation
                const themes = {
                    'Spectacles': '#00387D',
                    'Sunglasses': '#FF8C00',
                    'Contact Lenses': '#00CED1',
                    'Computer Glasses': '#4B0082',
                    'Reading Glasses': '#2E8B57'
                };
                const color = themes[data.category] || '#00387D';
                document.documentElement.style.setProperty('--category-theme', color);
            }
            // Small delay for premium feel
            setTimeout(() => setLoading(false), 500);
            window.scrollTo(0, 0);
        };

        const fetchEnhancements = async () => {
            const enh = await getLensEnhancements();
            setLensEnhancements(enh);
        };

        fetchProductData();
        fetchEnhancements();

        // Track Recently Viewed
        const trackRecentlyViewed = () => {
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const updated = [id, ...viewed.filter(vId => vId !== id)].slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        };
        trackRecentlyViewed();
    }, [id]);



    if (loading) return <Loader fullPage={true} />;
    if (!product) return <div style={{padding: '100px', textAlign: 'center', fontSize: '20px'}}>Product not found</div>;

    return (
        <div className="product-details-page">
            <Navbar />
            
            {product.categoryBanner && (
                <div className="category-banner">
                    <img src={product.categoryBanner} alt={product.category} />
                </div>
            )}
            
            <div className="product-container">
                <div className="breadcrumbs">
                    Home &gt; {product.category} &gt; {product.brand}
                </div>

                <div className="main-info-grid">
                    {/* Left: Gallery */}
                    <div className="product-gallery">
                        <div className="thumbnails">
                            {product.thumbnails.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    alt="thumb" 
                                    className={selectedImg === img ? 'active' : ''}
                                    onClick={() => setSelectedImg(img)}
                                />
                            ))}
                        </div>
                        <div className="gallery-main-col">
                            <div className="main-image">
                                <ImageZoom src={selectedImg} alt={product.title} />
                                <button className="wishlist-btn-abs">♡</button>
                                <button className="btn-360-trigger" onClick={() => setIs360Open(true)}>
                                    <MdOutline360 />
                                    <span>360° View</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="product-info-panel">
                        <p className="brand-name">{product.brand}</p>
                        <h1>{product.title}</h1>
                        <p className="size-info">Size: {product.size}</p>
                        <div className="rating-row">
                            <img src={rateimg} alt="stars" />
                            <span>({product.rating}/5)</span>
                        </div>
                        <div className="price-row">
                            <span className="current-price">{product.price}</span>
                            <span className="offer-tag">({product.discount})</span>
                        </div>

                        <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock-alert'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Limited Stock - Order Soon!'}
                        </div>

                        <div className="color-selection">
                            <p>Select Color</p>
                            <div className="color-dots">
                                {product.colors.map((color, idx) => (
                                    <span 
                                        key={idx}
                                        className={`dot ${idx === 0 ? 'active' : ''}`} 
                                        style={{background: color.hex}}
                                        title={color.name}
                                    ></span>
                                ))}
                            </div>
                        </div>

                        <div className="virtual-tryon-banner" onClick={() => window.open('/try-on', '_blank')}>
                            <div className="tryon-text">
                                <h3>3D Virtual Try-On</h3>
                            </div>
                            <div className="tryon-img">
                                <img src="https://visionkart.com/model-try-on.png" alt="Model" onError={(e) => e.target.src='https://via.placeholder.com/150x100?text=Model'} />
                            </div>
                        </div>

                        <div className="action-buttons-top">
                            <button className="pink-action-btn">Prescription Upload</button>
                            <button className="white-action-btn" onClick={() => setShowLensModal(true)}>Select lens</button>
                        </div>

                        <div className="prescription-upload-box">
                            <div className="upload-icon">
                                <img src="https://cdn-icons-png.flaticon.com/512/3097/3097412.png" alt="Upload" />
                            </div>
                            <p className="drag-text">Drag & Drop files</p>
                            <span className="or-text">or</span>
                            <button className="select-file-btn">Select file from your device</button>
                            <p className="formats-text">Maximum file size: 10MB | Accepted file types: JPEG, PNG, PDF</p>
                        </div>

                        <div className="action-buttons-lower">
                            <button 
                                className="action-primary-btn"
                                onClick={async () => {
                                    const cartData = {
                                        productId: id,
                                        productName: product.title,
                                        productImage: product.mainImage,
                                        productPrice: product.price,
                                        totalPrice: product.price
                                    };
                                    const success = await addItemToCart(cartData);
                                    if (success) {
                                        setDrawerTab('cart');
                                        setCartOpen(true);
                                    }
                                }}
                            >
                                Add to Cart
                            </button>
                            <button 
                                className="action-secondary-btn"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="product-for-section">
                            <p>This Product For</p>
                            <div className="for-buttons">
                                <div className="for-item">
                                    <div className="for-img-box">
                                        <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300" alt="Kids" />
                                        <span className="for-label">Kids</span>
                                    </div>
                                </div>
                                <div className="for-item active">
                                    <div className="for-img-box">
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" alt="Adults" />
                                        <span className="for-label">Adults</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="middle-info-grid">
                    <div className="info-left-col">
                        <div className="technical-info-section">
                            <h2>Technical Information</h2>
                            <table className="tech-table">
                                <tbody>
                                    {product.technicalSpecs.map((spec, idx) => (
                                        <tr key={idx}>
                                            <td>{spec.label}</td>
                                            <td>{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="info-right-col">
                        <div className="vn-assure-section">
                            <p className="section-title">VN Assure You</p>
                            <div className="trust-badges-refined">
                            <div className="badge-item">
                                <div className="badge-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/679/679821.png" alt="Returns" />
                                </div>
                                <div className="badge-text">
                                    <span>No Question Asked Returns</span>
                                    <p>(Excluding Power lens)</p>
                                </div>
                            </div>
                            <div className="badge-item">
                                <div className="badge-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/5810/5810695.png" alt="Exchange" />
                                </div>
                                <div className="badge-text">
                                    <span>Easy 7 day exchange</span>
                                    <p>(On every valid purchase)</p>
                                </div>
                            </div>
                            <div className="badge-item">
                                <div className="badge-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1063/1063376.png" alt="Warranty" />
                                </div>
                                <div className="badge-text">
                                    <span>6 Month Warranty</span>
                                    <p>With Every Product</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="availability-check">
                            <p>Check Availability</p>
                            <div className="zip-input">
                                <input type="text" placeholder="Enter PIN code" />
                                <button>Check</button>
                            </div>
                            <p className="delivery-status available">Delivered in 4-6 days</p>
                        </div>

                        <ReviewsSection productId={id} />
                    </div>
                </div>

                <div className="similar-products-section">
                    <div className="section-header">
                        <h2>Similar Products</h2>
                        <a href="/products" className="shop-now-link">Shop <span>Now</span></a>
                    </div>
                    <div className="products-grid">
                        <PropCard cardlist={similarProducts} />
                    </div>
                </div>

                <OurBrands />
                <Recommendations category={product?.category} currentProductId={id} />
                <RecentlyViewed excludeId={id} />
            </div>

            <Footers />

            <LensSelectionModal 
                isOpen={showLensModal}
                onClose={() => setShowLensModal(false)}
                product={product}
                lensEnhancements={lensEnhancements}
                addItemToCart={addItemToCart}
                setCartOpen={setCartOpen}
                setDrawerTab={setDrawerTab}
            />
            <Product360Viewer 
                images={product.thumbnails} 
                isOpen={is360Open} 
                onClose={() => setIs360Open(false)} 
            />
        </div>
    );
};

export default ProductDetails;
