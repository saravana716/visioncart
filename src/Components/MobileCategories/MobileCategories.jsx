import { useState, useEffect } from 'react';
import './MobileCategories.css';
import { getCategories } from '../../services/firestoreService';
import { useNavigate } from 'react-router-dom';

const MobileCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    fetchCats();
  }, []);

  const getSubItems = (catName) => {
    const commonGenders = [
      { name: 'Men', img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=150&q=80', params: 'Men' },
      { name: 'Women', img: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=150&q=80', params: 'Women' },
      { name: 'Unisex', img: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=150&q=80', params: 'Unisex' },
      { name: 'Kids', img: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=150&q=80', params: 'Kids' }
    ];

    if (catName.includes('Contact')) {
      return [
        { name: 'Lens', img: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=200&q=80', params: 'Lens' },
        { name: 'Color', img: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?w=200&q=80', params: 'Color' },
        { name: 'Solution', img: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200&q=80', params: 'Solution' },
        { name: 'Accessories', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80', params: 'Accessories' }
      ];
    }
    
    if (catName === 'Reading Glasses' || catName === 'Computer Glasses') {
      return [
        { name: 'ARC', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&q=80', params: 'ARC' },
        { name: 'Blue Cut', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&q=80', params: 'Blue Cut' },
        { name: 'UV Protect', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80', params: 'UV' },
        { name: 'Auto Cool', img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=200&q=80', params: 'Auto' }
      ];
    }
    
    return commonGenders;
  };

  const dynamicSections = categories.map(cat => ({
    title: cat.name,
    items: getSubItems(cat.name)
  }));

  const handleCategoryClick = (category, gender) => {
    navigate(`/products?category=${category}&gender=${gender}`);
  };

  return (
    <div className="mobile-categories">
      {dynamicSections.map((section, index) => (
        <div key={index} className="category-section">
          <div className="category-header">
            <h2>{section.title}</h2>
            <span className="view-more">View More</span>
          </div>
          <div className="category-grid">
            {section.items.map((item, idx) => (
              <div 
                key={idx} 
                className="category-item"
                onClick={() => handleCategoryClick(section.title, item.params)}
              >
                <div className="image-container">
                  <img src={item.img} alt={item.name} />
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileCategories;
