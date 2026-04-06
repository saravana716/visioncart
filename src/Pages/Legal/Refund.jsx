import React from 'react';
import LegalPage from './LegalPage';

const Refund = () => {
    const content = [
        {
            heading: "1. Return Eligibility",
            text: "Products can be returned if:",
            list: [
                "Item is damaged or defective",
                "Wrong product was delivered",
                "Returns must be requested within 3–5 days of delivery."
            ]
        },
        {
            heading: "2. Non-Returnable Items",
            list: [
                "Customized lenses or prescription glasses",
                "Used or damaged products (not due to delivery issues)"
            ]
        },
        {
            heading: "3. Refund Process",
            list: [
                "Once the product is received and inspected, refunds will be processed",
                "Refunds will be credited to the original payment method within 5–7 business days"
            ]
        },
        {
            heading: "4. Exchange Policy",
            list: [
                "Exchanges are allowed for defective or incorrect products",
                "Subject to stock availability"
            ]
        },
        {
            heading: "5. Shipping Charges",
            list: [
                "Return shipping charges may apply unless the issue is from our side"
            ]
        },
        {
            heading: "6. Cancellation Policy",
            list: [
                "Orders can be canceled before dispatch",
                "No cancellation allowed after shipping"
            ]
        },
        {
            heading: "7. Contact Us",
            text: "For returns/refunds, contact our support team with order details."
        }
    ];

    return <LegalPage title="Refund & Return Policy" content={content} />;
};

export default Refund;
