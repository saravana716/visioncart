import { useState, useEffect } from 'react';
import './MobileCategories.css';
import { getCategories } from '../../services/firestoreService';
import { useNavigate } from 'react-router-dom';

const MobileCategories = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories();
      // Transforming flat categories into sections if needed, 
      // or just showing them as a list of items under one or more headers.
      // Based on original structure, let's group some or just map them.
      if (data.length > 0) {
        setSections([{
          title: 'All Categories',
          items: data.map(cat => ({
            name: cat.name,
            img: cat.image || `https://via.placeholder.com/150?text=${encodeURIComponent(cat.name)}`
          }))
        }]);
      }
      setLoading(false);
    };
    fetchCats();
  }, []);

  const handleCategoryClick = (name) => {
    navigate(`/products?category=${name}`);
  };

  return (
    <div className="mobile-categories">
      {sections.map((section, index) => (
        <div key={index} className="category-section">
          <div className="category-header">
            <h2>{section.title}</h2>
            <span className="view-more">View More</span>
          </div>
          <div className="category-grid">
            {section.items.map((item, idx) => (
              <div key={idx} className="category-item">
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
