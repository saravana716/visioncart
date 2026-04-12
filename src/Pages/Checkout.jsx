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
import { FaShippingFast, FaCreditCard, FaCheckCircle, FaMapMarkerAlt, FaTicketAlt, FaShoppingBag, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader/Loader';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartCount, clearCart } = useCart();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('ccavenue');
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        state: 'Tamil Nadu'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setForm(prev => ({ 
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

    const validateShippingForm = () => {
        const newErrors = {};
        
        if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(form.phone)) {
            newErrors.phone = "Must be a 10-digit number";
        }

        if (!form.address.trim()) newErrors.address = "Street address is required";
        if (!form.city.trim()) newErrors.city = "City is required";
        
        if (!form.zip.trim()) {
            newErrors.zip = "ZIP code is required";
        } else if (!/^\d{6}$/.test(form.zip)) {
            newErrors.zip = "Must be a 6-digit PIN code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotal = () => {
        let rawSubtotal = 0;
        
        // First calculate the raw subtotal from items
        cartItems.forEach(item => {
            rawSubtotal += parseInt(item.totalPrice?.toString().replace(/[^0-9]/g, '') || '0');
        });

        // 1. Calculate Discount
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discountType === 'percentage') {
                discount = Math.round(rawSubtotal * (appliedCoupon.discountValue / 100));
            } else {
                discount = appliedCoupon.discountValue;
            }
        }

        // 2. Distribute discount and calculate GST on discounted values
        const discountedSubtotal = rawSubtotal - discount;
        const discountFactor = discountedSubtotal / rawSubtotal;

        let totalTax = 0;
        let isIntraState = form.state?.toLowerCase() === 'karnataka';

        const itemBreakdown = cartItems.map(item => {
            const originalPrice = parseInt(item.totalPrice?.toString().replace(/[^0-9]/g, '') || '0');
            const discountedPrice = originalPrice * discountFactor;
            
            const rate = (item.category === 'Sunglasses') ? 0.18 : 0.12;
            const taxableValue = discountedPrice / (1 + rate);
            const gstAmount = discountedPrice - taxableValue;

            totalTax += gstAmount;

            return {
                ...item,
                taxableValue,
                gstAmount,
                gstRate: rate * 100
            };
        });

        const cgst = isIntraState ? totalTax / 2 : 0;
        const sgst = isIntraState ? totalTax / 2 : 0;
        const igst = isIntraState ? 0 : totalTax;

        return { 
            subtotal: Math.round(discountedSubtotal), 
            rawSubtotal: Math.round(rawSubtotal),
            discount: Math.round(discount),
            tax: Math.round(totalTax), 
            total: Math.round(discountedSubtotal + totalTax),
            taxDetails: {
                cgst: Math.round(cgst),
                sgst: Math.round(sgst),
                igst: Math.round(igst),
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSelectAddress = (addr) => {
        setForm({
            fullName: addr.name || '',
            email: user?.email || '',
            phone: addr.phone || '',
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
        } else {
            await handleSimulatedPayment();
        }
    };

    const handleCCAvenuePayment = async () => {
        setLoading(true);
        try {
            const apiBase = "http://localhost:3000"; // Backend URL
            const payload = {
                amount: total.toString(),
                currency: 'INR',
                customer_name: form.fullName,
                email: form.email,
                phone: form.phone,
                address: {
                    billing_address: form.address,
                    billing_city: form.city,
                    billing_zip: form.zip,
                    billing_state: form.state
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
        setLoading(true);
        const orderData = {
            items: cartItems,
            shippingAddress: form,
            paymentMethod: 'Prepaid (Simulated)',
            amounts: { subtotal, rawSubtotal, discount, tax, total, taxDetails },
            appliedCoupon: appliedCoupon ? {
                code: appliedCoupon.code,
                discountValue: appliedCoupon.discountValue,
                discountType: appliedCoupon.discountType
            } : null,
            userId: user.uid,
            status: 'Processing'
        };

        const result = await placeOrder(user.uid, orderData);
        if (result.success) {
            toast.success("Order placed successfully!");
            for (const item of cartItems) {
                if (item.productId) {
                    await decrementStock(item.productId, 1);
                }
            }
            await clearUserCart(user.uid);
            clearCart();
            navigate('/order-success', { state: { orderId: result.id } });
        }
        setLoading(false);
    };

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

    if (cartCount === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    if (loading) return <Loader fullPage={true} />;

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
                                    <div className={`form-group full ${errors.fullName ? 'has-error' : ''}`}>
                                        <label>Full Name</label>
                                        <input type="text" name="fullName" value={form.fullName} onChange={handleInputChange} placeholder="John Doe" />
                                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                    </div>
                                    <div className="form-row">
                                        <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                                            <label>Email Address</label>
                                            <input type="email" name="email" value={form.email} onChange={handleInputChange} />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                                            <label>Phone Number</label>
                                            <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} />
                                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                                        </div>
                                    </div>
                                    <div className={`form-group full ${errors.address ? 'has-error' : ''}`}>
                                        <label>Street Address</label>
                                        <input type="text" name="address" value={form.address} onChange={handleInputChange} placeholder="House No, Street, Landmark" />
                                        {errors.address && <span className="error-message">{errors.address}</span>}
                                    </div>
                                    <div className="form-row">
                                        <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
                                            <label>City</label>
                                            <input type="text" name="city" value={form.city} onChange={handleInputChange} />
                                            {errors.city && <span className="error-message">{errors.city}</span>}
                                        </div>
                                        <div className={`form-group ${errors.zip ? 'has-error' : ''}`}>
                                            <label>ZIP/Postal Code</label>
                                            <input type="text" name="zip" value={form.zip} onChange={handleInputChange} />
                                            {errors.zip && <span className="error-message">{errors.zip}</span>}
                                        </div>
                                    </div>
                                    <button className="checkout-next-btn" onClick={() => {
                                        if (validateShippingForm()) {
                                            setStep(2);
                                        } else {
                                            toast.error("Please fix the errors in the form.");
                                        }
                                    }}>Continue to Payment</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="checkout-section fade-in">
                                <h2><FaCreditCard /> Select Payment Method</h2>
                                <div className="payment-options">
                                    <div 
                                        className={`payment-method-card ${paymentMethod === 'ccavenue' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('ccavenue')}
                                    >
                                        <div className="card-selector">
                                            <div className="radio-circle"></div>
                                            <div className="card-info">
                                                <span className="method-name">CCAvenue Secure Payment</span>
                                                <span className="method-desc">Credit/Debit Cards, UPI, NetBanking</span>
                                            </div>
                                        </div>
                                        <div className="method-icon">
                                            <FaCreditCard />
                                        </div>
                                    </div>

                                    <div 
                                        className={`payment-method-card ${paymentMethod === 'simulated' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('simulated')}
                                    >
                                        <div className="card-selector">
                                            <div className="radio-circle"></div>
                                            <div className="card-info">
                                                <span className="method-name">Simulated Payment (Test)</span>
                                                <span className="method-desc">No real money will be deducted</span>
                                            </div>
                                        </div>
                                        <div className="method-icon">
                                            <FaCheckCircle />
                                        </div>
                                    </div>
                                </div>

                                <div className="checkout-btns">
                                    <button className="checkout-back-btn" onClick={() => setStep(1)}>Back</button>
                                    <button className="checkout-place-btn" onClick={handlePlaceOrder} disabled={loading}>
                                        {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
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
                                            <p className="item-config">{item.lensType || 'Frame Only'} | {item.productSize || 'Medium'}</p>
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
                                        <span className="label">Retail Price (Total)</span> 
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
                                        <span className="label">Taxable Subtotal</span> 
                                        <span className="value">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    {taxDetails.isIntraState ? (
                                        <>
                                            <div className="pricing-row-lux tax-detail">
                                                <span className="label">Central GST (CGST)</span> 
                                                <span className="value">₹{taxDetails.cgst.toLocaleString()}</span>
                                            </div>
                                            <div className="pricing-row-lux tax-detail">
                                                <span className="label">State GST (SGST)</span> 
                                                <span className="value">₹{taxDetails.sgst.toLocaleString()}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="pricing-row-lux tax-detail">
                                            <span className="label">Integrated GST (IGST)</span> 
                                            <span className="value">₹{taxDetails.igst.toLocaleString()}</span>
                                        </div>
                                    )}
                                    
                                    <div className="pricing-row-lux">
                                        <span className="label">Secure Shipping</span> 
                                        <span className="value shipping-free">FREE</span>
                                    </div>
                                </div>

                                <div className="grand-total-section">
                                    <div className="total-main-row">
                                        <div className="total-label-wrapper">
                                            <span className="grand-total-label">Grand Total</span>
                                            <span className="tax-inclusive-tag">Inclusive of all taxes</span>
                                        </div>
                                        <div className="total-value-wrapper">
                                            <span className="currency">₹</span>
                                            <span className="amount">{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="secure-checkout-badge">
                                        <FaShieldAlt /> 256-bit SSL Secured Transaction
                                    </div>
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
