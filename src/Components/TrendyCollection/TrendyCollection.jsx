import { useState, useEffect } from 'react'
import "./TrendyCollection.css"
import PropCard from '../PropCard/PropCard'
import rateimg from "../../assets/star.png"
import colorimg from "../../assets/color.png"
import { getProducts } from '../../services/firestoreService';
import { useNavigate } from 'react-router-dom';

const TrendyCollection = ({ title = "Premium Optical Frames", categoryName = null }) => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrending = async () => {
            const data = await getProducts(categoryName);
            // Just take first 10 for the home page sections
            setTrendingProducts(data.slice(0, 10));
            setLoading(false);
        };
        fetchTrending();
    }, [categoryName]);

    const cardlist = trendingProducts.map(p => ({
        id: p.id,
        title: p.brand || p.name,
        price: (p.price && p.price.toString().startsWith('₹')) ? p.price : `₹${p.price}`,
        mrpprice: p.originalPrice || (p.price ? (parseInt(p.price) * 1.5).toString() : "0"),
        img: p.photos ? p.photos[0] : (p.mainImage || ''),
        rating: rateimg,
        color: colorimg,
        ratingcount: p.ratingCount || "0",
        colorcount: p.colors ? p.colors.length : "1"
    }));

    const handleShopNow = () => {
        if (categoryName) {
            navigate(`/products?category=${categoryName}`);
        } else {
            navigate('/products');
        }
    };

  return (
    <>
    <div className='trendymain'>
        <div className='trendymaintitle'>
            <h1>{title}</h1>
            <h1 
                onClick={handleShopNow}
                style={{borderBottom: "1px solid black", paddingBottom: "2px", cursor: "pointer"}}
            >
                Shop Now
            </h1>
        </div>

        {loading ? (
            <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: 'var(--primary-color)'}}>
                Loading {title}...
            </div>
        ) : trendingProducts.length > 0 ? (
            <div className='trendy'>
                <PropCard cardlist={cardlist}/>
            </div>
        ) : (
            <div style={{textAlign: 'center', padding: '30px', color: '#666'}}>
                No products found in this category.
            </div>
        )}
    </div>
    </>
  )
}

export default TrendyCollection