import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId || "VC-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    return (
        <div className="success-page">
            <Navbar />
            <div className="success-container">
                <div className="success-card fade-in">
                    <div className="success-icon">
                        <FaCheckCircle />
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="order-id">Order ID: <span>#{orderId}</span></p>
                    <p className="success-msg">
                        Thank you for shopping with VisionCart! Your eyewear is being processed 
                        and will be shipped shortly. A confirmation email has been sent.
                    </p>
                    
                    <div className="success-actions">
                        <button className="view-orders-btn" onClick={() => navigate('/profile')}>
                            <FaShoppingBag /> View My Orders
                        </button>
                        <button className="continue-btn" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>

                    <div className="estimated-delivery">
                        <p>Estimated Delivery: <span>3-5 Business Days</span></p>
                    </div>
                </div>
            </div>
            <Footers />
        </div>
    );
};

export default OrderSuccess;
