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
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        const processFulfillment = async () => {
            try {
                const orderData = await getOrderById(orderId);
                if (!orderData) throw new Error("Order not found");
                setOrder(orderData);

                if (orderData.invoiceUrl) {
                    setInvoiceUrl(orderData.invoiceUrl);
                    setStatus('complete');
                    return;
                }

                setStatus('generating');
                setTimeout(async () => {
                    try {
                        const url = await fulfillOrderInvoicing(orderId, 'hidden-invoice-capture');
                        setInvoiceUrl(url);
                        setStatus('complete');
                        toast.success("Invoice synced to cloud!");
                    } catch (err) {
                        console.error("Fulfillment failed:", err);
                        setSyncError(err.message || "Capture/Storage error");
                        setStatus('error');
                    }
                }, 3000);
            } catch (err) {
                console.error("Order fetch failed:", err);
                setStatus('error');
            }
        };

        processFulfillment();
    }, [orderId]);

    const handleManualSync = async () => {
        if (!orderId || status === 'generating') return;
        setStatus('generating');
        try {
            console.log("Retrying manual cloud sync...");
            const url = await fulfillOrderInvoicing(orderId, 'hidden-invoice-capture');
            setInvoiceUrl(url);
            setStatus('complete');
            toast.success("Invoice synced manually!");
        } catch (err) {
            console.error("Manual sync failed:", err);
            setSyncError(err.message);
            setStatus('error');
            toast.error("Cloud storage sync failed.");
        }
    };

    const handleDownload = () => {
        if (invoiceUrl) {
            window.open(invoiceUrl, '_blank');
        } else {
            // Fallback to manual print page if cloud URL is missing
            navigate(`/invoice/${orderId}`);
        }
    };

    return (
        <div className="success-page">
            <Navbar />
            
            {/* Hidden Invoice for Background PDF Capture - Positioned off-screen but visible to the engine */}
            <div 
                id="invoice-capture-container"
                style={{ 
                    position: 'fixed', 
                    left: '-10000px', 
                    top: '0', 
                    width: '794px', // A4 Width in pixels at 96 DPI
                    background: '#fff',
                    zIndex: -1
                }}
            >
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
                            <p className="status-loading">
                                <FaCloudUploadAlt className="spin" /> 
                                Generating professional GST invoice...
                            </p>
                        )}
                        {status === 'complete' && (
                            <p className="status-complete">
                                <FaFilePdf /> 
                                Government-ready invoice is secured in your account.
                            </p>
                        )}
                        {status === 'error' && (
                            <div className="status-error-group">
                                <p className="status-error">Note: Cloud sync issue ({syncError || 'timeout'}).</p>
                                <button className="retry-sync-link" onClick={handleManualSync}>
                                    Try Syncing Again
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="success-msg">
                        Thank you for shopping with VisionCart! Your eyewear is being processed 
                        and will be shipped shortly. You can now download your official Tax Invoice.
                    </p>
                    
                    <div className="success-actions">
                        <button className="view-orders-btn" onClick={() => navigate('/profile')}>
                            <FaShoppingBag /> My Orders
                        </button>
                        
                        <button 
                            className={`invoice-btn-luxury ${status === 'complete' ? 'success' : ''}`} 
                            onClick={handleDownload}
                        >
                            {status === 'generating' ? (
                                <><span className="mini-loader"></span> Processing...</>
                            ) : (
                                <><FaPrint /> {status === 'complete' ? 'Download PDF Invoice' : 'View & Print Invoice'}</>
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
