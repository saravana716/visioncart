import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserOrders } from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { FaShoppingBag, FaBox, FaClock, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
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
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Recent';
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <Navbar />
                <div className="orders-loader-container">
                    <div className="loader"></div>
                    <p>Fetching your orders...</p>
                </div>
                <Footers />
            </div>
        );
    }

    return (
        <div className="orders-page">
            <Navbar />
            <div className="orders-container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track and manage your recent purchases</p>
                </div>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <FaShoppingBag />
                        <h2>No Orders Found</h2>
                        <p>You haven't placed any orders yet. Start shopping for your perfect pair!</p>
                        <button className="shop-now-btn" onClick={() => navigate('/products')}>Shop Now</button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className={`order-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                                <div className="order-main-info" onClick={() => toggleOrderDetails(order.id)}>
                                    <div className="order-primary-details">
                                        <div className="status-badge" data-status={order.status}>
                                            {order.status === 'Ordered' ? <FaClock /> : <FaCheckCircle />}
                                            {order.status}
                                        </div>
                                        <div className="order-id-date">
                                            <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-summary-metrics">
                                        <div className="metric">
                                            <label>Items</label>
                                            <p>{order.items?.length || 0}</p>
                                        </div>
                                        <div className="metric">
                                            <label>Total Amount</label>
                                            <p className="total-price">₹{order.amounts?.total?.toLocaleString()}</p>
                                        </div>
                                        <div className="expand-icon">
                                            {expandedOrder === order.id ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                </div>

                                {expandedOrder === order.id && (
                                    <div className="order-expanded-content fade-in">
                                        <div className="order-details-grid">
                                            <div className="items-section">
                                                <h4>Items Ordered</h4>
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="order-item-row">
                                                        <div className="item-img">
                                                            <img src={item.productImage} alt={item.productName} />
                                                        </div>
                                                        <div className="item-info">
                                                            <p className="item-name">{item.productName}</p>
                                                            <p className="item-config">
                                                                {item.lensType} | {item.material} 
                                                                {item.enhancements?.length > 0 && ` | ${item.enhancements.map(e => e.name).join(', ')}`}
                                                            </p>
                                                            {item.prescription && (
                                                                <span className="prescription-tag">Prescription Attached</span>
                                                            )}
                                                        </div>
                                                        <p className="item-price">{item.totalPrice}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="delivery-section">
                                                <div className="shipping-info">
                                                    <h4>Shipping Address</h4>
                                                    <p className="customer-name">{order.shippingAddress?.fullName}</p>
                                                    <p>{order.shippingAddress?.address}</p>
                                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                                                    <p className="contact">Ph: {order.shippingAddress?.phone}</p>
                                                </div>
                                                <div className="payment-info">
                                                    <h4>Payment Method</h4>
                                                    <p>{order.paymentMethod}</p>
                                                </div>
                                                <div className="detailed-pricing">
                                                    <div className="price-row"><span>Subtotal:</span> <span>₹{order.amounts?.subtotal?.toLocaleString()}</span></div>
                                                    <div className="price-row"><span>GST (18%):</span> <span>₹{order.amounts?.tax?.toLocaleString()}</span></div>
                                                    <div className="price-row free"><span>Shipping:</span> <span>FREE</span></div>
                                                    <div className="price-row grand-total"><span>Grand Total:</span> <span>₹{order.amounts?.total?.toLocaleString()}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
