import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { 
    placeOrder, 
    clearUserCart, 
    decrementStock, 
    getUserAddresses 
} from '../services/firestoreService';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { 
    FaShippingFast, 
    FaCreditCard, 
    FaCheckCircle, 
    FaMapMarkerAlt, 
    FaTicketAlt, 
    FaShoppingBag, 
    FaShieldAlt,
    FaCloudUploadAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader/Loader';
import { fulfillOrderInvoicing } from '../services/fulfillmentService';
import InvoiceDocument from '../Components/InvoiceDocument';
import './Checkout.css';
import qrScannerImg from '../assets/qrscanner.jpeg';

const Checkout = () => {
    const { cartItems, cartCount, clearCart } = useCart();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // Default to QR workaround
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isFulfilling, setIsFulfilling] = useState(false);
    const [capturedOrder, setCapturedOrder] = useState(null);
    const [captureId, setCaptureId] = useState(null);
    const navigate = useNavigate();

    const [billingForm, setBillingForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        state: 'Tamil Nadu'
    });

    const [shippingForm, setShippingForm] = useState({
        fullName: '',
        address: '',
        city: '',
        zip: '',
        state: 'Tamil Nadu'
    });

    const [shipToDifferent, setShipToDifferent] = useState(false);
    const [errors, setErrors] = useState({});
    const [shippingErrors, setShippingErrors] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setBillingForm(prev => ({ 
                    ...prev, 
                    email: currentUser.email || '', 
                    phone: currentUser.phoneNumber || '' 
                }));
                // Fetch saved addresses
                const addresses = await getUserAddresses(currentUser.uid);
                setSavedAddresses(addresses);
                if (addresses.length > 0) {
                    setShowSavedAddresses(true);
                }
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const validateCheckoutForms = () => {
        const newErrors = {};
        const newShippingErrors = {};
        
        // Billing Validation
        if (!billingForm.fullName.trim()) newErrors.fullName = "Name required";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!billingForm.email.trim()) {
            newErrors.email = "Email required";
        } else if (!emailRegex.test(billingForm.email)) {
            newErrors.email = "Invalid format";
        }

        if (!billingForm.phone.trim()) {
            newErrors.phone = "Phone required";
        } else if (!/^\d{10}$/.test(billingForm.phone)) {
            newErrors.phone = "10 digits";
        }

        if (!billingForm.address.trim()) newErrors.address = "Required";
        if (!billingForm.city.trim()) newErrors.city = "Required";
        if (!billingForm.zip.trim()) newErrors.zip = "Required";

        // Shipping Validation (if different)
        if (shipToDifferent) {
            if (!shippingForm.fullName.trim()) newShippingErrors.fullName = "Name required";
            if (!shippingForm.address.trim()) newShippingErrors.address = "Required";
            if (!shippingForm.city.trim()) newShippingErrors.city = "Required";
            if (!shippingForm.zip.trim()) newShippingErrors.zip = "Required";
        }

        setErrors(newErrors);
        setShippingErrors(newShippingErrors);
        return Object.keys(newErrors).length === 0 && Object.keys(newShippingErrors).length === 0;
    };

    const calculateTotal = () => {
        let rawSubtotal = 0;
        
        // Calculate raw subtotal (Base Price)
        cartItems.forEach(item => {
            rawSubtotal += parseInt(item.totalPrice?.toString().replace(/[^0-9]/g, '') || '0');
        });

        // 1. Calculate Discount on Base Price
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discountType === 'percentage') {
                discount = Math.round(rawSubtotal * (appliedCoupon.discountValue / 100));
            } else {
                discount = appliedCoupon.discountValue;
            }
        }

        const discountedSubtotal = rawSubtotal - discount;
        const discountFactor = rawSubtotal > 0 ? discountedSubtotal / rawSubtotal : 1;

        let totalTax = 0;
        const currentShippingAddress = shipToDifferent ? shippingForm : billingForm;
        let isIntraState = currentShippingAddress.state?.toLowerCase() === 'tamil nadu';

        const itemBreakdown = cartItems.map(item => {
            const originalPrice = parseInt(item.totalPrice?.toString().replace(/[^0-9]/g, '') || '0');
            const discountedPrice = originalPrice * discountFactor;
            
            // PROFESSIONAL GST RATES: Sunglasses 18%, Others (Spectacles/Lenses) 12%
            const rate = (item.category === 'Sunglasses') ? 0.18 : 0.12;
            
            // EXCLUSIVE GST CALCULATION (Price + Tax)
            const taxableValue = discountedPrice;
            const gstAmount = taxableValue * rate;

            totalTax += gstAmount;

            return {
                ...item,
                taxableValue,
                gstAmount,
                gstRate: rate * 100
            };
        });

        const totalTaxRounded = Math.round(totalTax);
        const cgst = isIntraState ? Math.floor(totalTaxRounded / 2) : 0;
        const sgst = isIntraState ? (totalTaxRounded - cgst) : 0;
        const igst = isIntraState ? 0 : totalTaxRounded;

        // Grand Total = Taxable Subtotal + Taxes (Exclusive Model)
        const finalGrandTotal = discountedSubtotal + totalTaxRounded;

        return { 
            subtotal: Math.round(discountedSubtotal), 
            rawSubtotal: Math.round(rawSubtotal),
            discount: Math.round(discount),
            tax: totalTaxRounded, 
            total: Math.round(finalGrandTotal),
            taxDetails: {
                cgst: cgst,
                sgst: sgst,
                igst: igst,
                isIntraState
            },
            itemBreakdown
        };
    };

    const { subtotal, rawSubtotal, discount, tax, total, taxDetails } = calculateTotal();

    const handleApplyCoupon = async () => {
        if (!couponInput) return;
        setLoading(true);
        try {
            const { getCoupon } = await import('../services/firestoreService');
            const coupon = await getCoupon(couponInput);
            
            if (coupon) {
                const today = new Date();
                const expiry = new Date(coupon.expiryDate);
                // Set time to end of day for comparison
                expiry.setHours(23, 59, 59, 999);

                if (!coupon.active) {
                    toast.error("This coupon is no longer active.");
                } else if (expiry < today) {
                    toast.error("This coupon has expired.");
                } else if (rawSubtotal < coupon.minOrderAmount) {
                    toast.error(`Minimum order of ₹${coupon.minOrderAmount} required.`);
                } else {
                    setAppliedCoupon(coupon);
                    toast.success(`Coupon applied: ${coupon.code}!`);
                }
            } else {
                toast.error("Invalid coupon code.");
            }
        } catch (error) {
            console.error("Coupon error:", error);
            toast.error("Failed to apply coupon.");
        }
        setLoading(false);
    };

    const handleInputChange = (e, targetForm = 'billing') => {
        const { name, value } = e.target;
        if (targetForm === 'billing') {
            setBillingForm(prev => ({ ...prev, [name]: value }));
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        } else {
            setShippingForm(prev => ({ ...prev, [name]: value }));
            if (shippingErrors[name]) setShippingErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSelectAddress = (addr) => {
        const mappedAddr = {
            fullName: addr.name || '',
            email: user?.email || '',
            phone: addr.phone || '',
            address: addr.address || '',
            city: addr.city || '',
            zip: addr.pincode || '',
            state: addr.state || 'Tamil Nadu'
        };
        setBillingForm(mappedAddr);
        setShippingForm({
            fullName: addr.name || '',
            address: addr.address || '',
            city: addr.city || '',
            zip: addr.pincode || '',
            state: addr.state || 'Tamil Nadu'
        });
        setShowSavedAddresses(false);
    };

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'ccavenue') {
            await handleCCAvenuePayment();
        } else if (paymentMethod === 'upi_qr') {
            await handleQRPayment();
        } else {
            await handleSimulatedPayment();
        }
    };

    const handleQRPayment = async () => {
        if (!validateCheckoutForms()) {
            toast.error("Please fill all required address fields correctly");
            return;
        }

        setLoading(true);
        const orderData = {
            items: cartItems,
            billingAddress: billingForm,
            shippingAddress: shipToDifferent ? shippingForm : billingForm,
            paymentMethod: 'UPI QR Code',
            amounts: { subtotal, rawSubtotal, discount, tax, total, taxDetails },
            appliedCoupon: appliedCoupon ? {
                code: appliedCoupon.code,
                discountValue: appliedCoupon.discountValue,
                discountType: appliedCoupon.discountType
            } : null,
            userId: user.uid,
            status: 'Awaiting Verification'
        };

        const result = await placeOrder(user.uid, orderData);
        if (result.success) {
            // Decrement stock
            for (const item of cartItems) {
                if (item.productId) {
                    await decrementStock(item.productId, 1);
                }
            }
            await clearUserCart(user.uid);
            
            // PREPARE FOR CLOUD SYNC
            const finalOrder = { ...orderData, id: result.id, createdAt: new Date() };
            setCapturedOrder(finalOrder);
            setCaptureId(result.id);
            setIsFulfilling(true);

            toast.success("Order Placed! Securing your invoice...");
            
            // Trigger background sync while showing loader (Reduced delay for speed)
            setTimeout(async () => {
                try {
                    await fulfillOrderInvoicing(result.id, 'checkout-capture-area');
                    clearCart();
                    navigate('/orders');
                } catch (err) {
                    console.error("Fulfillment failed in checkout:", err);
                    clearCart();
                    navigate('/orders');
                }
                setIsFulfilling(false);
            }, 1500);
        } else {
            setLoading(false);
        }
    };

    const handleCCAvenuePayment = async () => {
        setLoading(true);
        try {
            const apiBase = "http://localhost:3000"; // Backend URL
            const payload = {
                amount: total.toString(),
                currency: 'INR',
                customer_name: billingForm.fullName,
                email: billingForm.email,
                phone: billingForm.phone,
                address: {
                    billing_address: billingForm.address,
                    billing_city: billingForm.city,
                    billing_zip: billingForm.zip,
                    billing_state: billingForm.state
                }
            };

            const response = await fetch(`${apiBase}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to initialize payment");
            }

            const data = await response.json();

            // Create a hidden form and submit it to CCAvenue
            const mapForm = document.createElement("form");
            mapForm.target = "_self";
            mapForm.method = "POST";
            mapForm.action = data.ccavenue_url;

            const merchantIdInput = document.createElement("input");
            merchantIdInput.type = "hidden";
            merchantIdInput.name = "merchant_id";
            merchantIdInput.value = data.merchant_id;
            mapForm.appendChild(merchantIdInput);

            const accessCodeInput = document.createElement("input");
            accessCodeInput.type = "hidden";
            accessCodeInput.name = "access_code";
            accessCodeInput.value = data.access_code;
            mapForm.appendChild(accessCodeInput);

            const encRequestInput = document.createElement("input");
            encRequestInput.type = "hidden";
            encRequestInput.name = "encRequest";
            encRequestInput.value = data.encRequest;
            mapForm.appendChild(encRequestInput);

            document.body.appendChild(mapForm);
            mapForm.submit();

        } catch (error) {
            console.error("CCAvenue Error:", error);
            toast.error("Payment initialization failed. Please try again.");
            setLoading(false);
        }
    };

    const handleSimulatedPayment = async () => {
        if (!validateCheckoutForms()) {
            toast.error("Please fill all required address fields correctly");
            return;
        }

        setLoading(true);
        const orderData = {
            items: cartItems,
            billingAddress: billingForm,
            shippingAddress: shipToDifferent ? shippingForm : billingForm,
            paymentMethod: 'Prepaid (Simulated)',
            amounts: { subtotal, rawSubtotal, discount, tax, total, taxDetails },
            appliedCoupon: appliedCoupon ? {
                code: appliedCoupon.code,
                discountValue: appliedCoupon.discountValue,
                discountType: appliedCoupon.discountType
            } : null,
            userId: user.uid,
            status: 'Ordered'
        };

        const result = await placeOrder(user.uid, orderData);
        if (result.success) {
            for (const item of cartItems) {
                if (item.productId) {
                    await decrementStock(item.productId, 1);
                }
            }
            await clearUserCart(user.uid);
            
            // PREPARE FOR CLOUD SYNC
            const finalOrder = { ...orderData, id: result.id, createdAt: new Date() };
            setCapturedOrder(finalOrder);
            setCaptureId(result.id);
            setIsFulfilling(true);

            toast.success("Order Confirmed! Securing your invoice...");

            // Trigger background sync while showing loader (Reduced delay for speed)
            setTimeout(async () => {
                try {
                    await fulfillOrderInvoicing(result.id, 'checkout-capture-area');
                    clearCart();
                    navigate('/orders');
                } catch (err) {
                    console.error("Fulfillment failed in checkout:", err);
                    clearCart();
                    navigate('/orders');
                }
                setIsFulfilling(false);
            }, 1500);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        // PERMANENT GUARD: If we have a captured order, NEVER redirect to cart from this page
        if (cartCount === 0 && step !== 3 && !isFulfilling && !capturedOrder) {
            navigate('/cart');
        }
    }, [cartCount, step, navigate, isFulfilling, capturedOrder]);

    useEffect(() => {
        if (loading) return;

        // Intersection Observer for Scroll Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [step, loading]);

    if (cartCount === 0 && step !== 3 && !isFulfilling && !capturedOrder) {
        return null;
    }

    if (isFulfilling) {
        return (
            <div className="fulfillment-overlay">
                <Navbar />
                <div className="fulfillment-loader-card">
                    <FaCloudUploadAlt className="fulfillment-sync-icon spin" />
                    <h2>Payment Confirmed!</h2>
                    <p>We are securing your professional Tax Invoice and archiving it to the cloud...</p>
                    <div className="fulfillment-progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                </div>
                {capturedOrder && (
                    <div className="hidden-capture-wrapper" style={{ position: 'fixed', left: '-5000px', top: 0, visibility: 'visible' }}>
                        <InvoiceDocument order={capturedOrder} id="checkout-capture-area" />
                    </div>
                )}
                <Footers />
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <Navbar />
            <div className="checkout-container">
                <div className="checkout-steps">
                    <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-count">1</div>
                        <span>Shipping</span>
                    </div>
                    <div className={`step-divider ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-count">2</div>
                        <span>Payment</span>
                    </div>
                    <div className={`step-divider ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-count">3</div>
                        <span>Complete</span>
                    </div>
                </div>

                <div className="checkout-content-grid scroll-reveal">
                    <div className="checkout-main">
                        {step === 1 && (
                            <div className="checkout-section fade-in">
                                <h2><FaShippingFast /> Shipping Details</h2>
                                
                                {savedAddresses.length > 0 && (
                                    <div className="saved-addresses-selector">
                                        <div className="selector-header">
                                            <h3><FaMapMarkerAlt /> Use a Saved Address</h3>
                                            <button 
                                                className="toggle-selector-btn"
                                                onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                                            >
                                                {showSavedAddresses ? 'Hide' : 'Show Saved'}
                                            </button>
                                        </div>
                                        
                                        {showSavedAddresses && (
                                            <div className="address-options-grid">
                                                {savedAddresses.map(addr => (
                                                    <div 
                                                        key={addr.id} 
                                                        className="address-option-card"
                                                        onClick={() => handleSelectAddress(addr)}
                                                    >
                                                        <div className="addr-tag">{addr.type}</div>
                                                        <strong>{addr.name}</strong>
                                                        <p>{addr.address}</p>
                                                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                        <span className="use-this-text">Use this address</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="checkout-form">
                                    <div className="form-row">
                                        <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
                                            <label>Full Name</label>
                                            <input type="text" name="fullName" value={billingForm.fullName} onChange={handleInputChange} placeholder="Cardholder/Legal Name" />
                                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                        </div>
                                        <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                                            <label>Phone Number</label>
                                            <input type="text" name="phone" value={billingForm.phone} onChange={handleInputChange} placeholder="10-digit mobile" />
                                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                                        </div>
                                    </div>
                                    <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                                        <label>Email Address</label>
                                        <input type="email" name="email" value={billingForm.email} onChange={handleInputChange} placeholder="For receipt & tracking" />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>
                                    <div className={`form-group ${errors.address ? 'has-error' : ''}`}>
                                        <label>Billing Address</label>
                                        <input type="text" name="address" value={billingForm.address} onChange={handleInputChange} placeholder="House/Flat No, Street Name" />
                                        {errors.address && <span className="error-message">{errors.address}</span>}
                                    </div>
                                    <div className="form-row">
                                        <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
                                            <label>City</label>
                                            <input type="text" name="city" value={billingForm.city} onChange={handleInputChange} />
                                            {errors.city && <span className="error-message">{errors.city}</span>}
                                        </div>
                                        <div className={`form-group ${errors.zip ? 'has-error' : ''}`}>
                                            <label>PIN Code</label>
                                            <input type="text" name="zip" value={billingForm.zip} onChange={handleInputChange} />
                                            {errors.zip && <span className="error-message">{errors.zip}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <select name="state" value={billingForm.state} onChange={handleInputChange}>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="ship-different-toggle">
                                        <label className="checkbox-container">
                                            <input 
                                                type="checkbox" 
                                                checked={shipToDifferent} 
                                                onChange={(e) => setShipToDifferent(e.target.checked)} 
                                            />
                                            <span className="checkmark"></span>
                                            Ship to a different address?
                                        </label>
                                    </div>

                                    {shipToDifferent && (
                                        <div className="shipping-address-fields fade-in">
                                            <h3 className="section-subtitle">Shipping Details</h3>
                                            <div className="form-row">
                                                <div className={`form-group ${shippingErrors.fullName ? 'has-error' : ''}`}>
                                                    <label>Recipient Name</label>
                                                    <input type="text" name="fullName" value={shippingForm.fullName} onChange={(e) => handleInputChange(e, 'shipping')} placeholder="Who is receiving?" />
                                                </div>
                                            </div>
                                            <div className={`form-group ${shippingErrors.address ? 'has-error' : ''}`}>
                                                <label>Shipping Address</label>
                                                <input type="text" name="address" value={shippingForm.address} onChange={(e) => handleInputChange(e, 'shipping')} placeholder="Full delivery address" />
                                            </div>
                                            <div className="form-row">
                                                <div className={`form-group ${shippingErrors.city ? 'has-error' : ''}`}>
                                                    <label>City</label>
                                                    <input type="text" name="city" value={shippingForm.city} onChange={(e) => handleInputChange(e, 'shipping')} />
                                                </div>
                                                <div className={`form-group ${shippingErrors.zip ? 'has-error' : ''}`}>
                                                    <label>PIN Code</label>
                                                    <input type="text" name="zip" value={shippingForm.zip} onChange={(e) => handleInputChange(e, 'shipping')} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>State</label>
                                                <select name="state" value={shippingForm.state} onChange={(e) => handleInputChange(e, 'shipping')}>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                    <option value="Delhi">Delhi</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <button className="checkout-next-btn" onClick={() => {
                                        if (validateCheckoutForms()) setStep(2);
                                        else toast.error("Please fill all required fields");
                                    }}>
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="checkout-section fade-in">
                                <h2><FaCreditCard /> Select Payment Method</h2>
                                <div className="payment-options">
                                    <div 
                                        className={`payment-method-card ${paymentMethod === 'upi_qr' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('upi_qr')}
                                    >
                                        <div className="card-selector">
                                            <div className="radio-circle"></div>
                                            <div className="card-info">
                                                <span className="method-name">UPI PhonePe / GPay (Scan QR)</span>
                                                <span className="method-desc">Fast & Secure via any UPI App</span>
                                            </div>
                                        </div>
                                        <div className="method-icon">
                                            <FaCheckCircle style={{color: '#673ab7'}} />
                                        </div>
                                    </div>

                                    <div 
                                        className={`payment-method-card ${paymentMethod === 'ccavenue' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('ccavenue')}
                                    >
                                        <div className="card-selector">
                                            <div className="radio-circle"></div>
                                            <div className="card-info">
                                                <span className="method-name">CCAvenue Secure Payment</span>
                                                <span className="method-desc">Credit/Debit Cards, NetBanking</span>
                                            </div>
                                        </div>
                                        <div className="method-icon">
                                            <FaCreditCard />
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'upi_qr' && (
                                    <div className="qr-payment-container fade-in">
                                        <div className="qr-instructions">
                                            <h3>Scan this QR to Pay ₹{total.toLocaleString()}</h3>
                                            <p>Scan with PhonePe, Google Pay, PayTM or any UPI app</p>
                                        </div>
                                        <div className="qr-image-wrapper">
                                            <img src={qrScannerImg} alt="Payment QR Code" className="payment-qr-image" />
                                            <div className="qr-scan-badge">Scan & Pay</div>
                                        </div>
                                    </div>
                                )}

                                <div className="checkout-btns">
                                    <button className="checkout-back-btn" onClick={() => setStep(1)}>Back</button>
                                    <button className="checkout-place-btn" onClick={handlePlaceOrder} disabled={loading}>
                                        {loading ? 'Processing...' : paymentMethod === 'upi_qr' ? 'Confirm Order' : `Pay ₹${total.toLocaleString()}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-sidebar">
                        <div className="premium-sidebar-card coupon-luxury-section">
                            <div className="card-header-with-icon">
                                <FaTicketAlt className="header-icon" />
                                <h3>Apply Coupon</h3>
                            </div>
                            <div className="coupon-input-wrapper">
                                <div className="input-with-button">
                                    <input 
                                        type="text" 
                                        placeholder="Enter promo code" 
                                        value={couponInput}
                                        onInput={(e) => setCouponInput(e.target.value.toUpperCase())}
                                        disabled={appliedCoupon}
                                        className={appliedCoupon ? 'input-locked' : ''}
                                    />
                                    <button 
                                        onClick={handleApplyCoupon}
                                        disabled={!couponInput || appliedCoupon || loading}
                                        className={`premium-apply-btn ${appliedCoupon ? 'btn-success-locked' : ''}`}
                                    >
                                        {appliedCoupon ? <><FaCheckCircle /> Applied</> : 'Apply'}
                                    </button>
                                </div>
                                {appliedCoupon && (
                                    <div className="luxury-coupon-badge fade-in">
                                        <div className="badge-content">
                                            <span className="dot-pulse"></span>
                                            <span className="code-text">{appliedCoupon.code}</span>
                                            <span className="discount-pill">-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`}</span>
                                        </div>
                                        <button className="remove-coupon-btn" onClick={() => setAppliedCoupon(null)} title="Remove Coupon">
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="premium-sidebar-card summary-luxury-section">
                            <div className="card-header-with-icon">
                                <FaShoppingBag className="header-icon" />
                                <h3>Order Summary</h3>
                            </div>
                            
                            <div className="summary-scroll-area">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item-premium">
                                        <div className="item-preview">
                                            <img src={item.productImage} alt="" />
                                            <span className="item-qty">1</span>
                                        </div>
                                        <div className="item-details-premium">
                                            <p className="item-name">{item.productName}</p>
                                            <p className="item-config">
                                                {item.lensType || 'Frame Only'} 
                                                {item.material && ` | ${item.material}`}
                                                {item.productSize && ` | ${item.productSize}`}
                                            </p>
                                        </div>
                                        <div className="item-price-premium">
                                            {item.totalPrice}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pricing-master-breakdown">
                                <div className="pricing-segment">
                                    <div className="pricing-row-lux">
                                        <span className="label">Retail Price (Base)</span> 
                                        <span className="value">₹{rawSubtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div className="pricing-row-lux discount-row">
                                            <span className="label">Promotional Discount</span> 
                                            <span className="value">-₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pricing-segment tax-segment">
                                    <div className="pricing-row-lux subtotal-line">
                                        <span className="label">Net Subtotal</span> 
                                        <span className="value">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="pricing-row-lux tax-detail">
                                        <span className="label">Applicable GST</span> 
                                        <span className="value">₹{tax.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="pricing-row-lux">
                                        <span className="label">Secure Shipping</span> 
                                        <span className="value shipping-free">FREE</span>
                                    </div>
                                </div>

                                <div className="grand-total-section">
                                    <div className="total-main-row">
                                        <div className="total-label-wrapper">
                                            <span className="grand-total-label">Grand Total</span>
                                            <span className="tax-inclusive-tag">Taxes added on price</span>
                                        </div>
                                        <div className="total-value-wrapper">
                                            <span className="currency">₹</span>
                                            <span className="amount">{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {/* <div className="secure-checkout-badge">
                                        <FaShieldAlt /> 256-bit SSL Secured Transaction
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footers />
        </div>
    );
};

export default Checkout;
