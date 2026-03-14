import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserOrders } from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { FaShoppingBag, FaBox, FaClock, FaCheckCircle, FaChevronRight, FaMapMarkerAlt, FaCreditCard, FaReceipt } from 'react-icons/fa';
import './Orders.css';
import Loader from '../Components/Loader/Loader';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const fetchedOrders = await getUserOrders(currentUser.uid);
                setOrders(fetchedOrders);
            } else {
                navigate('/login');
            }
            // Small delay for premium feel
            setTimeout(() => setLoading(false), 500);
        });
        return () => unsubscribe();
    }, [navigate]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Processing';
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) return <Loader fullPage={true} />;

    return (
        <div className="orders-premium-page">
            <Navbar />
            <div className="orders-hero">
                <div className="hero-content">
                    <h1>Order History</h1>
                    <p>Review your past selections and track current eyewear</p>
                </div>
            </div>

            <div className="orders-main-container">
                {orders.length === 0 ? (
                    <div className="empty-orders-state fade-in">
                        <div className="empty-icon-box">
                            <FaShoppingBag />
                        </div>
                        <h2>Your collection is empty</h2>
                        <p>Discover the latest in designer eyewear and start your journey.</p>
                        <button className="premium-btn" onClick={() => navigate('/products')}>Explore Products</button>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            <div key={order.id} className="premium-order-card fade-in">
                                <div className="card-top-bar">
                                    <div className="order-main-meta">
                                        <div className="order-ref">
                                            <span className="label">Order Ref.</span>
                                            <span className="value">#{order.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                        <div className="order-date">
                                            <span className="label">Date</span>
                                            <span className="value">{formatDate(order.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className={`status-pill ${order.status.toLowerCase()}`}>
                                        {order.status === 'Ordered' ? <FaClock /> : <FaCheckCircle />}
                                        {order.status}
                                    </div>
                                </div>

                                <div className="card-body-grid">
                                    <div className="items-column">
                                        <h3><FaBox /> Items Summary</h3>
                                        <div className="order-items-list">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="minimal-item">
                                                    <div className="item-preview">
                                                        <img src={item.productImage} alt="" />
                                                    </div>
                                                    <div className="item-details">
                                                        <h4>{item.productName}</h4>
                                                        <p>{item.lensType} • {item.material}</p>
                                                        {item.prescription && <span className="p-badge">Prescription</span>}
                                                    </div>
                                                    <div className="item-price-tag">
                                                        {item.totalPrice}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="info-column">
                                        <div className="info-section">
                                            <h3><FaMapMarkerAlt /> Shipping To</h3>
                                            <div className="address-box">
                                                <strong>{order.shippingAddress?.fullName}</strong>
                                                <p>{order.shippingAddress?.address}</p>
                                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                                                <small>Ph: {order.shippingAddress?.phone}</small>
                                            </div>
                                        </div>

                                        <div className="info-section">
                                            <h3><FaCreditCard /> Payment</h3>
                                            <p className="payment-method-text">{order.paymentMethod}</p>
                                        </div>

                                        <div className="pricing-summary-luxury">
                                            <div className="luxury-row">
                                                <span>Subtotal</span>
                                                <span>₹{order.amounts?.subtotal?.toLocaleString()}</span>
                                            </div>
                                            <div className="luxury-row">
                                                <span>Tax</span>
                                                <span>₹{order.amounts?.tax?.toLocaleString()}</span>
                                            </div>
                                            <div className="luxury-row grand">
                                                <span>Total</span>
                                                <span>₹{order.amounts?.total?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="order-status-timeline">
                                    <div className="timeline-line">
                                        <div 
                                            className="timeline-line-filled" 
                                            style={{ 
                                                width: order.status === 'Delivered' ? '100%' : 
                                                       order.status === 'Shipped' ? '50%' : '0%' 
                                            }}
                                        ></div>
                                    </div>
                                    <div className={`timeline-step ${['Processing', 'Shipped', 'Delivered'].indexOf(order.status) >= 0 ? 'active' : ''}`}>
                                        <div className="dot"></div>
                                        <span>Processing</span>
                                    </div>
                                    <div className={`timeline-step ${['Shipped', 'Delivered'].indexOf(order.status) >= 0 ? 'active' : ''}`}>
                                        <div className="dot"></div>
                                        <span>Shipped</span>
                                    </div>
                                    <div className={`timeline-step ${order.status === 'Delivered' ? 'active' : ''}`}>
                                        <div className="dot"></div>
                                        <span>Delivered</span>
                                    </div>
                                </div>

                                <div className="card-footer-actions">
                                    <button className="invoice-btn"><FaReceipt /> Invoice</button>
                                    <button 
                                        className="details-btn"
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                    >
                                        View Details <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footers />
        </div>
    );
};

export default Orders;
