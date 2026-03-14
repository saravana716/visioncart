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
    const [selectedEnhancements, setSelectedEnhancements] = useState([]);
    
    // Detailed Selection State
    const [selectedLensType, setSelectedLensType] = useState('Single Vision');
    const [selectedMaterial, setSelectedMaterial] = useState('TR90');
    const [selectedFrameStyle, setSelectedFrameStyle] = useState('Rimmed');
    const [selectedUsage, setSelectedUsage] = useState('Everyday');
    const [prescriptionType, setPrescriptionType] = useState('Same power for both eyes');
    const [prescription, setPrescription] = useState({
        right: { sph: '-0.50', cyl: '----', axis: '----', add: '----' },
        left: { sph: '-0.50', cyl: '----', axis: '----', add: '----' }
    });

    const { addItemToCart } = useCart();

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
            }
            setLoading(false);
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

    const toggleEnhancement = (enh) => {
        setSelectedEnhancements(prev => {
            const exists = prev.find(e => e.id === enh.id);
            if (exists) {
                return prev.filter(e => e.id !== enh.id);
            } else {
                return [...prev, enh];
            }
        });
    };

    const calculateTotalPrice = () => {
        if (!product) return '₹0';
        const base = parseInt(product.price.toString().replace(/[^0-9]/g, '') || '0');
        const extras = selectedEnhancements.reduce((sum, enh) => sum + (parseInt(enh.price || 0)), 0);
        return `₹${base + extras}`;
    };

    if (loading) return <div style={{padding: '100px', textAlign: 'center', fontSize: '20px'}}>Loading Product Details...</div>;
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
                        <div className="main-image">
                            <img src={selectedImg} alt="Main Product" />
                            <button className="wishlist-btn-abs">♡</button>
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

                        <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
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
                                className={`gray-btn ${product.stock <= 0 ? 'disabled' : ''}`}
                                onClick={async () => {
                                    if (product.stock <= 0) return;
                                    const cartData = {
                                        productId: id,
                                        productName: product.title,
                                        productImage: product.mainImage,
                                        productPrice: product.price,
                                        totalPrice: product.price
                                    };
                                    await addItemToCart(cartData);
                                }}
                                disabled={product.stock <= 0}
                            >
                                Add to Cart
                            </button>
                            <button 
                                className={`gray-btn ${product.stock <= 0 ? 'disabled' : ''}`}
                                disabled={product.stock <= 0}
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

            {/* Lens Selection Modal */}
            {showLensModal && (
                <div className="lens-modal-overlay">
                    <div className="lens-modal">
                        <button className="close-modal" onClick={() => setShowLensModal(false)}>✕</button>
                        
                        <div className="modal-content">
                            <h2 className="modal-title-small">Select Lens Type</h2>
                            <div className="lens-type-grid">
                                <div className={`lens-type-item ${selectedLensType === 'Single Vision' ? 'active' : ''}`} onClick={() => setSelectedLensType('Single Vision')}>
                                    <div className="icon">👁️</div>
                                    <p>Single Vision</p>
                                    <span>Distance | Near Vision</span>
                                </div>
                                <div className={`lens-type-item ${selectedLensType === 'Progressive' ? 'active' : ''}`} onClick={() => setSelectedLensType('Progressive')}>
                                    <div className="icon">🔄</div>
                                    <p>Progressive</p>
                                    <span>Near & Far Vision</span>
                                </div>
                                <div className={`lens-type-item ${selectedLensType === 'Bifocal' ? 'active' : ''}`} onClick={() => setSelectedLensType('Bifocal')}>
                                    <div className="icon">👓</div>
                                    <p>Bifocal</p>
                                    <span>Dual Vision</span>
                                </div>
                                <div className={`lens-type-item ${selectedLensType === 'Anti-Power' ? 'active' : ''}`} onClick={() => setSelectedLensType('Anti-Power')}>
                                    <div className="icon">⚙️</div>
                                    <p>Anti-Power</p>
                                    <span>Fashion Lenses</span>
                                </div>
                            </div>

                            <h2 className="modal-title-small">Select Lens Material</h2>
                            <div className="material-grid">
                                <label><input type="radio" name="material" checked={selectedMaterial === 'Metal'} onChange={() => setSelectedMaterial('Metal')} /> <span>Metal</span></label>
                                <label><input type="radio" name="material" checked={selectedMaterial === 'Stainless Steel'} onChange={() => setSelectedMaterial('Stainless Steel')} /> <span>Stainless Steel</span></label>
                                <label><input type="radio" name="material" checked={selectedMaterial === 'TR90'} onChange={() => setSelectedMaterial('TR90')} /> <span>TR90 <span className="recommended">Recommended</span></span></label>
                                <label><input type="radio" name="material" checked={selectedMaterial === 'Mixed Material'} onChange={() => setSelectedMaterial('Mixed Material')} /> <span>Mixed Material</span></label>
                                <label><input type="radio" name="material" checked={selectedMaterial === 'Titanium'} onChange={() => setSelectedMaterial('Titanium')} /> <span>Titanium</span></label>
                            </div>

                            <h2 className="modal-title-small">Select Frame Style</h2>
                            <div className="material-grid">
                                <label><input type="radio" name="f-style" checked={selectedFrameStyle === 'Rimmed'} onChange={() => setSelectedFrameStyle('Rimmed')} /> <span>Rimmed</span></label>
                                <label><input type="radio" name="f-style" checked={selectedFrameStyle === 'Semi - Rimmed'} onChange={() => setSelectedFrameStyle('Semi - Rimmed')} /> <span>Semi - Rimmed</span></label>
                                <label><input type="radio" name="f-style" checked={selectedFrameStyle === 'Rimless'} onChange={() => setSelectedFrameStyle('Rimless')} /> <span>Rimless</span></label>
                            </div>

                            <h2 className="modal-title-small">Add Lens Enhancements</h2>
                            <div className="enhancements-grid">
                                {lensEnhancements.map((enh) => (
                                    <label key={enh.id} className={selectedEnhancements.find(e => e.id === enh.id) ? 'active' : ''}>
                                        <input 
                                            type="checkbox" 
                                            checked={!!selectedEnhancements.find(e => e.id === enh.id)}
                                            onChange={() => toggleEnhancement(enh)}
                                        /> {enh.name} {enh.price > 0 && `(+₹${enh.price})`}
                                    </label>
                                ))}
                            </div>

                            <h2 className="modal-title-small">Power Options - Eye Selection</h2>
                            <div className="prescription-toggle">
                                <label>
                                    <input type="radio" name="p-type" checked={prescriptionType === 'Same power for both eyes'} onChange={() => setPrescriptionType('Same power for both eyes')} /> 
                                    <span>Same power for both eyes</span>
                                </label>
                                <label>
                                    <input type="radio" name="p-type" checked={prescriptionType === 'Different power for each eye'} onChange={() => setPrescriptionType('Different power for each eye')} /> 
                                    <span>Different power for each eye</span>
                                </label>
                            </div>

                            <div className="prescription-input-area">
                                <h3>Prescription Input Table</h3>
                                <div className="prescription-table-wrapper">
                                    <table className="prescription-table">
                                        <thead>
                                            <tr>
                                                <th>Right Eye</th>
                                                <th>Left Eye</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="p-row"><span>SPH</span><select value={prescription.right.sph} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, sph: e.target.value } }))}><option>-0.50</option><option>0.00</option><option>+0.50</option></select></div>
                                                    <div className="p-row"><span>CYL</span><select value={prescription.right.cyl} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, cyl: e.target.value } }))}><option>----</option><option>-0.25</option></select></div>
                                                    <div className="p-row"><span>AXIS</span><select value={prescription.right.axis} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, axis: e.target.value } }))}><option>----</option><option>90</option><option>180</option></select></div>
                                                    <div className="p-row"><span>ADD</span><select value={prescription.right.add} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, add: e.target.value } }))}><option>----</option><option>+1.00</option></select></div>
                                                </td>
                                                <td>
                                                    <div className="p-row"><span>SPH</span><select value={prescription.left.sph} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, sph: e.target.value } }))}><option>-0.50</option><option>0.00</option><option>+0.50</option></select></div>
                                                    <div className="p-row"><span>CYL</span><select value={prescription.left.cyl} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, cyl: e.target.value } }))}><option>----</option><option>-0.25</option></select></div>
                                                    <div className="p-row"><span>AXIS</span><select value={prescription.left.axis} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, axis: e.target.value } }))}><option>----</option><option>90</option><option>180</option></select></div>
                                                    <div className="p-row"><span>ADD</span><select value={prescription.left.add} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, add: e.target.value } }))}><option>----</option><option>+1.00</option></select></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="save-btn-green">Save</button>
                                </div>
                            </div>

                            <h2 className="modal-title-small">How will you use these glasses?</h2>
                            <div className="usage-grid">
                                <div className={`usage-item ${selectedUsage === 'Everyday' ? 'active' : ''}`} onClick={() => setSelectedUsage('Everyday')}>
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3652/3652115.png" alt="Everyday" />
                                    </div>
                                    <p>Everyday</p>
                                </div>
                                <div className={`usage-item ${selectedUsage === 'Computer | Screen' ? 'active' : ''}`} onClick={() => setSelectedUsage('Computer | Screen')}>
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3062/3062115.png" alt="Computer" />
                                    </div>
                                    <p>Computer | Screen</p>
                                </div>
                                <div className={`usage-item ${selectedUsage === 'Reading' ? 'active' : ''}`} onClick={() => setSelectedUsage('Reading')}>
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3308/3308336.png" alt="Reading" />
                                    </div>
                                    <p>Reading</p>
                                </div>
                                <div className={`usage-item ${selectedUsage === 'Driving' ? 'active' : ''}`} onClick={() => setSelectedUsage('Driving')}>
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2554/2554907.png" alt="Driving" />
                                    </div>
                                    <p>Driving</p>
                                </div>
                            </div>

                            <div className="price-summary-box">
                                <div className="p-line"><span>Frame Price:</span> <span>{product.price}</span></div>
                                <div className="p-line"><span>Lens Price:</span> <span>₹0</span></div>
                                <div className="p-line"><span>Add-ons:</span> <span>₹{selectedEnhancements.reduce((sum, e) => sum + (parseInt(e.price || 0)), 0)}</span></div>
                                <div className="p-total-line"><span>Total Price:</span> <span>{calculateTotalPrice()}</span></div>
                            </div>

                            <div className="modal-footer-btns">
                                <button 
                                    className={`modal-add-cart ${product.stock <= 0 ? 'disabled' : ''}`} 
                                    disabled={product.stock <= 0}
                                    onClick={async () => {
                                        if (product.stock <= 0) return;
                                        const cartData = {
                                            productId: id,
                                            productName: product.title,
                                            productImage: product.mainImage,
                                            productPrice: product.price,
                                            lensType: selectedLensType,
                                            material: selectedMaterial,
                                            frameStyle: selectedFrameStyle,
                                            usage: selectedUsage,
                                            enhancements: selectedEnhancements,
                                            prescriptionType,
                                            prescription,
                                            totalPrice: calculateTotalPrice()
                                        };
                                        const success = await addItemToCart(cartData);
                                        if (success) setShowLensModal(false);
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    className={`modal-buy-now ${product.stock <= 0 ? 'disabled' : ''}`} 
                                    disabled={product.stock <= 0}
                                    onClick={() => setShowLensModal(false)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
