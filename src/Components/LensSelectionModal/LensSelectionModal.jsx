import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa';
import './LensSelectionModal.css';
import ReadingGlassesPowerSelector from '../ReadingGlassesPowerSelector/ReadingGlassesPowerSelector';

const LensSelectionModal = ({ 
    isOpen, 
    onClose, 
    product, 
    lensEnhancements, 
    addItemToCart, 
    setCartOpen, 
    setDrawerTab 
}) => {
    const navigate = useNavigate();

    // Selection States
    const [selectedLensType, setSelectedLensType] = useState('Single Vision');
    const [selectedMaterial, setSelectedMaterial] = useState('TR90');
    const [selectedFrameStyle, setSelectedFrameStyle] = useState('Rimmed');
    const [selectedPackage, setSelectedPackage] = useState('Silver Pack');
    const [selectedUsage, setSelectedUsage] = useState('Everyday');

    const lensPackages = [
        { id: 'Silver Pack', name: 'Silver Pack', price: 490, features: 'Anti-Glare + Scratch Resistant', description: 'Clear vision for everyday use', color: '#B0B0B0' },
        { id: 'Gold Pack', name: 'Gold Pack', price: 990, features: 'UV Protection + Thinner Lenses', description: 'Best for outdoor & long wear', recommended: true, color: '#FFD700' },
        { id: 'Platinum Pack', name: 'Platinum Pack', price: 1490, features: 'Blue Block + Super Hydrophobic', description: 'Superior digital protection', color: '#E5E4E2' }
    ];

    // Contact Lenses States
    const [contactLensPowerOption, setContactLensPowerOption] = useState('later');
    const [clRightEyeSelected, setClRightEyeSelected] = useState(true);
    const [clLeftEyeSelected, setClLeftEyeSelected] = useState(true);
    const [clRightSph, setClRightSph] = useState('');
    const [clLeftSph, setClLeftSph] = useState('');
    const [clRightBoxes, setClRightBoxes] = useState(1);
    const [clLeftBoxes, setClLeftBoxes] = useState(1);
    const [showPowerSelectorModal, setShowPowerSelectorModal] = useState(null);

    const contactLensPacks = [
        { id: '3-lens-box', name: 'Standard Pack', price: 299, oldPrice: 364, description: '3 lens/box', features: 'Daily Wear Comfort', color: '#001f54' },
        { id: '6-lens-box', name: 'Value Pack', price: 549, oldPrice: 728, description: '6 lens/box', features: 'Maximum hydration', color: '#00d285' }
    ];
    const [selectedClPack, setSelectedClPack] = useState('3-lens-box');

    // Spectacles Specialized Power States
    const [spectaclesPowerOption, setSpectaclesPowerOption] = useState('later');
    const [specRightSelected, setSpecRightSelected] = useState(true);
    const [specLeftSelected, setSpecLeftSelected] = useState(true);
    const [specRightSph, setSpecRightSph] = useState('');
    const [specLeftSph, setSpecLeftSph] = useState('');

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
    const [readingPower, setReadingPower] = useState({ rightPower: '', leftPower: '', sameForBoth: true });

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
        const basePriceInt = parseInt(product.price.toString().replace(/[^0-9]/g, '') || '0');
        
        if (product.category === 'Contact Lenses') {
            const packPrice = contactLensPacks.find(p => p.id === selectedClPack)?.price || basePriceInt;
            const totalBoxes = (clRightEyeSelected ? clRightBoxes : 0) + (clLeftEyeSelected ? clLeftBoxes : 0);
            return `₹${packPrice * totalBoxes}`;
        }
        
        const extras = selectedEnhancements.reduce((sum, enh) => sum + (parseInt(enh.price || 0)), 0);
        
        // Premium Package Price only for Spectacles
        if (product.category === 'Spectacles') {
            const packagePrice = lensPackages.find(p => p.id === selectedPackage)?.price || 0;
            return `₹${basePriceInt + packagePrice + extras}`;
        }
        
        return `₹${basePriceInt + extras}`;
    };

    const handlePrescriptionTypeChange = (type) => {
        setPrescriptionType(type);
        if (type === 'Same power for both eyes') {
            // Sync left to right values when switching back to same power
            setPrescription(prev => ({
                ...prev,
                left: { ...prev.right }
            }));
        }
    };

    const handlePrescriptionChange = (eye, field, value) => {
        setPrescription(prev => {
            const newState = { ...prev };
            newState[eye] = { ...newState[eye], [field]: value };
            
            if (prescriptionType === 'Same power for both eyes') {
                const otherEye = eye === 'right' ? 'left' : 'right';
                newState[otherEye] = { ...newState[otherEye], [field]: value };
            }
            return newState;
        });
    };

    const handleInternalAddToCart = async () => {
        if (product.stock !== undefined && product.stock <= 0) return false;
        const isReadingGlasses = product.category === 'Reading Glasses';
        const isContactLens = product.category === 'Contact Lenses';
        const isSpectacles = product.category === 'Spectacles';
        
        // Validate for reading glasses
        if (isReadingGlasses && (!readingPower.rightPower || (!readingPower.sameForBoth && !readingPower.leftPower))) {
            const { default: toast } = await import('react-hot-toast');
            toast.error('Please select power for your eyes');
            return false;
        }

        const specifications = [
            ...(product.technicalSpecs || []),
            { label: 'Size', value: product.size || 'Standard' }
        ];

        if (isContactLens) {
            specifications.push({ label: 'Lens Type', value: 'Contact Lens' });
        } else if (isReadingGlasses) {
            specifications.push(
                { label: 'Lens', value: 'Reading Glass' },
                { label: 'Right Eye Power', value: readingPower.rightPower },
                { label: 'Left Eye Power', value: readingPower.sameForBoth ? readingPower.rightPower : readingPower.leftPower }
            );
        } else if (isSpectacles) {
            specifications.push(
                { label: 'Lens Type', value: selectedLensType },
                { label: 'Lens Package', value: selectedPackage },
                { label: 'Usage', value: selectedUsage }
            );
        } else {
            // Sunglasses, Computer Glasses, etc.
            specifications.push(
                { label: 'Lens Type', value: selectedLensType },
                { label: 'Material', value: selectedMaterial },
                { label: 'Style', value: selectedFrameStyle },
                { label: 'Usage', value: selectedUsage }
            );
        }

        const cartData = {
            productId: product.id,
            productBrand: product.brand,
            productName: product.title,
            productImage: product.mainImage,
            productPrice: product.price,
            productSize: product.size,
            category: product.category,
            specifications: specifications,
            sku: product.technicalSpecs?.find(s => s.label === 'SKU Code')?.value || product.id,
            enhancements: isReadingGlasses || isContactLens ? [] : selectedEnhancements,
            prescriptionType: isReadingGlasses ? 'Reading Glass Power' : (isContactLens ? (contactLensPowerOption === 'manual' ? 'Manual Contact Lens Power' : 'Submit Later') : (isSpectacles ? (spectaclesPowerOption === 'manual' ? 'Manual Prescription' : 'Submit Later') : prescriptionType)),
            prescription: isContactLens ? {
                rightSelected: clRightEyeSelected,
                leftSelected: clLeftEyeSelected,
                rightPower: clRightSph || null,
                leftPower: clLeftSph || null,
                rightBoxes: clRightBoxes,
                leftBoxes: clLeftBoxes,
                pack: contactLensPacks.find(p => p.id === selectedClPack)
            } : (isReadingGlasses ? { readingPower } : (isSpectacles ? {
                rightSelected: specRightSelected,
                leftSelected: specLeftSelected,
                rightPower: specRightSelected ? specRightSph : null,
                leftPower: specLeftSelected ? specLeftSph : null,
                type: spectaclesPowerOption
            } : prescription)),
            totalPrice: calculateTotalPrice()
        };
        
        return await addItemToCart(cartData);
    };

    const handleSavePrescription = () => {
        import('react-hot-toast').then(({ default: toast }) => {
            toast.success('Power selection completed', {
                style: {
                    borderRadius: '10px',
                    background: '#001f54',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px'
                },
                iconTheme: {
                    primary: '#00d285',
                    secondary: '#fff',
                },
            });
        });
    };

    if (!isOpen || !product) return null;

    return ReactDOM.createPortal(
        <div className="lens-modal-overlay" onClick={(e) => {
            if (e.target.className === 'lens-modal-overlay') onClose();
        }}>
            <div className="lens-modal reveal-in">
                <button className="close-modal" onClick={onClose}>✕</button>
                
                <div className="modal-content">
                    {product.category === 'Contact Lenses' ? (
                        <div className="contact-lenses-section">
                            <h2 className="modal-title-small">Lenses per Pack</h2>
                            <div className="packages-grid cl-packages">
                                {contactLensPacks.map(pkg => (
                                    <div 
                                        key={pkg.id} 
                                        className={`package-card ${selectedClPack === pkg.id ? 'active' : ''}`}
                                        onClick={() => setSelectedClPack(pkg.id)}
                                    >
                                        <div className="package-header">
                                            <div className="package-title-row">
                                                <div className="package-dot" style={{ background: pkg.color }}></div>
                                                <h3>{pkg.name}</h3>
                                            </div>
                                            <div className="package-price-col">
                                                {pkg.oldPrice && <span className="package-old-price">₹{pkg.oldPrice}</span>}
                                                <div className="package-price">₹{pkg.price}</div>
                                            </div>
                                        </div>
                                        <p className="package-desc">{pkg.description}</p>
                                        <div className="package-features">
                                            <span>✨ {pkg.features}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cl-power-type-container">
                                <div className="cl-power-desc">
                                    <span className="p-label">Power</span>
                                    <span className="p-label">Type</span>
                                </div>
                                <button className="cl-power-btn active">With Power</button>
                            </div>

                            <div className="cl-power-entry-box">
                                <label className="cl-radio-label-main">
                                    <input 
                                        type="radio" 
                                        name="cl-power-entry" 
                                        checked={contactLensPowerOption === 'manual'} 
                                        onChange={() => setContactLensPowerOption('manual')} 
                                    />
                                    <span className="cl-radio-text-main">Enter power Manually</span>
                                </label>
                                
                                <label className="cl-radio-label-main mt-10 border-top-cl">
                                    <input 
                                        type="radio" 
                                        name="cl-power-entry" 
                                        checked={contactLensPowerOption === 'later'} 
                                        onChange={() => setContactLensPowerOption('later')} 
                                    />
                                    <span className="cl-radio-text-main">I will submit power later</span>
                                </label>

                                {contactLensPowerOption === 'later' && (
                                    <div className="cl-submit-later-banner">
                                        <div className="banner-left">
                                            <h3>Don't worry! <FaPhoneAlt className="phone-icon-cl" /></h3>
                                            <p>We will call you to get your power!</p>
                                        </div>
                                        <div className="banner-right">
                                            <div className="lens-graphic-pair">
                                                <div className="lens-graphic positive">
                                                    <span>+</span>
                                                    <div className="lens-shape"></div>
                                                </div>
                                                <div className="lens-graphic negative">
                                                    <span>-</span>
                                                    <div className="lens-shape"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="cl-manual-power-grid">
                                    <div className="cl-eye-headers">
                                        <div></div>
                                        <label className="cl-checkbox-label">
                                            <input 
                                                type="checkbox" 
                                                checked={clRightEyeSelected} 
                                                onChange={(e) => setClRightEyeSelected(e.target.checked)} 
                                            /> RIGHT (OD)
                                        </label>
                                        <label className="cl-checkbox-label">
                                            <input 
                                                type="checkbox" 
                                                checked={clLeftEyeSelected} 
                                                onChange={(e) => setClLeftEyeSelected(e.target.checked)} 
                                            /> LEFT (OS)
                                        </label>
                                    </div>
                                    
                                    {contactLensPowerOption === 'manual' && (
                                        <div className="cl-power-row">
                                            <div className="cl-row-label">
                                                <span className="main-label">Spherical</span>
                                                <span className="sub-label">SPH</span>
                                            </div>
                                            <div className="cl-dropdown-col">
                                                <button className="cl-dropdown-btn" onClick={() => setShowPowerSelectorModal('right')} disabled={!clRightEyeSelected}>
                                                    {clRightSph || 'Select'} <span className="arrow">▼</span>
                                                </button>
                                            </div>
                                            <div className="cl-dropdown-col">
                                                <button className="cl-dropdown-btn" onClick={() => setShowPowerSelectorModal('left')} disabled={!clLeftEyeSelected}>
                                                    {clLeftSph || 'Select'} <span className="arrow">▼</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="cl-power-row">
                                        <div className="cl-row-label">
                                            <span className="main-label">No. of Boxes</span>
                                            <span className="sub-label">3 lens/box</span>
                                        </div>
                                        <div className="cl-dropdown-col">
                                            <select className="cl-select" disabled={!clRightEyeSelected} value={clRightBoxes} onChange={e => setClRightBoxes(parseInt(e.target.value))}>
                                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        <div className="cl-dropdown-col">
                                            <select className="cl-select" disabled={!clLeftEyeSelected} value={clLeftBoxes} onChange={e => setClLeftBoxes(parseInt(e.target.value))}>
                                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
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

                            {product.category === 'Spectacles' ? (
                                <>
                                    <h2 className="modal-title-small">Select Lens Package</h2>
                                    <div className="packages-grid">
                                        {lensPackages.map(pkg => (
                                            <div 
                                                key={pkg.id} 
                                                className={`package-card ${selectedPackage === pkg.id ? 'active' : ''}`}
                                                onClick={() => setSelectedPackage(pkg.id)}
                                            >
                                                {pkg.recommended && <div className="recommended-badge">Best Value</div>}
                                                <div className="package-header">
                                                    <div className="package-title-row">
                                                        <div className="package-dot" style={{ background: pkg.color }}></div>
                                                        <h3>{pkg.name}</h3>
                                                    </div>
                                                    <div className="package-price">₹{pkg.price}</div>
                                                </div>
                                                <p className="package-desc">{pkg.description}</p>
                                                <div className="package-features">
                                                    <span>✨ {pkg.features}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="compact-power-flow main-selector">
                                        <div 
                                            className={`power-option-card ${spectaclesPowerOption === 'manual' ? 'active' : ''}`}
                                            onClick={() => setSpectaclesPowerOption('manual')}
                                        >
                                            <div className="power-radio"></div>
                                            <div className="power-info">
                                                <strong>Enter power Manually</strong>
                                            </div>
                                        </div>
                                        <div 
                                            className={`power-option-card ${spectaclesPowerOption === 'later' ? 'active' : ''}`}
                                            onClick={() => setSpectaclesPowerOption('later')}
                                        >
                                            <div className="power-radio"></div>
                                            <div className="power-info">
                                                <strong>I will submit power later</strong>
                                            </div>
                                        </div>

                                        {spectaclesPowerOption === 'manual' && (
                                            <div className="spec-manual-power-entry animate-in">
                                                <div className="eye-selection-row">
                                                    <label className="cl-checkbox-label">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={specRightSelected} 
                                                            onChange={(e) => setSpecRightSelected(e.target.checked)} 
                                                        /> 
                                                        <span className="custom-checkmark">✓</span>
                                                        RIGHT (OD)
                                                    </label>
                                                    <label className="cl-checkbox-label">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={specLeftSelected} 
                                                            onChange={(e) => setSpecLeftSelected(e.target.checked)} 
                                                        /> 
                                                        <span className="custom-checkmark">✓</span>
                                                        LEFT (OS)
                                                    </label>
                                                </div>

                                                <div className="cl-power-row no-border">
                                                    <div className="cl-row-label">
                                                        <span className="main-label">Spherical</span>
                                                        <span className="sub-label">SPH</span>
                                                    </div>
                                                    <div className="cl-dropdown-col">
                                                        <button 
                                                            className="cl-dropdown-btn" 
                                                            onClick={() => setShowPowerSelectorModal('spec-right')} 
                                                            disabled={!specRightSelected}
                                                        >
                                                            {specRightSph || 'Select'} <span className="arrow">▼</span>
                                                        </button>
                                                    </div>
                                                    <div className="cl-dropdown-col">
                                                        <button 
                                                            className="cl-dropdown-btn" 
                                                            onClick={() => setShowPowerSelectorModal('spec-left')} 
                                                            disabled={!specLeftSelected}
                                                        >
                                                            {specLeftSph || 'Select'} <span className="arrow">▼</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="cl-power-row no-border">
                                                    <div className="cl-row-label">
                                                        <span className="main-label">No. of Boxes</span>
                                                        <span className="sub-label">1 pair/box</span>
                                                    </div>
                                                    <div className="cl-dropdown-col">
                                                        <select className="cl-select" disabled={!specRightSelected} value={1}>
                                                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="cl-dropdown-col">
                                                        <select className="cl-select" disabled={!specLeftSelected} value={1}>
                                                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {spectaclesPowerOption === 'later' && (
                                        <div className="cl-submit-later-banner spectacles-banner animate-in">
                                            <div className="banner-left">
                                                <h3>Don't worry! <FaPhoneAlt className="phone-icon-cl" /></h3>
                                                <p>We will call you to get your power!</p>
                                            </div>
                                            <div className="banner-right">
                                                <div className="lens-graphic-pair">
                                                    <div className="lens-graphic positive">
                                                        <span>+</span>
                                                        <div className="lens-shape"></div>
                                                    </div>
                                                    <div className="lens-graphic negative">
                                                        <span>-</span>
                                                        <div className="lens-shape"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h2 className="modal-title-small">Select Lens Material</h2>
                                    <div className="material-grid">
                                        <label className={selectedMaterial === 'Metal' ? 'active' : ''}><input type="radio" name="material" checked={selectedMaterial === 'Metal'} onChange={() => setSelectedMaterial('Metal')} /> <span>Metal</span></label>
                                        <label className={selectedMaterial === 'Stainless Steel' ? 'active' : ''}><input type="radio" name="material" checked={selectedMaterial === 'Stainless Steel'} onChange={() => setSelectedMaterial('Stainless Steel')} /> <span>Stainless Steel</span></label>
                                        <label className={selectedMaterial === 'TR90' ? 'active' : ''}><input type="radio" name="material" checked={selectedMaterial === 'TR90'} onChange={() => setSelectedMaterial('TR90')} /> <span>TR90 <span className="recommended">Recommended</span></span></label>
                                        <label className={selectedMaterial === 'Mixed Material' ? 'active' : ''}><input type="radio" name="material" checked={selectedMaterial === 'Mixed Material'} onChange={() => setSelectedMaterial('Mixed Material')} /> <span>Mixed Material</span></label>
                                        <label className={selectedMaterial === 'Titanium' ? 'active' : ''}><input type="radio" name="material" checked={selectedMaterial === 'Titanium'} onChange={() => setSelectedMaterial('Titanium')} /> <span>Titanium</span></label>
                                    </div>

                                    <h2 className="modal-title-small">Select Frame Style</h2>
                                    <div className="material-grid">
                                        <label className={selectedFrameStyle === 'Rimmed' ? 'active' : ''}><input type="radio" name="f-style" checked={selectedFrameStyle === 'Rimmed'} onChange={() => setSelectedFrameStyle('Rimmed')} /> <span>Rimmed</span></label>
                                        <label className={selectedFrameStyle === 'Semi - Rimmed' ? 'active' : ''}><input type="radio" name="f-style" checked={selectedFrameStyle === 'Semi - Rimmed'} onChange={() => setSelectedFrameStyle('Semi - Rimmed')} /> <span>Semi - Rimmed</span></label>
                                        <label className={selectedFrameStyle === 'Rimless' ? 'active' : ''}><input type="radio" name="f-style" checked={selectedFrameStyle === 'Rimless'} onChange={() => setSelectedFrameStyle('Rimless')} /> <span>Rimless</span></label>
                                    </div>
                                </>
                            )}

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

                            {product.category === 'Reading Glasses' ? (
                                <div className="reading-modal-section">
                                    <ReadingGlassesPowerSelector 
                                        onPowerSelected={(power) => setReadingPower(power)}
                                    />
                                </div>
                            ) : (
                                <div className="prescription-section">
                                    {product.category === 'Spectacles' && spectaclesPowerOption === 'manual' || product.category !== 'Spectacles' ? (
                                        <>
                                            <h2 className="modal-title-small">Power Options - Eye Selection</h2>
                                            <div className="prescription-toggle-container">
                                                <div className={`p-toggle-item ${prescriptionType === 'Same power for both eyes' ? 'active' : ''}`} onClick={() => handlePrescriptionTypeChange('Same power for both eyes')}>
                                                    <div className="p-radio-circle"></div>
                                                    <span>Same power for both eyes</span>
                                                </div>
                                                <div className={`p-toggle-item ${prescriptionType === 'Different power for each eye' ? 'active' : ''}`} onClick={() => handlePrescriptionTypeChange('Different power for each eye')}>
                                                    <div className="p-radio-circle"></div>
                                                    <span>Different power for each eye</span>
                                                </div>
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
                                                                    <div className="p-row"><span>SPH</span><select value={prescription.right.sph} onChange={(e) => handlePrescriptionChange('right', 'sph', e.target.value)}><option>-0.50</option><option>0.00</option><option>+0.50</option></select></div>
                                                                    <div className="p-row"><span>CYL</span><select value={prescription.right.cyl} onChange={(e) => handlePrescriptionChange('right', 'cyl', e.target.value)}><option>----</option><option>-0.25</option></select></div>
                                                                    <div className="p-row"><span>AXIS</span><select value={prescription.right.axis} onChange={(e) => handlePrescriptionChange('right', 'axis', e.target.value)}><option>----</option><option>90</option><option>180</option></select></div>
                                                                    <div className="p-row"><span>ADD</span><select value={prescription.right.add} onChange={(e) => handlePrescriptionChange('right', 'add', e.target.value)}><option>----</option><option>+1.00</option></select></div>
                                                                </td>
                                                                <td>
                                                                    <div className="p-row"><span>SPH</span><select value={prescription.left.sph} onChange={(e) => handlePrescriptionChange('left', 'sph', e.target.value)}><option>-0.50</option><option>0.00</option><option>+0.50</option></select></div>
                                                                    <div className="p-row"><span>CYL</span><select value={prescription.left.cyl} onChange={(e) => handlePrescriptionChange('left', 'cyl', e.target.value)}><option>----</option><option>-0.25</option></select></div>
                                                                    <div className="p-row"><span>AXIS</span><select value={prescription.left.axis} onChange={(e) => handlePrescriptionChange('left', 'axis', e.target.value)}><option>----</option><option>90</option><option>180</option></select></div>
                                                                    <div className="p-row"><span>ADD</span><select value={prescription.left.add} onChange={(e) => handlePrescriptionChange('left', 'add', e.target.value)}><option>----</option><option>+1.00</option></select></div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <button 
                                                        className="save-btn-green" 
                                                        onClick={handleSavePrescription}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="power-later-placeholder">
                                            <p>Prescription details will be collected after order placement.</p>
                                        </div>
                                    )}
                                </div>
                            )}

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
                        </>
                    )}

                    <div className="price-summary-box">
                        <div className="p-line"><span>Frame Price:</span> <span>{product.price}</span></div>
                        <div className="p-line"><span>Lens Price:</span> <span>{product.category === 'Spectacles' ? `₹${lensPackages.find(p => p.id === selectedPackage)?.price || 0}` : '₹0'}</span></div>
                        <div className="p-line"><span>Add-ons:</span> <span>₹{selectedEnhancements.reduce((sum, e) => sum + (parseInt(e.price || 0)), 0)}</span></div>
                        <div className="p-total-line"><span>Total Price:</span> <span>{calculateTotalPrice()}</span></div>
                    </div>

                    <div className="modal-footer-btns">
                        <button 
                            className={`modal-add-cart ${product.stock !== undefined && product.stock <= 0 ? 'disabled' : ''}`} 
                            disabled={product.stock !== undefined && product.stock <= 0}
                            onClick={async () => {
                                const success = await handleInternalAddToCart();
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
                            onClick={async () => {
                                const success = await handleInternalAddToCart();
                                if (success) {
                                    onClose();
                                    navigate('/checkout');
                                }
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Submodal for Power Selection */}
            {showPowerSelectorModal && (
                <div className="cl-power-submodal-overlay" onClick={() => setShowPowerSelectorModal(null)}>
                    <div className="cl-power-submodal reveal-bottom" onClick={e => e.stopPropagation()}>
                        <div className="submodal-header">
                            <h3>Spherical • {showPowerSelectorModal === 'right' ? 'Right' : 'Left'} Eye</h3>
                            <button className="submodal-close" onClick={() => setShowPowerSelectorModal(null)}>✕</button>
                        </div>
                        
                        <div className="submodal-powers-container">
                            <div className="powers-col negative-col">
                                <div className="col-header">(-) Negative</div>
                                <div className="powers-list">
                                    {['-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00'].map(p => (
                                        <label className="power-option" key={p}>
                                            <input type="radio" name={`${showPowerSelectorModal}-power`} 
                                                checked={(showPowerSelectorModal === 'right' ? clRightSph : clLeftSph) === p}
                                                onChange={() => {
                                                    if (showPowerSelectorModal === 'right') setClRightSph(p);
                                                    else if (showPowerSelectorModal === 'left') setClLeftSph(p);
                                                    else if (showPowerSelectorModal === 'spec-right') setSpecRightSph(p);
                                                    else if (showPowerSelectorModal === 'spec-left') setSpecLeftSph(p);
                                                    setShowPowerSelectorModal(null);
                                                }}
                                            /> 
                                            <span className="power-radio"></span>
                                            {p}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="powers-col positive-col">
                                <div className="col-header">(+) Positive</div>
                                <div className="powers-list">
                                    {['0.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75'].map(p => (
                                        <label className="power-option" key={p}>
                                            <input type="radio" name={`${showPowerSelectorModal}-power`} 
                                                checked={((showPowerSelectorModal === 'right' ? clRightSph : (showPowerSelectorModal === 'left' ? clLeftSph : (showPowerSelectorModal === 'spec-right' ? specRightSph : specLeftSph)))) === p}
                                                onChange={() => {
                                                    if (showPowerSelectorModal === 'right') setClRightSph(p);
                                                    else if (showPowerSelectorModal === 'left') setClLeftSph(p);
                                                    else if (showPowerSelectorModal === 'spec-right') setSpecRightSph(p);
                                                    else if (showPowerSelectorModal === 'spec-left') setSpecLeftSph(p);
                                                    setShowPowerSelectorModal(null);
                                                }}
                                            /> 
                                            <span className="power-radio"></span>
                                            {p}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    , document.body);
};

export default LensSelectionModal;
