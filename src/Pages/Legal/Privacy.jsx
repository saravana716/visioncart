import React from 'react';
import LegalPage from './LegalPage';

const Privacy = () => {
    const content = [
        {
            heading: "1. Information We Collect",
            text: "We may collect:",
            list: [
                "Name, phone number, email address",
                "Shipping and billing address",
                "Payment details (secured via third-party gateways)"
            ]
        },
        {
            heading: "2. How We Use Your Information",
            text: "Your data is used to:",
            list: [
                "Process orders and deliver products",
                "Improve customer experience",
                "Send updates, offers, and service-related communication"
            ]
        },
        {
            heading: "3. Data Protection",
            text: "We implement secure systems to protect your data. However, no online transmission is 100% secure."
        },
        {
            heading: "4. Sharing of Information",
            text: "We do not sell your personal data. Information may be shared with:",
            list: [
                "Delivery partners",
                "Payment processors",
                "Legal authorities, if required"
            ]
        },
        {
            heading: "5. Cookies",
            text: "Our website may use cookies to enhance user experience and track usage patterns."
        },
        {
            heading: "6. Your Rights",
            text: "You can:",
            list: [
                "Request access to your data",
                "Ask for corrections or deletion",
                "Opt out of marketing communication"
            ]
        },
        {
            heading: "7. Updates to Policy",
            text: "We may update this policy periodically."
        },
        {
            heading: "8. Contact Us",
            text: "For privacy-related concerns, contact VisionKart directly."
        }
    ];

    return <LegalPage title="Privacy Policy" content={content} />;
};

export default Privacy;
