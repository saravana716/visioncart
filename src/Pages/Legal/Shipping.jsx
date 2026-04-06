import React from 'react';
import LegalPage from './LegalPage';

const Shipping = () => {
    const content = [
        {
            heading: "1. Delivery Timeline",
            text: "We strive to deliver your products as quickly as possible.",
            list: [
                "Standard Delivery: 3–7 working days across India.",
                "Customized Prescription Lenses: May take an additional 2-3 working days for processing."
            ]
        },
        {
            heading: "2. Shipping Charges",
            text: "VisionKart offers competitive shipping rates:",
            list: [
                "Free shipping on orders above ₹999.",
                "A flat shipping fee of ₹50 applies to orders below ₹999."
            ]
        },
        {
            heading: "3. Service Areas",
            text: "We currently ship to all major cities and towns across India. If your location is in a remote area, delivery might take slightly longer."
        },
        {
            heading: "4. Tracking Your Order",
            text: "Once your order is dispatched, you will receive a tracking link via email and SMS to monitor your delivery progress in real-time."
        },
        {
            heading: "5. Delay Disclaimer",
            text: "While we aim for timely delivery, delays may occur due to logistics issues, extreme weather conditions, or public holidays. We appreciate your patience in such cases."
        },
        {
            heading: "6. Damages During Transit",
            text: "If you receive a package that is visibly damaged, please do not accept the delivery and contact our support team immediately."
        }
    ];

    return <LegalPage title="Shipping & Delivery Policy" content={content} />;
};

export default Shipping;
