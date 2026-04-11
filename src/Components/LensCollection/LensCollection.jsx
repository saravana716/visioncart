import React from 'react';
import './LensCollection.css';

// Import all 7 lens images cleanly
import lens1 from '../../assets/Lens/1.png';
import lens2 from '../../assets/Lens/2.png';
import lens3 from '../../assets/Lens/3.png';
import lens4 from '../../assets/Lens/4.png';
import lens5 from '../../assets/Lens/5.png';
import lens6 from '../../assets/Lens/6.png';
import lens7 from '../../assets/Lens/7.png';

const lensData = [
  { id: 1, image: lens1, name: 'Standard Single Vision', description: 'Clear vision for everyday use' },
  { id: 2, image: lens2, name: 'Blue Cut Lenses', description: 'Protect eyes from digital screens' },
  { id: 3, image: lens3, name: 'Anti-Glare Lenses', description: 'Reduce harsh reflections & glare' },
  { id: 4, image: lens4, name: 'Bifocal Lenses', description: 'Seamless near & distant vision' },
  { id: 5, image: lens5, name: 'Progressive Lenses', description: 'Smooth multi-distance clarity' },
  { id: 6, image: lens6, name: 'Photochromic Lenses', description: 'Adapts intelligently to sunlight' },
  { id: 7, image: lens7, name: 'Premium High-Index', description: 'Ultra-thin for high prescriptions' }
];

const LensCollection = () => {
  return (
    <div className="lens-collection-container scroll-reveal">
      <div className="lens-header">
        <h2>Lenses For Your Lifestyle</h2>
        <p>Explore our wide collection of high-quality lenses tailored perfectly for your lifestyle and vision zero compromises.</p>
      </div>

      <div className="lens-grid">
        {lensData.map((lens) => (
          <div key={lens.id} className="lens-card">
            <div className="lens-image-wrapper">
              <img src={lens.image} alt={lens.name} className="lens-image" />
            </div>
            <div className="lens-info">
              <h3>{lens.name}</h3>
              <p>{lens.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LensCollection;
