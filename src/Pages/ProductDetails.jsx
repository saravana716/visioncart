import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import OurBrands from '../Components/Ourbrands/OurBrands';
import PropCard from '../Components/PropCard/PropCard';
import { products } from '../data/products';
import rateimg from '../assets/star.png';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Initialize state synchronously to prevent "Loading..." flash
    const [product, setProduct] = useState(() => products.find(p => p.id === id) || products[0]);
    const [selectedImg, setSelectedImg] = useState(product?.mainImage || '');
    const [showLensModal, setShowLensModal] = useState(false);

    useEffect(() => {
        const foundProduct = products.find(p => p.id === id);
        if (foundProduct) {
            setProduct(foundProduct);
            setSelectedImg(foundProduct.mainImage);
        }
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) return null;

    const cardList = products.map(p => ({
        id: p.id,
        img: p.mainImage,
        title: p.brand,
        rating: rateimg,
        ratingcount: p.ratingCount,
        price: p.price,
        mrpprice: p.originalPrice,
        color: "",
        colorcount: p.colors.length
    }));

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
                            <button className="gray-btn">Add to Cart</button>
                            <button className="gray-btn">Buy Now</button>
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

                        <div className="reviews-section">
                            <div className="reviews-header">
                                <h2>Review ({product.ratingCount})</h2>
                                <div className="stars-avg">★★★★☆</div>
                            </div>
                            <div className="reviews-grid">
                                <div className="review-card">
                                    <div className="rev-stars">★★★★☆</div>
                                    <p className="rev-text">Great quality!</p>
                                    <p className="rev-user">Aman - Dec 22, 2024</p>
                                </div>
                                <div className="review-card">
                                    <div className="rev-stars">★★★★★</div>
                                    <p className="rev-text">Very good product.</p>
                                    <p className="rev-user">Aman - Dec 22, 2024</p>
                                </div>
                                <div className="review-card">
                                    <div className="rev-stars">★★★☆☆</div>
                                    <p className="rev-text">Fast Delivery.</p>
                                    <p className="rev-user">Aman - Dec 22, 2024</p>
                                </div>
                            </div>
                            <button className="green-more-btn">More Reviews</button>
                        </div>
                    </div>
                </div>

                <div className="similar-products-section">
                    <div className="section-header">
                        <h2>Similar Products</h2>
                        <a href="/products" className="shop-now-link">Shop <span>Now</span></a>
                    </div>
                    <div className="products-grid">
                        <PropCard cardlist={cardList} />
                    </div>
                </div>

                <OurBrands />
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
                                <div className="lens-type-item active">
                                    <div className="icon">👁️</div>
                                    <p>Single Vision</p>
                                    <span>Distance | Near Vision</span>
                                </div>
                                <div className="lens-type-item">
                                    <div className="icon">🔄</div>
                                    <p>Progressive</p>
                                    <span>Near & Far Vision</span>
                                </div>
                                <div className="lens-type-item">
                                    <div className="icon">👓</div>
                                    <p>Bifocal</p>
                                    <span>Dual Vision</span>
                                </div>
                                <div className="lens-type-item">
                                    <div className="icon">⚙️</div>
                                    <p>Anti-Power</p>
                                    <span>Fashion Lenses</span>
                                </div>
                            </div>

                            <h2 className="modal-title-small">Select Lens Material</h2>
                            <div className="material-grid">
                                <label><input type="radio" name="material" /> <span>Metal</span></label>
                                <label><input type="radio" name="material" /> <span>Stainless Steel</span></label>
                                <label><input type="radio" name="material" defaultChecked /> <span>TR90 <span className="recommended">Recommended</span></span></label>
                                <label><input type="radio" name="material" /> <span>Mixed Material</span></label>
                                <label><input type="radio" name="material" /> <span>Titanium</span></label>
                            </div>

                            <h2 className="modal-title-small">Select Frame Style</h2>
                            <div className="material-grid">
                                <label><input type="radio" name="f-style" /> <span>Rimmed</span></label>
                                <label><input type="radio" name="f-style" /> <span>Semi - Rimmed</span></label>
                                <label><input type="radio" name="f-style" /> <span>Rimless</span></label>
                            </div>

                            <h2 className="modal-title-small">Add Lens Enhancements</h2>
                            <div className="enhancements-grid">
                                <label><input type="checkbox" /> Anti-Glare</label>
                                <label><input type="checkbox" /> Blue Cut</label>
                                <label><input type="checkbox" /> UV Protection</label>
                                <label><input type="checkbox" /> Hard Multi Coat</label>
                                <label><input type="checkbox" /> Anti Dust</label>
                                <label><input type="checkbox" /> Auto Cooling</label>
                                <label><input type="checkbox" /> Extra Cooling</label>
                                <label><input type="checkbox" /> Tinted</label>
                            </div>

                            <h2 className="modal-title-small">Power Options - Eye Selection</h2>
                            <div className="prescription-toggle">
                                <label><input type="radio" name="p-type" defaultChecked /> Same power for both eyes</label>
                                <label><input type="radio" name="p-type" /> Different power for each eye</label>
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
                                                    <div className="p-row"><span>SPH</span><select><option>-0.50</option></select></div>
                                                    <div className="p-row"><span>CYL</span><select><option>----</option></select></div>
                                                    <div className="p-row"><span>AXIS</span><select><option>----</option></select></div>
                                                    <div className="p-row"><span>ADD</span><select><option>----</option></select></div>
                                                </td>
                                                <td>
                                                    <div className="p-row"><span>SPH</span><select><option>-0.50</option></select></div>
                                                    <div className="p-row"><span>CYL</span><select><option>----</option></select></div>
                                                    <div className="p-row"><span>AXIS</span><select><option>----</option></select></div>
                                                    <div className="p-row"><span>ADD</span><select><option>----</option></select></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="save-btn-green">Save</button>
                                </div>
                            </div>

                            <h2 className="modal-title-small">How will you use these glasses?</h2>
                            <div className="usage-grid">
                                <div className="usage-item">
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3652/3652115.png" alt="Everyday" />
                                    </div>
                                    <p>Everyday</p>
                                </div>
                                <div className="usage-item">
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3062/3062115.png" alt="Computer" />
                                    </div>
                                    <p>Computer | Screen</p>
                                </div>
                                <div className="usage-item">
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3308/3308336.png" alt="Reading" />
                                    </div>
                                    <p>Reading</p>
                                </div>
                                <div className="usage-item">
                                    <div className="usage-box">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2554/2554907.png" alt="Driving" />
                                    </div>
                                    <p>Driving</p>
                                </div>
                            </div>

                            <div className="price-summary-box">
                                <div className="p-line"><span>Frame Price:</span> <span>₹350</span></div>
                                <div className="p-line"><span>Lens Price:</span> <span>₹150</span></div>
                                <div className="p-line"><span>Add-ons:</span> <span>₹50</span></div>
                                <div className="p-total-line"><span>Total Price:</span> <span>₹550</span></div>
                            </div>

                            <div className="modal-footer-btns">
                                <button className="modal-add-cart">Add to Cart</button>
                                <button className="modal-buy-now">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
