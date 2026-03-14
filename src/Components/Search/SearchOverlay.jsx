import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    useEffect(() => {
        if (query.trim().length > 1) {
            const filtered = products.filter(p => 
                p.name?.toLowerCase().includes(query.toLowerCase()) || 
                p.brand?.toLowerCase().includes(query.toLowerCase()) ||
                p.category?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
        onClose();
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay-v2 fade-in">
            <div className="search-container-v2 animate-slide-down">
                <div className="search-header-v2">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon-v2" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for frames, brands, or styles..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Escape' && onClose()}
                        />
                    </div>
                    <button className="close-search-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="search-body-v2">
                    {results.length > 0 ? (
                        <div className="results-list-v2">
                            <h4 className="results-title">Top Results</h4>
                            {results.map(p => (
                                <div key={p.id} className="search-result-item" onClick={() => handleResultClick(p.id)}>
                                    <div className="result-img">
                                        <img src={p.mainImage} alt={p.name} />
                                    </div>
                                    <div className="result-info">
                                        <p className="res-brand">{p.brand}</p>
                                        <p className="res-name">{p.name}</p>
                                        <p className="res-price">₹{p.price}</p>
                                    </div>
                                    <FaArrowRight className="res-arrow" />
                                </div>
                            ))}
                            <button className="view-all-res" onClick={() => {
                                navigate(`/shop?search=${query}`);
                                onClose();
                            }}>
                                View all results for "{query}"
                            </button>
                        </div>
                    ) : query.trim().length > 1 ? (
                        <div className="no-res-state">
                            <p>No products found for "<span>{query}</span>"</p>
                        </div>
                    ) : (
                        <div className="search-suggestions">
                            <h4>Popular Searches</h4>
                            <div className="tag-list">
                                {['Blue Block', 'Wayfarer', 'Ray-Ban', 'Computer Glasses', 'Round'].map(tag => (
                                    <span key={tag} className="s-tag" onClick={() => setQuery(tag)}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="search-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default SearchOverlay;
