import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/firestoreService';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';
import './Invoice.css';
import Loader from '../Components/Loader/Loader';
import logo from '../assets/vision_cart_logo.png';

import InvoiceDocument from '../Components/InvoiceDocument';

const Invoice = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const demoOrder = {
        id: "VC-88291044",
        createdAt: { toDate: () => new Date() },
        shippingAddress: {
            fullName: "Mr. Sunil Kumar",
            phone: "+91 98765 43210",
            address: "House No. 45, Residency Road, Shanthala Nagar",
            city: "Bangalore",
            zip: "560025",
            state: "Karnataka",
            stateCode: "29"
        },
        items: [
            {
                productName: "Supreme Titanium XL Frame",
                productBrand: "VisionKart Premium",
                lensType: "Progressive Blue Shield",
                material: "Titanium / High-Index 1.74",
                totalPrice: "₹12,500"
            },
            {
                productName: "Signature Case & Cleaning Kit",
                productBrand: "VisionKart",
                lensType: "Accessories",
                material: "Genuine Leather / Microfiber",
                totalPrice: "₹1,499"
            }
        ],
        amounts: {
            subtotal: 13999,
            tax: 2519.82,
            total: 16518.82
        },
        paymentMethod: "Credit Card (CCAvenue)"
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
                <button className="print-btn-corporate" onClick={handlePrint}><FaPrint /> Print / Save as PDF</button>
            </div>

            <InvoiceDocument order={order} id="invoice-capture-area" />
        </div>
    );
};

export default Invoice;
