import React, { useState, useEffect } from 'react';
import { getProductById } from '../../services/firestoreService';
import PropCard from '../PropCard/PropCard';
import Skeleton from '../Skeleton/Skeleton';
import rateimg from "../../assets/star.png";
import colorimg from "../../assets/color.png";
import './RecentlyViewed.css';

const RecentlyViewed = ({ excludeId }) => {
    const [viewedProducts, setViewedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViewedProducts = async () => {
            setLoading(true);
            try {
                const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const filteredIds = viewedIds.filter(id => id !== excludeId);
                
                if (filteredIds.length === 0) {
                    setViewedProducts([]);
                    setLoading(false);
                    return;
                }

                const productsToFetch = filteredIds.slice(0, 5);
                const productPromises = productsToFetch.map(id => getProductById(id));
                const fetchedProducts = await Promise.all(productPromises);

                const validProducts = fetchedProducts.filter(p => p !== null && p !== undefined);
                
                // Sort them back into the original order of filteredIds
                const mappedProducts = validProducts
                    .sort((a, b) => productsToFetch.indexOf(a.id) - productsToFetch.indexOf(b.id));
                
                setViewedProducts(mappedProducts.map(p => ({
                    id: p.id,
                    img: p.photos ? p.photos[0] : (p.mainImage || ''),
                    title: p.brand || p.name,
                    price: (p.price && p.price.toString().startsWith('₹')) ? p.price : `₹${p.price}`,
                    mrpprice: p.originalPrice || (p.price ? (parseInt(p.price) * 1.5).toString() : "0"),
                    ratingcount: p.ratingCount || "0",
                    rating: rateimg,
                    color: colorimg,
                    colorcount: p.colors ? p.colors.length : "1"
                })));
            } catch (error) {
                console.error("Error fetching recently viewed products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchViewedProducts();
    }, [excludeId]);

    if (viewedProducts.length === 0 && !loading) return null;

    if (loading) {
        return (
            <div className="recently-viewed-section">
                <h2 className="section-title">Recently Viewed</h2>
                <div className="products-grid">
                    {[1, 2, 3, 4, 5].map(idx => <Skeleton key={idx} type="product" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="recently-viewed-section fade-in">
            <div className="section-header">
                <h2>Recently Viewed</h2>
                <div className="section-line"></div>
            </div>
            <div className="products-grid-viewed">
                <PropCard cardlist={viewedProducts} />
            </div>
        </div>
    );
};

export default RecentlyViewed;
