import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/firestoreService';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { 
    FaArrowLeft, 
    FaBox, 
    FaMapMarkerAlt, 
    FaCreditCard, 
    FaClock, 
    FaCheckCircle, 
    FaChevronRight, 
    FaTruck 
} from 'react-icons/fa';
import './OrderDetail.css';
import Loader from '../Components/Loader/Loader';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const data = await getOrderById(orderId);
            setOrder(data);
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Processing';
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <Loader fullPage={true} />;

    if (!order) {
        return (
            <div className="order-details-error">
                <Navbar />
                <div className="error-content">
                    <h2>Order Not Found</h2>
                    <p>The requested order reference could not be retrieved.</p>
                    <button onClick={() => navigate('/orders')}>Back to History</button>
                </div>
                <Footers />
            </div>
        );
    }

    return (
        <div className="order-detail-page">
            <Navbar />
            
            <main className="detail-container">
                <div className="detail-header-section">
                    <button className="back-btn-luxury" onClick={() => navigate('/orders')}>
                        <FaArrowLeft />
                    </button>
                    <div className="header-text-luxury">
                        <span className="tiny-label">ORDER ARTIFACT</span>
                        <h1>Ref: #{order.id.slice(0, 8).toUpperCase()}</h1>
                        <p className="subtitle-luxury">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                </div>

                <div className="tracking-card-luxury">
                    <div className="tracking-progress-neat">
                        <div className={`step-luxury ${['Ordered', 'Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                            <div className="icon-wrap"><FaCheckCircle /></div>
                            <span>Confirmed</span>
                        </div>
                        <div className="connector-luxury"></div>
                        <div className={`step-luxury ${['Shipped', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                            <div className="icon-wrap"><FaTruck /></div>
                            <span>In Transit</span>
                        </div>
                        <div className="connector-luxury"></div>
                        <div className={`step-luxury ${order.status === 'Delivered' ? 'completed' : ''}`}>
                            <div className="icon-wrap"><FaBox /></div>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>

                <div className="detail-split-layout reveal-up stagger-1">
                    <div className="left-column">
                        <section className="item-details-card">
                            <div className="card-header">
                                <h3><FaBox /> Order Composition</h3>
                                <span className="item-count">{order.items?.length} Items</span>
                            </div>
                            <div className="items-list-luxury">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="item-row-luxury">
                                        <div className="item-img-container">
                                            <img src={item.productImage} alt={item.productName} />
                                        </div>
                                        <div className="item-info-luxury">
                                            <h4>{item.productName}</h4>
                                            <div className="item-tags-luxury">
                                                <span>{item.lensType}</span>
                                                <span>{item.material}</span>
                                                {item.prescription && <span className="rx-badge">RX</span>}
                                            </div>
                                        </div>
                                        <div className="item-price-luxury">
                                            <p className="qty-luxury">Qty: 1</p>
                                            <p className="price-luxury">{item.totalPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="right-column">
                        <section className="info-card-premium scroll-reveal">
                            <div className="card-header">
                                <h3><FaMapMarkerAlt /> Shipping To</h3>
                            </div>
                            <div className="address-display">
                                <h4>{order.shippingAddress?.fullName}</h4>
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                                <div className="contact-row">
                                    <FaClock /> <span>Expected in 3-5 Business Days</span>
                                </div>
                            </div>
                        </section>

                        <section className="payment-card-premium scroll-reveal">
                            <div className="card-header">
                                <h3><FaCreditCard /> Financial Summary</h3>
                            </div>
                            <div className="summary-list">
                                <div className="summary-row">
                                    <span>Payment Mode</span>
                                    <span>{order.paymentMethod}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Line Total</span>
                                    <span>₹{order.amounts?.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Taxes (Included)</span>
                                    <span>₹{order.amounts?.tax?.toLocaleString()}</span>
                                </div>
                                <div className="summary-row highlight">
                                    <span>Delivery</span>
                                    <span className="free-tag">COMPLIMENTARY</span>
                                </div>
                                <div className="grand-total-row">
                                    <div className="total-label">Grand Total</div>
                                    <div className="total-value">₹{order.amounts?.total?.toLocaleString()}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footers />
        </div>
    );
};

export default OrderDetail;
