import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './LensSelectionModal.css';

const LensSelectionModal = ({ 
    isOpen, 
    onClose, 
    product, 
    lensEnhancements, 
    addItemToCart, 
    setCartOpen, 
    setDrawerTab 
}) => {
    // Selection States
    const [selectedLensType, setSelectedLensType] = useState('Single Vision');
    const [selectedMaterial, setSelectedMaterial] = useState('TR90');
    const [selectedFrameStyle, setSelectedFrameStyle] = useState('Rimmed');
    const [selectedUsage, setSelectedUsage] = useState('Everyday');

    useEffect(() => {
        const handleCloseAll = () => {
            if (isOpen) onClose();
        };
        window.addEventListener('close-all-modals', handleCloseAll);
        return () => window.removeEventListener('close-all-modals', handleCloseAll);
    }, [isOpen, onClose]);

    const [prescriptionType, setPrescriptionType] = useState('Same power for both eyes');
    const [selectedEnhancements, setSelectedEnhancements] = useState([]);
    const [prescription, setPrescription] = useState({
        right: { sph: '-0.50', cyl: '----', axis: '----', add: '----' },
        left: { sph: '-0.50', cyl: '----', axis: '----', add: '----' }
    });

    // Handle Scroll Lock
    useEffect(() => {
        const appContainer = document.querySelector('.App');
        if (isOpen) {
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
            if (appContainer) appContainer.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
            if (appContainer) appContainer.classList.remove('no-scroll');
        }
        return () => {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
            if (appContainer) appContainer.classList.remove('no-scroll');
        };
    }, [isOpen]);

    const toggleEnhancement = (enh) => {
        setSelectedEnhancements(prev => {
            const exists = prev.find(e => e.id === enh.id);
            if (exists) {
                return prev.filter(e => e.id !== enh.id);
            } else {
                return [...prev, enh];
            }
        });
    };

    const calculateTotalPrice = () => {
        if (!product) return '₹0';
        const base = parseInt(product.price.toString().replace(/[^0-9]/g, '') || '0');
        const extras = selectedEnhancements.reduce((sum, enh) => sum + (parseInt(enh.price || 0)), 0);
        return `₹${base + extras}`;
    };

    if (!isOpen || !product) return null;

    return ReactDOM.createPortal(
        <div className="lens-modal-overlay" onClick={(e) => {
            if (e.target.className === 'lens-modal-overlay') onClose();
        }}>
            <div className="lens-modal reveal-in">
                <button className="close-modal" onClick={onClose}>✕</button>
                
                <div className="modal-content">
                    <h2 className="modal-title-small">Select Lens Type</h2>
                    <div className="lens-type-grid">
                        <div className={`lens-type-item ${selectedLensType === 'Single Vision' ? 'active' : ''}`} onClick={() => setSelectedLensType('Single Vision')}>
                            <div className="icon">👁️</div>
                            <p>Single Vision</p>
                            <span>Distance | Near Vision</span>
                        </div>
                        <div className={`lens-type-item ${selectedLensType === 'Progressive' ? 'active' : ''}`} onClick={() => setSelectedLensType('Progressive')}>
                            <div className="icon">🔄</div>
                            <p>Progressive</p>
                            <span>Near & Far Vision</span>
                        </div>
                        <div className={`lens-type-item ${selectedLensType === 'Bifocal' ? 'active' : ''}`} onClick={() => setSelectedLensType('Bifocal')}>
                            <div className="icon">👓</div>
                            <p>Bifocal</p>
                            <span>Dual Vision</span>
                        </div>
                        <div className={`lens-type-item ${selectedLensType === 'Anti-Power' ? 'active' : ''}`} onClick={() => setSelectedLensType('Anti-Power')}>
                            <div className="icon">⚙️</div>
                            <p>Anti-Power</p>
                            <span>Fashion Lenses</span>
                        </div>
                    </div>

                    <h2 className="modal-title-small">Select Lens Material</h2>
                    <div className="material-grid">
                        <label><input type="radio" name="material" checked={selectedMaterial === 'Metal'} onChange={() => setSelectedMaterial('Metal')} /> <span>Metal</span></label>
                        <label><input type="radio" name="material" checked={selectedMaterial === 'Stainless Steel'} onChange={() => setSelectedMaterial('Stainless Steel')} /> <span>Stainless Steel</span></label>
                        <label><input type="radio" name="material" checked={selectedMaterial === 'TR90'} onChange={() => setSelectedMaterial('TR90')} /> <span>TR90 <span className="recommended">Recommended</span></span></label>
                        <label><input type="radio" name="material" checked={selectedMaterial === 'Mixed Material'} onChange={() => setSelectedMaterial('Mixed Material')} /> <span>Mixed Material</span></label>
                        <label><input type="radio" name="material" checked={selectedMaterial === 'Titanium'} onChange={() => setSelectedMaterial('Titanium')} /> <span>Titanium</span></label>
                    </div>

                    <h2 className="modal-title-small">Select Frame Style</h2>
                    <div className="material-grid">
                        <label><input type="radio" name="f-style" checked={selectedFrameStyle === 'Rimmed'} onChange={() => setSelectedFrameStyle('Rimmed')} /> <span>Rimmed</span></label>
                        <label><input type="radio" name="f-style" checked={selectedFrameStyle === 'Semi - Rimmed'} onChange={() => setSelectedFrameStyle('Semi - Rimmed')} /> <span>Semi - Rimmed</span></label>
                        <label><input type="radio" name="f-style" checked={selectedFrameStyle === 'Rimless'} onChange={() => setSelectedFrameStyle('Rimless')} /> <span>Rimless</span></label>
                    </div>

                    <h2 className="modal-title-small">Add Lens Enhancements</h2>
                    <div className="enhancements-grid">
                        {lensEnhancements.map((enh) => (
                            <label key={enh.id} className={selectedEnhancements.find(e => e.id === enh.id) ? 'active' : ''}>
                                <input 
                                    type="checkbox" 
                                    checked={!!selectedEnhancements.find(e => e.id === enh.id)}
                                    onChange={() => toggleEnhancement(enh)}
                                /> {enh.name} {enh.price > 0 && `(+₹${enh.price})`}
                            </label>
                        ))}
                    </div>

                    <h2 className="modal-title-small">Power Options - Eye Selection</h2>
                    <div className="prescription-toggle">
                        <label>
                            <input type="radio" name="p-type" checked={prescriptionType === 'Same power for both eyes'} onChange={() => setPrescriptionType('Same power for both eyes')} /> 
                            <span>Same power for both eyes</span>
                        </label>
                        <label>
                            <input type="radio" name="p-type" checked={prescriptionType === 'Different power for each eye'} onChange={() => setPrescriptionType('Different power for each eye')} /> 
                            <span>Different power for each eye</span>
                        </label>
                    </div>

                    <div className="prescription-input-area">
                        <h3>Prescription Input Table</h3>
                        <div className="prescription-table-wrapper">
                            <table className="prescription-table">
                                <thead>
                                    <tr>
                                        <th>Right Eye</th>
                                        <th>Left Eye</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="p-row"><span>SPH</span><select value={prescription.right.sph} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, sph: e.target.value } }))}><option>-0.50</option><option>0.00</option><option>+0.50</option></select></div>
                                            <div className="p-row"><span>CYL</span><select value={prescription.right.cyl} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, cyl: e.target.value } }))}><option>----</option><option>-0.25</option></select></div>
                                            <div className="p-row"><span>AXIS</span><select value={prescription.right.axis} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, axis: e.target.value } }))}><option>----</option><option>90</option><option>180</option></select></div>
                                            <div className="p-row"><span>ADD</span><select value={prescription.right.add} onChange={(e) => setPrescription(prev => ({ ...prev, right: { ...prev.right, add: e.target.value } }))}><option>----</option><option>+1.00</option></select></div>
                                        </td>
                                        <td>
                                            <div className="p-row"><span>SPH</span><select value={prescription.left.sph} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, sph: e.target.value } }))}><option>-0.50</option><option>0.00</option><option>+0.50</option></select></div>
                                            <div className="p-row"><span>CYL</span><select value={prescription.left.cyl} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, cyl: e.target.value } }))}><option>----</option><option>-0.25</option></select></div>
                                            <div className="p-row"><span>AXIS</span><select value={prescription.left.axis} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, axis: e.target.value } }))}><option>----</option><option>90</option><option>180</option></select></div>
                                            <div className="p-row"><span>ADD</span><select value={prescription.left.add} onChange={(e) => setPrescription(prev => ({ ...prev, left: { ...prev.left, add: e.target.value } }))}><option>----</option><option>+1.00</option></select></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button 
                                className="save-btn-green" 
                                onClick={() => alert('Prescription saved successfully!')}
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <h2 className="modal-title-small">How will you use these glasses?</h2>
                    <div className="usage-grid">
                        <div className={`usage-item ${selectedUsage === 'Everyday' ? 'active' : ''}`} onClick={() => setSelectedUsage('Everyday')}>
                            <div className="usage-box">
                                <span className="usage-emoji">🏠</span>
                            </div>
                            <p>Everyday</p>
                        </div>
                        <div className={`usage-item ${selectedUsage === 'Computer | Screen' ? 'active' : ''}`} onClick={() => setSelectedUsage('Computer | Screen')}>
                            <div className="usage-box">
                                <span className="usage-emoji">💻</span>
                            </div>
                            <p>Digital Use</p>
                        </div>
                        <div className={`usage-item ${selectedUsage === 'Reading' ? 'active' : ''}`} onClick={() => setSelectedUsage('Reading')}>
                            <div className="usage-box">
                                <span className="usage-emoji">📚</span>
                            </div>
                            <p>Reading</p>
                        </div>
                        <div className={`usage-item ${selectedUsage === 'Driving' ? 'active' : ''}`} onClick={() => setSelectedUsage('Driving')}>
                            <div className="usage-box">
                                <span className="usage-emoji">🚗</span>
                            </div>
                            <p>Driving</p>
                        </div>
                    </div>

                    <div className="price-summary-box">
                        <div className="p-line"><span>Frame Price:</span> <span>{product.price}</span></div>
                        <div className="p-line"><span>Lens Price:</span> <span>₹0</span></div>
                        <div className="p-line"><span>Add-ons:</span> <span>₹{selectedEnhancements.reduce((sum, e) => sum + (parseInt(e.price || 0)), 0)}</span></div>
                        <div className="p-total-line"><span>Total Price:</span> <span>{calculateTotalPrice()}</span></div>
                    </div>

                    <div className="modal-footer-btns">
                        <button 
                            className={`modal-add-cart ${product.stock !== undefined && product.stock <= 0 ? 'disabled' : ''}`} 
                            disabled={product.stock !== undefined && product.stock <= 0}
                            onClick={async () => {
                                if (product.stock !== undefined && product.stock <= 0) return;
                                const cartData = {
                                    productId: product.id,
                                    productBrand: product.brand,
                                    productName: product.title,
                                    productImage: product.mainImage,
                                    productPrice: product.price,
                                    productSize: product.size,
                                    category: product.category,
                                    specifications: [
                                        ...(product.technicalSpecs || []),
                                        { label: 'Lens', value: selectedLensType },
                                        { label: 'Material', value: selectedMaterial },
                                        { label: 'Style', value: selectedFrameStyle },
                                        { label: 'Usage', value: selectedUsage },
                                        { label: 'Prescription', value: prescriptionType }
                                    ],
                                    sku: product.technicalSpecs?.find(s => s.label === 'SKU Code')?.value || product.id,
                                    enhancements: selectedEnhancements,
                                    prescriptionType,
                                    prescription,
                                    totalPrice: calculateTotalPrice()
                                };
                                const success = await addItemToCart(cartData);
                                if (success) {
                                    onClose();
                                    setDrawerTab('cart');
                                    setCartOpen(true);
                                }
                            }}
                        >
                            Add to Cart
                        </button>
                        <button 
                            className={`modal-buy-now ${product.stock !== undefined && product.stock <= 0 ? 'disabled' : ''}`} 
                            disabled={product.stock !== undefined && product.stock <= 0}
                            onClick={onClose}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    , document.body);
};

export default LensSelectionModal;
