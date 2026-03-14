import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { placeOrder, clearUserCart } from '../services/firestoreService';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { FaShippingFast, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartCount, clearCart } = useCart();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setForm(prev => ({ 
                    ...prev, 
                    email: currentUser.email || '', 
                    phone: currentUser.phoneNumber || '' 
                }));
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((acc, item) => {
            const price = parseInt(item.totalPrice?.toString().replace(/[^0-9]/g, '') || '0');
            return acc + price;
        }, 0);
        const tax = Math.round(subtotal * 0.18);
        return { subtotal, tax, total: subtotal + tax };
    };

    const { subtotal, tax, total } = calculateTotal();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        const orderData = {
            items: cartItems,
            shippingAddress: form,
            paymentMethod: 'Prepaid (Simulated)',
            amounts: { subtotal, tax, total },
            userId: user.uid
        };

        const result = await placeOrder(user.uid, orderData);
        if (result.success) {
            await clearUserCart(user.uid);
            clearCart();
            navigate('/order-success', { state: { orderId: result.id } });
        }
        setLoading(false);
    };

    if (cartCount === 0 && step !== 3) {
        navigate('/cart');
        return null;
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
                    <div className="step-divider"></div>
                    <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-count">2</div>
                        <span>Payment</span>
                    </div>
                    <div className="step-divider"></div>
                    <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-count">3</div>
                        <span>Complete</span>
                    </div>
                </div>

                <div className="checkout-content-grid">
                    <div className="checkout-main">
                        {step === 1 && (
                            <div className="checkout-section fade-in">
                                <h2><FaShippingFast /> Shipping Details</h2>
                                <div className="checkout-form">
                                    <div className="form-group full">
                                        <label>Full Name</label>
                                        <input type="text" name="fullName" value={form.fullName} onChange={handleInputChange} placeholder="John Doe" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input type="email" name="email" value={form.email} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="form-group full">
                                        <label>Street Address</label>
                                        <input type="text" name="address" value={form.address} onChange={handleInputChange} placeholder="House No, Street, Landmark" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input type="text" name="city" value={form.city} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>ZIP/Postal Code</label>
                                            <input type="text" name="zip" value={form.zip} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <button className="checkout-next-btn" onClick={() => setStep(2)}>Continue to Payment</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="checkout-section fade-in">
                                <h2><FaCreditCard /> Payment Method</h2>
                                <div className="payment-simulation">
                                    <div className="payment-card active">
                                        <div className="card-top">
                                            <FaCreditCard />
                                            <span>Simulated Payment</span>
                                        </div>
                                        <p>This is a simulated secure payment gateway. No real transaction will occur.</p>
                                        <div className="sim-details">
                                            <div className="sim-row"><span>Order Total:</span> <span>₹{total.toLocaleString()}</span></div>
                                            <div className="sim-row"><span>Status:</span> <span className="secure-text">Ready to Process</span></div>
                                        </div>
                                    </div>
                                    <div className="checkout-btns">
                                        <button className="checkout-back-btn" onClick={() => setStep(1)}>Back</button>
                                        <button className="checkout-place-btn" onClick={handlePlaceOrder} disabled={loading}>
                                            {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-sidebar">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <img src={item.productImage} alt="" />
                                        <div className="item-info">
                                            <p className="name">{item.productName}</p>
                                            <p className="config">{item.lensType} | {item.material}</p>
                                        </div>
                                        <span className="price">{item.totalPrice}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-pricing">
                                <div className="pricing-row"><span>Subtotal</span> <span>₹{subtotal.toLocaleString()}</span></div>
                                <div className="pricing-row"><span>GST (18%)</span> <span>₹{tax.toLocaleString()}</span></div>
                                <div className="pricing-row free"><span>Shipping</span> <span>FREE</span></div>
                                <div className="total-row"><span>Total</span> <span>₹{total.toLocaleString()}</span></div>
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
