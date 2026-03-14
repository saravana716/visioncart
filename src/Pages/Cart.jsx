import React, { useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaRegFileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getCoupon } from '../services/firestoreService';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeItemFromCart, cartCount } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const handleApplyCoupon = async () => {
        const code = couponCode.toUpperCase();
        try {
            const couponData = await getCoupon(code);
            if (couponData) {
                let disc = 0;
                if (couponData.type === 'flat') {
                    disc = couponData.value;
                } else if (couponData.type === 'percent') {
                    disc = Math.round(total * (couponData.value / 100));
                }
                
                setDiscount(disc);
                setAppliedCoupon(code);
                toast.success(`Coupon Applied! ₹${disc} Off`);
            } else {
                toast.error("Invalid Coupon Code");
            }
        } catch (error) {
            console.error("Error applying coupon:", error);
            toast.error("Failed to apply coupon");
        }
    };

    const removeCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
        toast.success("Coupon Removed");
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => {
            const price = parseInt(item.totalPrice?.toString().replace(/[^0-9]/g, '') || '0');
            return acc + price;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = Math.round(subtotal * 0.18); // 18% GST example
    const total = subtotal + tax;

    if (cartCount === 0) {
        return (
            <div className="cart-page-wrapper">
                <Navbar />
                <div className="empty-cart-container">
                    <div className="empty-cart-box">
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-download-in-svg-png-gif-file-formats--shopping-ecommerce-pack-e-commerce-illustrations-4436696.png" alt="Empty Cart" />
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <button className="start-shopping-btn" onClick={() => navigate('/products')}>Start Shopping</button>
                    </div>
                </div>
                <Footers />
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <Navbar />
            <div className="cart-container">
                <h1 className="cart-header">Shopping Cart <span>({cartCount} Items)</span></h1>
                
                <div className="cart-content-grid">
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <div className="item-img-box">
                                    <img src={item.productImage} alt={item.productName} />
                                </div>
                                <div className="item-details">
                                    <div className="item-main-info">
                                        <h3>{item.productName}</h3>
                                        <p className="item-price">{item.totalPrice}</p>
                                    </div>
                                    
                                    <div className="item-config-summary">
                                        <div className="config-chip"><span>Lens:</span> {item.lensType}</div>
                                        <div className="config-chip"><span>Material:</span> {item.material}</div>
                                        {item.enhancements?.length > 0 && (
                                            <div className="config-chip">
                                                <span>Add-ons:</span> {item.enhancements.map(e => e.name).join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    {item.prescription && (
                                        <div className="item-prescription-brief">
                                            <FaRegFileAlt /> 
                                            <span>Prescription Attached ({item.prescriptionType})</span>
                                        </div>
                                    )}
                                </div>
                                <div className="item-actions">
                                    <button className="remove-item-btn" onClick={() => removeItemFromCart(item.id)}>
                                        <FaTrashAlt /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-sidebar">
                        <div className="summary-box">
                            <h2>Order Summary</h2>
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-line">
                                <span>Estimated GST (18%)</span>
                                <span>₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="summary-line">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>
                            <div className="summary-total">
                                <span>Total Amount</span>
                                <div className="total-stack">
                                    {discount > 0 && <span className="old-total">₹{total.toLocaleString()}</span>}
                                    <span className="final-total">₹{(total - discount).toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="coupon-section">
                                <div className="coupon-input-group">
                                    <input 
                                        type="text" 
                                        placeholder="Enter Coupon Code" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={appliedCoupon}
                                    />
                                    <button 
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode || appliedCoupon}
                                    >
                                        {appliedCoupon ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                                {appliedCoupon && (
                                    <div className="applied-coupon-tag">
                                        <span>{appliedCoupon} applied!</span>
                                        <button onClick={removeCoupon}>✕</button>
                                    </div>
                                )}
                            </div>

                            <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                            <p className="checkout-note">Secure SSL encryption & safe payment processing</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footers />
        </div>
    );
};

export default Cart;
