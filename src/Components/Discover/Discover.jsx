import React, { useState, useEffect, useRef } from 'react'
import "./Discover.css"
import discoverimg from "../../assets/discoverimg.png"
import { getCategories } from '../../services/firestoreService'
import { useNavigate } from 'react-router-dom'

const Discover = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesData = async () => {
            const data = await getCategories();
            setCategories(data);
            setLoading(false);
        };
        fetchCategoriesData();
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    
    // Duplicate list for infinite scroll effect
    const extendedList = categories.length > 0 ? [...categories, ...categories, ...categories] : []; 

    useEffect(() => {
        if (categories.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => prev + 1);
            setIsTransitioning(true);
        }, 3000);

        return () => clearInterval(interval);
    }, [categories.length]);

    useEffect(() => {
        if (categories.length === 0) return;

        if (currentIndex >= categories.length * 2) {
             const timeout = setTimeout(() => {
                 setIsTransitioning(false);
                 setCurrentIndex(categories.length); // Snap back to the middle copy
             }, 500); // Wait for transition to finish
             return () => clearTimeout(timeout);
        }
        if (!isTransitioning) {
            // Re-enable transition after snap back
            const timeout = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
             return () => clearTimeout(timeout);
        }
    }, [currentIndex, isTransitioning, categories.length]);

    if (loading) {
        return <div className='discover' style={{justifyContent: 'center'}}>Loading categories...</div>;
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className='discover'>
            <div className='discoverleft'>
                <h1>Discover</h1>
                <h1>Frames <img src={discoverimg} alt="Discover" /></h1>
                <h1>By Category</h1>
            </div>
            <div className='discoverright'>
                <div 
                    className='carousel-track' 
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / (extendedList.length || 1))}%)`, 
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                        width: `calc(${extendedList.length} * (100% / 3))`, 
                        display: 'flex'
                    }}
                >
                    {extendedList.map((data, index) => (
                        <div 
                            className='DiscoverCard' 
                            key={`${data.id}-${index}`} 
                            style={{ 
                                width: `calc(100% / ${extendedList.length})`,
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/products?category=${data.name}`)}
                        > 
                            <div className='cardimg'>
                                <img src={data.imageUrl || data.img} alt={data.name} />
                            </div>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products?category=${data.name}`);
                            }}>{data.name}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Discover