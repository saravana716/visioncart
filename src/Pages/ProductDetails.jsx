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
// import Product360Viewer from '../Components/Product360Viewer/Product360Viewer';
import ImageZoom from '../Components/ImageZoom/ImageZoom';
// import { MdOutline360 } from "react-icons/md";
import LensSelectionModal from '../Components/LensSelectionModal/LensSelectionModal';
import ReadingGlassesPowerSelector from '../Components/ReadingGlassesPowerSelector/ReadingGlassesPowerSelector';

const categoryDescriptions = {
    'Spectacles': {
        title: 'Premium Optical Frames – Acetate & Metal',
        description: 'Upgrade your everyday style with our premium optical frames. Available in high-quality acetate and durable metal, these frames offer comfort, strength, and a modern look. Designed for daily wear, office use, and all face shapes, they provide the perfect balance of style and functionality. Lightweight and comfortable, these frames are ideal for long hours of use.',
        highlights: [
            {
                title: 'Acetate (Plastic) Highlights',
                items: [
                    'Premium quality acetate material',
                    'Lightweight and durable design',
                    'Smooth finish with stylish colors',
                    'Comfortable nose fit for all-day wear',
                    'Perfect for trendy and fashionable looks'
                ]
            },
            {
                title: 'Metal Frames Highlights',
                items: [
                    'Strong and durable metal construction',
                    'Slim, elegant, and modern design',
                    'Lightweight for comfortable wear',
                    'Ideal for office and formal use',
                    'Perfect for a clean and classy look'
                ]
            }
        ]
    },
    'Sunglasses': {
        title: 'Sunglasses Description',
        description: 'Protect your eyes in style with our premium sunglasses. Designed to provide UV protection, they help shield your eyes from harmful sun rays while keeping your vision clear and comfortable. Featuring lightweight frames and a comfortable fit, these sunglasses are perfect for daily wear, travel, and outdoor activities. With trendy designs and durable quality, they offer the perfect combination of style, comfort, and protection.',
        highlights: [
            {
                title: 'Sunglasses Highlights',
                items: [
                    'UV protection for eye safety',
                    'Lightweight and comfortable frame',
                    'Strong and durable design',
                    'Trendy and stylish look',
                    'Comfortable fit for daily wear',
                    'Premium quality materials'
                ]
            }
        ]
    },
    'Reading Glasses': {
        title: 'Reading Glasses Description',
        description: 'Make everyday reading easy and comfortable with our stylish reading glasses. Designed for clear near vision, they are perfect for reading books, newspapers, and mobile screens, as well as other close-up tasks. With lightweight frames and a comfortable fit, these glasses are ideal for long wear. Available in attractive designs, they offer the perfect mix of clarity, comfort, and style for daily wear.',
        highlights: [
            {
                title: 'Reading Glasses Highlights',
                items: [
                    'Clear vision for near reading',
                    'Lightweight and comfortable frame',
                    'Stylish and elegant designs',
                    'Suitable for daily use',
                    'Comfortable fit for long hours',
                    'Durable frame quality',
                    'Ideal for books, mobiles, and close work',
                    'Available in different styles and powers'
                ]
            }
        ]
    },
    'Computer Glasses': {
        title: 'Computer Glasses Description',
        description: 'Protect your eyes and improve your screen experience with our computer glasses. Designed to reduce digital eye strain, they help you stay comfortable during long hours of screen time on computers, laptops, and mobile devices. With lightweight frames and a comfortable fit, these glasses are perfect for daily use at work, at school, or at home. Featuring modern designs and durable quality, they offer the ideal combination of style, comfort, and eye protection.',
        highlights: [
            {
                title: 'Computer Glasses Highlights',
                items: [
                    'Helps reduce digital eye strain',
                    'Comfortable for long screen time',
                    'Lightweight and stylish frame',
                    'Suitable for computer, laptop, and mobile use',
                    'Supports better visual comfort',
                    'Durable and comfortable for daily wear',
                    'Modern designs for men, women, and unisex use',
                    'Ideal for office, study, and home use'
                ]
            }
        ]
    },
    'Contact Lenses': {
        title: 'Bausch & Lomb Eyewear / Contact Lenses Description',
        description: 'Experience trusted vision care with Bausch & Lomb products, known for their quality, comfort, and reliability. Designed to provide clear vision and long-lasting performance, they are ideal for daily use. With advanced technology and premium materials, Bausch & Lomb ensures better eye protection, comfort, and clarity. Suitable for all-day wear, these products are perfect for those seeking dependable, high-quality eye care solutions.',
        highlights: [
            {
                title: 'Bausch & Lomb Highlights',
                items: [
                    'Trusted and well-known eye care brand',
                    'High-quality vision products',
                    'Clear and comfortable vision',
                    'Advanced lens technology',
                    'Suitable for daily use',
                    'Long-lasting performance',
                    'Safe and reliable eye care solutions',
                    'Ideal for all-day comfort'
                ]
            }
        ]
    }
};

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
    const [readingPower, setReadingPower] = useState({ rightPower: '', leftPower: '', sameForBoth: true });
    const [selectedColor, setSelectedColor] = useState(null);
    // const [is360Open, setIs360Open] = useState(false);
    
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
                    hoverImg: (p.photos && p.photos.length > 1) ? p.photos[1] : null,
                    title: p.name || p.title || p.productName || p.brand || "Visionkart",

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

    useEffect(() => {
        if (loading) return;

        // Intersection Observer for Scroll Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [loading]);



    if (loading) return <Loader fullPage={true} />;
    if (!product) return <div style={{padding: '100px', textAlign: 'center', fontSize: '20px'}}>Product not found</div>;
    
    const renderTechnicalInfo = (viewType) => (
        <div className={`info-left-col ${viewType === 'desktop' ? 'hide-on-mobile' : 'hide-on-desktop'}`}>
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

            {product.category && categoryDescriptions[product.category] && (
                <div className="category-dynamic-desc">
                    <h2>{categoryDescriptions[product.category].title}</h2>
                    <p className="desc-text">{categoryDescriptions[product.category].description}</p>
                    
                    <div className="highlights-container">
                        {categoryDescriptions[product.category].highlights.map((highlightGroup, idx) => (
                            <div key={idx} className="highlight-group">
                                <h3>{highlightGroup.title}</h3>
                                <ul>
                                    {highlightGroup.items.map((item, itemIdx) => (
                                        <li key={itemIdx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="product-details-page">
            <Navbar />
            
            {product.categoryBanner && (
                <div className="category-banner">
                    <img src={product.categoryBanner} alt={product.category} />
                </div>
            )}
            
            <div className="product-container">
                <div className="breadcrumbs scroll-reveal">
                    Home &gt; {product.category} &gt; {product.brand}
                </div>

                <div className="main-info-grid scroll-reveal">
                    {/* Left: Gallery & Technical info */}
                    <div className="product-main-left">
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
                                </div>
                            </div>
                        </div>

                        {renderTechnicalInfo('desktop')}
                    </div>

                    {/* Right: Info */}
                    <div className="product-info-panel">

                        <h1>{product.title}</h1>
                        <p className="size-info">Size: {product.size}</p>
                        <div className="rating-row">
                            <img src={rateimg} alt="stars" />
                            <span>({product.rating}/5)</span>
                        </div>
                        <div className="product-pricing">
                            <span className="current-price">{product.price}</span>
                            <span className="offer-tag">{product.discount}</span>
                        </div>

                        <div className={`stock-status-pill ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'limited-stock' : 'out-of-stock'}`}>
                            <span className="pulse-dot"></span>
                            {product.stock > 5 
                                ? `In Stock (${product.stock} available)` 
                                : product.stock > 0 
                                    ? `Only ${product.stock} left!` 
                                    : 'Out of Stock'}
                        </div>



                        <div className="virtual-tryon-banner-premium" onClick={() => window.open('/try-on', '_blank')}>
                            <div className="tryon-content">
                                <span className="tryon-badge">LIVE AR</span>
                                <h3>3D Virtual Try-On</h3>
                                <p>See how they look on your face instantly</p>
                            </div>
                            <div className="tryon-img">
                                <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400" alt="Model AR" />
                            </div>
                        </div>

                        <div className="action-buttons-group">
                            <button className="btn-action-primary pink">Prescription Upload</button>
                            <button className="btn-action-outline blue" onClick={() => setShowLensModal(true)}>Select lens</button>
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
                                        productBrand: product.brand,
                                        productName: product.title,
                                        productImage: product.mainImage,
                                        productPrice: product.price,
                                        productSize: product.size,
                                        totalPrice: product.price,
                                        category: product.category,
                                        specifications: [
                                            ...(product.technicalSpecs || []),
                                            { label: 'Color', value: selectedColor?.name || (product.colors?.[0]?.name) || 'Default' },
                                            { label: 'Size', value: product.size || 'Standard' },
                                            { label: 'Lens', value: 'Frame Only' },
                                            { label: 'Material', value: 'Standard' }
                                        ],
                                        sku: product.technicalSpecs?.find(s => s.label === 'SKU Code')?.value || id,
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

                <div className="middle-info-grid scroll-reveal">
                    <div className="info-left-col">
                        {renderTechnicalInfo('mobile')}
                        <ReviewsSection productId={id} />
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
                    </div>
                </div>

                <div className="similar-products-section scroll-reveal">
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
            {/* <Product360Viewer 
                images={product.thumbnails} 
                isOpen={is360Open} 
                onClose={() => setIs360Open(false)} 
            /> */}
        </div>
    );
};

export default ProductDetails;
