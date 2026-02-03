import React from 'react';
import './MobileCategories.css';

// Importing dummy images for now (reusing existing assets or placeholders would be ideal)
// Since I don't have specific images for each category, I'll use placeholders 
// but in a real app these would be imports.
import card1 from "../../assets/card1.png"; // Example asset

const MobileCategories = () => {
  const sections = [
    {
      title: 'Spectacles',
      items: [
        { name: 'Men', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Women', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Unisex', img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Kids', img: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      ]
    },
    {
      title: 'Sunglasses',
      items: [
        { name: 'Men', img: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Women', img: 'https://images.unsplash.com/photo-1511406361295-5a895a0bc073?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Unisex', img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Kids', img: 'https://images.unsplash.com/photo-1602495610260-038206d2a843?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      ]
    },
    {
      title: 'Contact Lens',
      items: [
        { name: 'Lens', img: 'https://images.unsplash.com/photo-1596464716127-f9a0639b9ddc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Color Lens', img: 'https://images.unsplash.com/photo-1589710751893-f9a67700f89d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Solution', img: 'https://images.unsplash.com/photo-1628126838332-901d89851759?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Accessories', img: 'https://plus.unsplash.com/premium_photo-1675806652516-72483d922f5d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      ]
    },
    {
      title: 'Computer Glasses',
      items: [
        { name: 'ARC', img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Blue Cut', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'UV Protect', img: 'https://images.unsplash.com/photo-1616196210459-2cb82b998394?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Auto Cool', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      ]
    },
    {
      title: 'Reading Glasses',
      items: [
        { name: 'ARC', img: 'https://images.unsplash.com/photo-1596464716127-f9a0639b9ddc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Blue Cut', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'UV Protect', img: 'https://images.unsplash.com/photo-1616196210459-2cb82b998394?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Auto Cool', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      ]
    },
  ];

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
