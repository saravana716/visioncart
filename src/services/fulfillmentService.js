import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { storage, db } from '../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Captures a DOM element and generates a professional PDF
 * @param {string} elementId - The ID of the DOM element to capture
 * @param {string} fileName - The name of the resulting PDF file
 * @returns {Promise<Blob>} - Resolves with the PDF Blob
 */
export const generateInvoicePDF = async (elementId, fileName = 'Invoice.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Invoice element not found");

    // Temporarily hide elements with 'no-print' class for a cleaner PDF
    const noPrintElements = element.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.style.display = 'none');

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Restore no-print elements
        noPrintElements.forEach(el => el.style.display = '');

        return pdf.output('blob');
    } catch (error) {
        noPrintElements.forEach(el => el.style.display = '');
        throw error;
    }
};

/**
 * Full Professional Fulfillment Flow: PDF -> Storage -> Firestore
 * @param {string} orderId - The unique ID of the order
 * @param {string} elementId - The ID of the invoice element to capture
 */
export const fulfillOrderInvoicing = async (orderId, elementId) => {
    try {
        console.log(`Starting background fulfillment for Order: ${orderId}...`);
        
        // 1. Generate PDF
        const pdfBlob = await generateInvoicePDF(elementId, `Invoice-${orderId}.pdf`);
        
        // 2. Upload to Firebase Storage
        const storageRef = ref(storage, `invoices/${orderId}.pdf`);
        const snapshot = await uploadBytes(storageRef, pdfBlob, {
            contentType: 'application/pdf'
        });
        
        // 3. Get Download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // 4. Update Firestore Order
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            invoiceUrl: downloadURL,
            fulfillmentStatus: 'Invoice Generated'
        });

        console.log("Fulfillment complete. Invoice URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Fulfillment Flow Error:", error);
        throw error;
    }
};
