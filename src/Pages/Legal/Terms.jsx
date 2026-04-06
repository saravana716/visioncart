import React from 'react';
import LegalPage from './LegalPage';

const Terms = () => {
    const content = [
        {
            heading: "1. General",
            text: "VisionKart provides eyewear products, including spectacles, sunglasses, and optical accessories. All services are subject to availability."
        },
        {
            heading: "2. Product Information",
            text: "We strive to ensure that all product descriptions, images, and prices are accurate. However:",
            list: [
                "Slight variations may occur due to lighting or display differences",
                "Prices are subject to change without prior notice"
            ]
        },
        {
            heading: "3. Orders & Payments",
            list: [
                "Orders are confirmed only after successful payment",
                "We reserve the right to cancel or refuse any order due to stock issues or pricing errors",
                "Payment must be made through approved payment methods"
            ]
        },
        {
            heading: "4. User Responsibilities",
            text: "Users must:",
            list: [
                "Provide accurate personal and contact details",
                "Not misuse the website or engage in fraudulent activities"
            ]
        },
        {
            heading: "5. Intellectual Property",
            text: "All content on this website (logo, images, text, design) belongs to VisionKart Opticals and cannot be used without permission."
        },
        {
            heading: "6. Limitation of Liability",
            text: "VisionKart Opticals is not responsible for:",
            list: [
                "Any indirect or incidental damages",
                "Delays caused by logistics or third-party services"
            ]
        },
        {
            heading: "7. Changes to Terms",
            text: "We may update these terms at any time without prior notice."
        },
        {
            heading: "8. Contact Us",
            text: "For any queries, contact us via phone or email listed on our website."
        }
    ];

    return <LegalPage title="Terms & Conditions" content={content} />;
};

export default Terms;
