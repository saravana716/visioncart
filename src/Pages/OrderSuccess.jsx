import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { FaCheckCircle, FaShoppingBag, FaPrint, FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import './OrderSuccess.css';
import { getOrderById } from '../services/firestoreService';
import InvoiceDocument from '../Components/InvoiceDocument';
import { fulfillOrderInvoicing } from '../services/fulfillmentService';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = location.state?.orderId || searchParams.get('order_id');
    
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('pending'); // pending, generating, complete, error
    const [invoiceUrl, setInvoiceUrl] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        const processFulfillment = async () => {
            try {
                // 1. Fetch Order Data
                const orderData = await getOrderById(orderId);
                if (!orderData) throw new Error("Order not found");
                setOrder(orderData);

                // 2. Short delay to ensure InvoiceDocument renders in the hidden div
                setStatus('generating');
                setTimeout(async () => {
                    try {
                        const url = await fulfillOrderInvoicing(orderId, 'hidden-invoice-capture');
                        setInvoiceUrl(url);
                        setStatus('complete');
                        toast.success("Professional invoice secured in cloud!");
                    } catch (err) {
                        console.error("Fulfillment failed:", err);
                        setStatus('error');
                    }
                }, 2000);

            } catch (err) {
                console.error("Order fetch failed:", err);
                setStatus('error');
            }
        };

        processFulfillment();
    }, [orderId]);

    const handleDownload = () => {
        if (invoiceUrl) {
            window.open(invoiceUrl, '_blank');
        } else {
            navigate(`/invoice/${orderId}`);
        }
    };

    return (
        <div className="success-page">
            <Navbar />
            
            {/* Hidden Invoice for Background PDF Capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0 }}>
                {order && <InvoiceDocument order={order} id="hidden-invoice-capture" />}
            </div>

            <div className="success-container">
                <div className="success-card fade-in">
                    <div className="success-icon">
                        <FaCheckCircle />
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="order-id">Order ID: <span>#{orderId}</span></p>
                    
                    <div className="fulfillment-status-bar">
                        {status === 'generating' && (
                            <p className="status-loading"><FaCloudUploadAlt className="spin" /> Securing professional invoice to cloud...</p>
                        )}
                        {status === 'complete' && (
                            <p className="status-complete"><FaFilePdf /> Government-ready invoice is now available.</p>
                        )}
                        {status === 'error' && (
                            <p className="status-error">Note: Automatic cloud sync failed. You can still print manually.</p>
                        )}
                    </div>

                    <p className="success-msg">
                        Thank you for shopping with VisionCart! Your eyewear is being processed 
                        and will be shipped shortly. A confirmation email has been sent.
                    </p>
                    
                    <div className="success-actions">
                        <button className="view-orders-btn" onClick={() => navigate('/profile')}>
                            <FaShoppingBag /> View My Orders
                        </button>
                        
                        <button 
                            className={`invoice-btn-luxury ${status === 'complete' ? 'success' : ''}`} 
                            onClick={handleDownload}
                        >
                            {status === 'generating' ? (
                                <><span className="mini-loader"></span> Processing...</>
                            ) : (
                                <><FaPrint /> {status === 'complete' ? 'Download PDF Invoice' : 'View Invoice'}</>
                            )}
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
