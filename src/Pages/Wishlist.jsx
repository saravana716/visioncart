import React, { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/firestoreService';
import Navbar from '../Components/Navbar/Navbar';
import Footers from '../Components/Footer/Footers';
import PropCard from '../Components/PropCard/PropCard';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import rateimg from "../assets/star.png";
import colorimg from "../assets/color.png";
import './Wishlist.css';
import Loader from '../Components/Loader/Loader';

const Wishlist = () => {
    const { wishlistItems } = useWishlist();
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products from Firestore
                const allProducts = await getProducts();
                
                // Filter products based on wishlist IDs
                const filtered = allProducts.filter(p => wishlistItems.includes(p.id));
                setWishlistProducts(filtered);
            } catch (error) {
                console.error("Error fetching wishlist products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (wishlistItems.length > 0) {
            fetchWishlistProducts();
        } else {
            setWishlistProducts([]);
            setLoading(false);
        }
    }, [wishlistItems]);

    const cardlist = wishlistProducts.map(p => ({
        id: p.id,
        title: p.brand || p.name,
        price: (p.price && p.price.toString().startsWith('₹')) ? p.price : `₹${p.price}`,
        mrpprice: p.originalPrice || (p.price ? (parseInt(p.price) * 1.5).toString() : "0"),
        img: p.photos ? p.photos[0] : (p.mainImage || ''),
        rating: rateimg,
        color: colorimg,
        ratingcount: p.ratingCount || "0",
        colorcount: p.colors ? p.colors.length : "1",
        tryOn: p.category === 'Spectacles' || p.category === 'Sunglasses'
    }));

    return (
        <div className="wishlist-page">
            <Navbar />
            
            <div className="wishlist-hero">
                <h1>Your Favorites</h1>
                <p>Saved items waiting for you to make them yours</p>
            </div>

            <div className="wishlist-container">
                {loading ? (
                    <Loader />
                ) : wishlistProducts.length === 0 ? (
                    <div className="wishlist-empty fade-in">
                        <div className="empty-heart-box">
                            <FaHeart />
                        </div>
                        <h2>Your wishlist is empty</h2>
                        <p>Seems like you haven't discovered your favorites yet.</p>
                        <button className="explore-btn" onClick={() => navigate('/products')}>
                            Start Exploring Products
                        </button>
                    </div>
                ) : (
                    <div className="wishlist-content">
                        <div className="wishlist-stats">
                            <span>{wishlistProducts.length} items saved</span>
                        </div>
                        <div className="wishlist-grid">
                            <PropCard cardlist={cardlist} />
                        </div>
                    </div>
                )}
            </div>

            <Footers />
        </div>
    );
};

export default Wishlist;
