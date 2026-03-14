import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import "./PropCard.css"
import { useState } from 'react';

const PropCard = ({ cardlist }) => {
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addItemToCart } = useCart();
    
    if (!cardlist) return null;
    
    return (
        <>
            {cardlist.map((data) => (
                <div 
                    className='propcard' 
                    key={data.id} 
                    onClick={() => navigate(`/product/${data.id}`)}
                >
                    <div className='propcardimg'>
                        {data.tryOn && <div className="tryon-tag">3D Try-On</div>}
                        <img 
                            src={data.img} 
                            alt={data.title} 
                            className='main-product-img' 
                            style={{ viewTransitionName: `product-img-${data.id}` }}
                        />
                        
                        <div 
                            className={`heart-container ${isInWishlist(data.id) ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(data.id);
                            }}
                        >
                            {isInWishlist(data.id) ? <FaHeart className='hearticon' /> : <FaRegHeart className='hearticon' />}
                        </div>

                        <div className="card-overlay">
                            <div className="prop-buttons-overlay">
                                <button className='btn-add' onClick={async (e) => {
                                    e.stopPropagation();
                                    const cartData = {
                                        productId: data.id,
                                        productName: data.title,
                                        productImage: data.img,
                                        productPrice: data.price,
                                        totalPrice: data.price
                                    };
                                    const success = await addItemToCart(cartData);
                                    if (success) {
                                        navigate(`/product/${data.id}`);
                                    }
                                }}>Add to Cart</button>
                                <button className='btn-view' onClick={(e) => {
                                    e.stopPropagation();
                                    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                                    const updated = [data.id, ...viewed.filter(vId => vId !== data.id)].slice(0, 10);
                                    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
                                    navigate(`/product/${data.id}`);
                                }}>View</button>
                            </div>
                        </div>
                    </div>

                    <div className='propcontent'>
                        {data.brand && <span className="product-brand">{data.brand}</span>}
                        <h5 className="product-title">{data.title}</h5>
                        <div className="product-reviews">
                            <img src={data.rating} alt="rating" className="rating-stars" />
                            <span className="review-count">({data.ratingcount} reviews)</span>
                        </div>
                        <div className='product-footer'>
                            <div className="product-pricing">
                                <span className="current-price">{data.price}</span>
                                <span className="old-price">{data.mrpprice}</span>
                            </div>
                            <div className="product-variants">
                                <img src={data.color} alt="colors" className="color-dots" />
                                <span className="variant-count">{data.colorcount} +</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default PropCard