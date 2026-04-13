import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/firestoreService';
import { FaPrint, FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa';
import './Invoice.css';
import Loader from '../Components/Loader/Loader';
import logo from '../assets/vision_cart_logo.png';
import InvoiceDocument from '../Components/InvoiceDocument';
import { fulfillOrderInvoicing } from '../services/fulfillmentService';
import toast from 'react-hot-toast';

const Invoice = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const demoOrder = {
        id: "VC-DEMO-8829",
        createdAt: { toDate: () => new Date() },
        shippingAddress: {
            fullName: "Demo User",
            phone: "+91 98765 43210",
            address: "123, Test Street",
            city: "Sivakasi",
            zip: "626123",
            state: "Tamil Nadu",
            stateCode: "33"
        },
        items: [
            {
                productName: "Premium Blue Light Blockers",
                productBrand: "VisionKart",
                lensType: "Single Vision",
                totalPrice: "₹2,499"
            }
        ],
        amounts: {
            subtotal: 2231,
            tax: 268,
            total: 2499,
            taxDetails: { cgst: 134, sgst: 134, isIntraState: true }
        },
        paymentMethod: "UPI QR"
    };

    useEffect(() => {
        if (orderId === 'demo') {
            setOrder(demoOrder);
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            const data = await getOrderById(orderId);
            setOrder(data);
            setLoading(false);

            // AUTO-SYNC LOGIC: If invoiceUrl is missing, secure it to the cloud now
            if (data && !data.invoiceUrl && orderId !== 'demo') {
                setIsSyncing(true);
                // Delay sync slightly to ensure the InvoiceDocument is fully rendered in the DOM
                setTimeout(async () => {
                    try {
                        console.log("[Auto-Sync] Securing invoice to cloud storage...");
                        await fulfillOrderInvoicing(orderId, 'invoice-capture-area');
                        setIsSyncing(false);
                        toast.success("Professional Invoice secured in cloud storage!");
                    } catch (err) {
                        console.error("[Auto-Sync] Failed:", err);
                        setIsSyncing(false);
                    }
                }, 3000);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <Loader fullPage={true} />;

    if (!order) {
        return (
            <div className="invoice-not-found">
                <h2>Invoice Error: Order Not Found</h2>
                <button onClick={() => navigate('/')}>Home</button>
            </div>
        );
    }

    return (
        <div className="corporate-invoice-container">
            {/* Action Bar */}
            <div className="invoice-controls no-print">
                <button className="back-link" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>
                
                <div className="sync-status-indicator">
                    {isSyncing ? (
                        <span className="syncing-text"><FaCloudUploadAlt className="spin" /> Securing to Cloud...</span>
                    ) : order.invoiceUrl ? (
                        <span className="synced-text">✓ Cloud Secured</span>
                    ) : null}
                </div>

                <button 
                    className="print-btn-corporate" 
                    onClick={handlePrint}
                    disabled={isSyncing}
                >
                    <FaPrint /> Print / Save as PDF
                </button>
            </div>

            <InvoiceDocument order={order} id="invoice-capture-area" />
        </div>
    );
};

export default Invoice;
