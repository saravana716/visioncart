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
    const [clPowerTab, setClPowerTab] = useState('negative');

    const contactLensPacks = [
        { id: '3-lens-box', name: 'Standard Pack', price: 299, oldPrice: 364, description: '3 lens/box', features: 'Daily Wear Comfort', color: '#001f54' },
        { id: '6-lens-box', name: 'Value Pack', price: 549, oldPrice: 728, description: '6 lens/box', features: 'Maximum hydration', color: '#00d285' }
    ];
    const [selectedClPack, setSelectedClPack] = useState('3-lens-box');
    const [spectaclesPowerOption, setSpectaclesPowerOption] = useState('later');
    const [specRightSelected, setSpecRightSelected] = useState(true);
    const [specLeftSelected, setSpecLeftSelected] = useState(true);

    useEffect(() => {
        const handleCloseAll = () => {
            if (isOpen) onClose();
        };
        window.addEventListener('close-all-modals', handleCloseAll);
        return () => window.removeEventListener('close-all-modals', handleCloseAll);
    }, [isOpen, onClose]);

    // Prescription Value Arrays
    const sphValues = [
        'Select',
        ...Array.from({ length: 52 }, (_, i) => (-13.00 + i * 0.25).toFixed(2)),
        '0.00',
        ...Array.from({ length: 32 }, (_, i) => `+${(0.25 + i * 0.25).toFixed(2)}`)
    ];
    const cylValues = [
        'Select',
        ...Array.from({ length: 24 }, (_, i) => (-6.00 + i * 0.25).toFixed(2)),
        '0.00',
        ...Array.from({ length: 24 }, (_, i) => `+${(0.25 + i * 0.25).toFixed(2)}`)
    ];
    const axisValues = ['Select', ...Array.from({ length: 181 }, (_, i) => i.toString())];
    const addValues = ['Select', ...Array.from({ length: 12 }, (_, i) => `+${(0.75 + i * 0.25).toFixed(2)}`)];

    const [prescriptionType, setPrescriptionType] = useState('Same power for both eyes');
    const [selectedEnhancements, setSelectedEnhancements] = useState([]);
    const [prescription, setPrescription] = useState({
        right: { sph: 'Select', cyl: 'Select', axis: 'Select', add: 'Select' },
        left: { sph: 'Select', cyl: 'Select', axis: 'Select', add: 'Select' }
    });
    const [readingPower, setReadingPower] = useState({ rightPower: '', leftPower: '', sameForBoth: true });
    
    // New Multi-Step Manual Prescription State
    const [manualStep, setManualStep] = useState('table'); // 'table' or 'info'
    const [userInfo, setUserInfo] = useState({ name: '', phone: '', file: null, fileName: '' });

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
        
        if (product.category === 'Spectacles') {
            return `₹${basePriceInt + extras}`;
        }
        
        return `₹${basePriceInt + extras}`;
    };

    const handlePrescriptionTypeChange = (type) => {
        setPrescriptionType(type);
        if (type === 'Same power for both eyes') {
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
        
        if (isReadingGlasses && (!readingPower.rightPower || (!readingPower.sameForBoth && !readingPower.leftPower))) {
            const { default: toast } = await import('react-hot-toast');
            toast.error('Please select power for your eyes');
            return false;
        }

        if (isSpectacles && spectaclesPowerOption === 'manual') {
            if (specRightSelected && !specRightSph) {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Please select Spherical power for Right eye');
                return false;
            }
            if (specLeftSelected && !specLeftSph) {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Please select Spherical power for Left eye');
                return false;
            }
            if (!specRightSelected && !specLeftSelected) {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Please select at least one eye');
                return false;
            }
        }

        if (isContactLens && contactLensPowerOption === 'manual') {
            if (clRightEyeSelected && !clRightSph) {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Please select Spherical power for Right eye');
                return false;
            }
            if (clLeftEyeSelected && !clLeftSph) {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Please select Spherical power for Left eye');
                return false;
            }
            if (!clRightEyeSelected && !clLeftEyeSelected) {
                const { default: toast } = await import('react-hot-toast');
                toast.error('Please select at least one eye');
                return false;
            }
        }

        const specifications = [
            ...(product.technicalSpecs || []),
            { label: 'Size', value: product.size || 'Standard' }
        ];

        if (isContactLens) {
            const pack = contactLensPacks.find(p => p.id === selectedClPack);
            specifications.push(
                { label: 'Lens Type', value: 'Contact Lens' },
                { label: 'Box Qty (R)', value: clRightEyeSelected ? clRightBoxes.toString() : '0' },
                { label: 'Box Qty (L)', value: clLeftEyeSelected ? clLeftBoxes.toString() : '0' },
                { label: 'Pack Type', value: pack?.name || 'Standard' }
            );
        } else if (isReadingGlasses) {
            specifications.push(
                { label: 'Lens', value: 'Reading Glass' },
                { label: 'Right Eye Power', value: readingPower.rightPower },
                { label: 'Left Eye Power', value: readingPower.sameForBoth ? readingPower.rightPower : readingPower.leftPower }
            );
        } else if (isSpectacles) {
            specifications.push(
                { label: 'Lens Type', value: selectedLensType },
                { label: 'Usage', value: selectedUsage }
            );
        } else {
            specifications.push(
                { label: 'Lens Type', value: selectedLensType },
                { label: 'Usage', value: selectedUsage }
            );
        }

        const cartData = {
            productId: product.id,
            productBrand: product.brand,
            productName: product.title,
            productImage: product.mainImage,
            productPrice: product.price,
            productSize: product.size || 'Medium',
            category: product.category,
            specifications: specifications,
            totalPrice: calculateTotalPrice(),
            sku: product.technicalSpecs?.find(s => s.label === 'SKU Code')?.value || product.id,
            enhancements: isReadingGlasses || isContactLens ? [] : selectedEnhancements,
            lensType: isContactLens ? 'Contact Lens' : (isReadingGlasses ? 'Reading Glass' : selectedLensType),
            usage: selectedUsage,
            prescriptionType: isReadingGlasses ? 'Reading Glass Power' : (isContactLens ? (contactLensPowerOption === 'manual' ? 'Manual Contact Lens Power' : 'Submit Later') : (isSpectacles ? (spectaclesPowerOption === 'manual' ? 'Manual Prescription' : 'Submit Later') : prescriptionType)),
            patientDetails: (isSpectacles && spectaclesPowerOption === 'manual') ? {
                name: userInfo.name,
                phone: userInfo.phone,
                prescriptionFile: userInfo.fileName
            } : null,
            prescription: isContactLens ? {
                rightSelected: clRightEyeSelected,
                leftSelected: clLeftEyeSelected,
                rightPower: clRightSph || null,
                leftPower: clLeftSph || null,
                rightBoxes: clRightBoxes,
                leftBoxes: clLeftBoxes,
                pack: contactLensPacks.find(p => p.id === selectedClPack)
            } : (isReadingGlasses ? { readingPower } : (isSpectacles ? {
                ...prescription,
                userInfo: (spectaclesPowerOption === 'manual') ? userInfo : null
            } : prescription))
        };
        
        return await addItemToCart(cartData);
    };

    const handleSavePrescription = () => {
        setManualStep('info');
        import('react-hot-toast').then(({ default: toast }) => {
            toast.success('Power saved. Please provide user details.', {
                style: { borderRadius: '10px', background: '#001f54', color: '#fff', fontWeight: '700', fontSize: '14px' },
                iconTheme: { primary: '#00d285', secondary: '#fff' }
            });
        });
    };

    const handleUserInfoSubmit = async (onCartSuccess) => {
        if (!userInfo.name || !userInfo.phone) {
            const { default: toast } = await import('react-hot-toast');
            toast.error('Please provide name and phone number');
            return;
        }
        
        const success = await handleInternalAddToCart();
        if (success) {
            onCartSuccess();
        }
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

                            <div className="compact-power-flow main-selector cl-power-options">
                                <div 
                                    className={`power-option-card ${contactLensPowerOption === 'manual' ? 'active' : ''}`}
                                    onClick={() => setContactLensPowerOption('manual')}
                                >
                                    <div className="power-radio"></div>
                                    <div className="power-info">
                                        <strong>Enter power Manually</strong>
                                    </div>
                                </div>
                                <div 
                                    className={`power-option-card ${contactLensPowerOption === 'later' ? 'active' : ''}`}
                                    onClick={() => setContactLensPowerOption('later')}
                                >
                                    <div className="power-radio"></div>
                                    <div className="power-info">
                                        <strong>I will submit power later</strong>
                                    </div>
                                </div>

                                {contactLensPowerOption === 'later' && (
                                    <a href="tel:+919344116571" className="cl-submit-later-banner spectacles-banner animate-in" style={{ textDecoration: 'none' }}>
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
                                    </a>
                                )}

                                {contactLensPowerOption === 'manual' && (
                                    <div className="cl-manual-power-grid animate-in">
                                        <div className="eye-selection-row">
                                            <label className="cl-checkbox-label">
                                                <input 
                                                    type="checkbox" 
                                                    checked={clRightEyeSelected} 
                                                    onChange={(e) => setClRightEyeSelected(e.target.checked)} 
                                                /> 
                                                <span className="custom-checkmark">✓</span>
                                                RIGHT (OD)
                                            </label>
                                            <label className="cl-checkbox-label">
                                                <input 
                                                    type="checkbox" 
                                                    checked={clLeftEyeSelected} 
                                                    onChange={(e) => setClLeftEyeSelected(e.target.checked)} 
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

                                        <div className="cl-power-row">
                                            <div className="cl-row-label">
                                                <span className="main-label">No. of Boxes</span>
                                                <span className="sub-label">3 lens / box</span>
                                            </div>
                                            <div className="cl-dropdown-col">
                                                <select className="cl-select-premium" disabled={!clRightEyeSelected} value={clRightBoxes} onChange={e => setClRightBoxes(parseInt(e.target.value))}>
                                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </div>
                                            <div className="cl-dropdown-col">
                                                <select className="cl-select-premium" disabled={!clLeftEyeSelected} value={clLeftBoxes} onChange={e => setClLeftBoxes(parseInt(e.target.value))}>
                                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                 {/* <div className={`lens-type-item ${selectedLensType === 'Anti-Power' ? 'active' : ''}`} onClick={() => setSelectedLensType('Anti-Power')}>
                                    <div className="icon">⚙️</div>
                                    <p>Anti-Power</p>
                                    <span>Fashion Lenses</span>
                                </div> */}
                            </div>

                            {(product.category === 'Spectacles' || product.category === 'Computer Glasses' || product.category === 'Kids Collection') ? (
                                <>
                                    <div className="cl-power-type-container">
                                        <div className="cl-power-desc">
                                            <span className="p-label">Power</span>
                                            <span className="p-label">Type</span>
                                        </div>
                                        <button className="cl-power-btn active">With Power</button>
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
                                                manualStep === 'table' ? (
                                                    <div className="prescription-input-area">
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

                                                        <h3>Prescription Input Table</h3>
                                                        <div className="prescription-table-wrapper">
                                                            <table className="prescription-table">
                                                                <thead>
                                                                    <tr><th>Right Eye</th><th>Left Eye</th></tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="p-row"><span>SPH</span><select value={prescription.right.sph} onChange={(e) => handlePrescriptionChange('right', 'sph', e.target.value)}>{sphValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>CYL</span><select value={prescription.right.cyl} onChange={(e) => handlePrescriptionChange('right', 'cyl', e.target.value)}>{cylValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>AXIS</span><input type="text" placeholder="0-180" maxLength="3" value={prescription.right.axis === 'Select' ? '' : prescription.right.axis} onChange={(e) => handlePrescriptionChange('right', 'axis', e.target.value)} /></div>
                                                                            {(selectedLensType === 'Progressive' || selectedLensType === 'Bifocal') && (
                                                                                <div className="p-row"><span>ADD</span><input type="text" placeholder="+0.00" maxLength="5" value={prescription.right.add === 'Select' ? '' : prescription.right.add} onChange={(e) => handlePrescriptionChange('right', 'add', e.target.value)} /></div>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <div className="p-row"><span>SPH</span><select value={prescription.left.sph} onChange={(e) => handlePrescriptionChange('left', 'sph', e.target.value)}>{sphValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>CYL</span><select value={prescription.left.cyl} onChange={(e) => handlePrescriptionChange('left', 'cyl', e.target.value)}>{cylValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>AXIS</span><input type="text" placeholder="0-180" maxLength="3" value={prescription.left.axis === 'Select' ? '' : prescription.left.axis} onChange={(e) => handlePrescriptionChange('left', 'axis', e.target.value)} /></div>
                                                                            {(selectedLensType === 'Progressive' || selectedLensType === 'Bifocal') && (
                                                                                <div className="p-row"><span>ADD</span><input type="text" placeholder="+0.00" maxLength="5" value={prescription.left.add === 'Select' ? '' : prescription.left.add} onChange={(e) => handlePrescriptionChange('left', 'add', e.target.value)} /></div>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <button className="save-btn-green" onClick={handleSavePrescription}>Save</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="manual-user-details animate-in">
                                                        <div className="details-header">Whose prescription is this</div>
                                                        <div className="details-form">
                                                            <div className="detail-input-group">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Name *" 
                                                                    value={userInfo.name} 
                                                                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} 
                                                                />
                                                            </div>
                                                            <div className="detail-input-group">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Phone Number *" 
                                                                    value={userInfo.phone} 
                                                                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} 
                                                                />
                                                            </div>
                                                            <div className="cant-find-power">
                                                                <p>Can't find your power, Call <a href="tel:+918470007367">+91 8470007367</a></p>
                                                            </div>
                                                            <div className="prescription-upload-area">
                                                                <label className="upload-box">
                                                                    <input 
                                                                        type="file" 
                                                                        accept="image/*" 
                                                                        onChange={(e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) setUserInfo({...userInfo, file, fileName: file.name});
                                                                        }} 
                                                                    />
                                                                    <div className="upload-content">
                                                                        <div className="upload-icon">📷</div>
                                                                        <p>{userInfo.fileName || 'Upload Prescription (Optional)'}</p>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            <button 
                                                                className="save-proceed-btn" 
                                                                onClick={() => handleUserInfoSubmit(() => {
                                                                    onClose(); 
                                                                    setDrawerTab('cart'); 
                                                                    setCartOpen(true);
                                                                })}
                                                            >
                                                                Save & Proceed
                                                            </button>
                                                            <button className="back-to-table" onClick={() => setManualStep('table')}>Back to Power Table</button>
                                                        </div>
                                                    </div>
                                                    )
                                        )}

                                        {spectaclesPowerOption === 'later' && (
                                            <div className="spec-manual-power-entry animate-in">
                                                <a href="tel:+919344116571" className="cl-submit-later-banner spectacles-banner animate-in" style={{ textDecoration: 'none' }}>
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
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : null}

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
                                    <ReadingGlassesPowerSelector onPowerSelected={(power) => setReadingPower(power)} />
                                </div>
                            ) : (
                                (product.category !== 'Spectacles' && product.category !== 'Computer Glasses' && product.category !== 'Kids Collection') && (
                                        <div className="prescription-section">
                                            <div className="prescription-input-area">
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

                                                <h3>Prescription Input Table</h3>
                                                <div className="prescription-table-wrapper">
                                                    {manualStep === 'table' ? (
                                                        <>
                                                            <table className="prescription-table">
                                                                <thead>
                                                                    <tr><th>Right Eye</th><th>Left Eye</th></tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <div className="p-row"><span>SPH</span><select value={prescription.right.sph} onChange={(e) => handlePrescriptionChange('right', 'sph', e.target.value)}>{sphValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>CYL</span><select value={prescription.right.cyl} onChange={(e) => handlePrescriptionChange('right', 'cyl', e.target.value)}>{cylValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>AXIS</span><input type="text" placeholder="0-180" maxLength="3" value={prescription.right.axis === 'Select' ? '' : prescription.right.axis} onChange={(e) => handlePrescriptionChange('right', 'axis', e.target.value)} /></div>
                                                                            {(selectedLensType === 'Progressive' || selectedLensType === 'Bifocal') && (
                                                                                <div className="p-row"><span>ADD</span><input type="text" placeholder="+0.00" maxLength="5" value={prescription.right.add === 'Select' ? '' : prescription.right.add} onChange={(e) => handlePrescriptionChange('right', 'add', e.target.value)} /></div>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <div className="p-row"><span>SPH</span><select value={prescription.left.sph} onChange={(e) => handlePrescriptionChange('left', 'sph', e.target.value)}>{sphValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>CYL</span><select value={prescription.left.cyl} onChange={(e) => handlePrescriptionChange('left', 'cyl', e.target.value)}>{cylValues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                                                            <div className="p-row"><span>AXIS</span><input type="text" placeholder="0-180" maxLength="3" value={prescription.left.axis === 'Select' ? '' : prescription.left.axis} onChange={(e) => handlePrescriptionChange('left', 'axis', e.target.value)} /></div>
                                                                            {(selectedLensType === 'Progressive' || selectedLensType === 'Bifocal') && (
                                                                                <div className="p-row"><span>ADD</span><input type="text" placeholder="+0.00" maxLength="5" value={prescription.left.add === 'Select' ? '' : prescription.left.add} onChange={(e) => handlePrescriptionChange('left', 'add', e.target.value)} /></div>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <button className="save-btn-green" onClick={handleSavePrescription}>Save</button>
                                                        </>
                                                    ) : (
                                                        <div className="manual-user-details animate-in">
                                                            <div className="details-header">Whose prescription is this</div>
                                                            <div className="details-form">
                                                                <div className="detail-input-group">
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="Name *" 
                                                                        value={userInfo.name} 
                                                                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} 
                                                                    />
                                                                </div>
                                                                <div className="detail-input-group">
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="Phone Number *" 
                                                                        value={userInfo.phone} 
                                                                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} 
                                                                    />
                                                                </div>
                                                                <div className="cant-find-power">
                                                                    <p>Can't find your power, Call <a href="tel:+918470007367">+91 8470007367</a></p>
                                                                </div>
                                                                <div className="prescription-upload-area">
                                                                    <label className="upload-box">
                                                                        <input 
                                                                            type="file" 
                                                                            accept="image/*" 
                                                                            onChange={(e) => {
                                                                                const file = e.target.files[0];
                                                                                if (file) setUserInfo({...userInfo, file, fileName: file.name});
                                                                            }} 
                                                                        />
                                                                        <div className="upload-content">
                                                                            <div className="upload-icon">📷</div>
                                                                            <p>{userInfo.fileName || 'Upload Prescription (Optional)'}</p>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                                <button 
                                                                    className="save-proceed-btn" 
                                                                    onClick={() => handleUserInfoSubmit(() => {
                                                                        onClose(); 
                                                                        setDrawerTab('cart'); 
                                                                        setCartOpen(true);
                                                                    })}
                                                                >
                                                                    Save & Proceed
                                                                </button>
                                                                <button className="back-to-table" onClick={() => setManualStep('table')}>Back to Power Table</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}

                            <h2 className="modal-title-small">How will you use these glasses?</h2>
                            <div className="usage-grid">
                                {['Everyday', 'Computer | Screen', 'Reading', 'Driving'].map((u, i) => (
                                    <div key={u} className={`usage-item ${selectedUsage === u ? 'active' : ''}`} onClick={() => setSelectedUsage(u)}>
                                        <div className="usage-box">
                                            <span className="usage-emoji">{['🏠', '💻', '📚', '🚗'][i]}</span>
                                        </div>
                                        <p>{u === 'Computer | Screen' ? 'Digital Use' : u}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="price-summary-box">
                        <div className="p-line"><span>Frame Price:</span> <span>{product.price}</span></div>
                        {product.category === 'Spectacles' && (
                            <div className="p-line"><span>{selectedLensType} Lens:</span> <span>₹0</span></div>
                        )}
                        {product.category === 'Contact Lenses' && (
                            <div className="p-line"><span>{contactLensPacks.find(p => p.id === selectedClPack)?.name} ({(clRightEyeSelected ? clRightBoxes : 0) + (clLeftEyeSelected ? clLeftBoxes : 0)} Boxes):</span> <span>₹{contactLensPacks.find(p => p.id === selectedClPack)?.price} / box</span></div>
                        )}
                        <div className="p-line"><span>Add-ons:</span> <span>₹{selectedEnhancements.reduce((sum, e) => sum + (parseInt(e.price || 0)), 0)}</span></div>
                        <div className="p-total-line"><span>Total Price:</span> <span>{calculateTotalPrice()}</span></div>
                    </div>

                    <div className="modal-footer-btns">
                        <button 
                            className={`modal-add-cart ${product.stock !== undefined && product.stock <= 0 ? 'disabled' : ''}`} 
                            disabled={product.stock !== undefined && product.stock <= 0}
                            onClick={async () => {
                                const success = await handleInternalAddToCart();
                                if (success) { onClose(); setDrawerTab('cart'); setCartOpen(true); }
                            }}
                        >Add to Cart</button>
                        <button 
                            className={`modal-buy-now ${product.stock !== undefined && product.stock <= 0 ? 'disabled' : ''}`} 
                            disabled={product.stock !== undefined && product.stock <= 0}
                            onClick={async () => {
                                const success = await handleInternalAddToCart();
                                if (success) { onClose(); navigate('/checkout'); }
                            }}
                        >Buy Now</button>
                    </div>
                </div>
            </div>

            {showPowerSelectorModal && (
                <div className="cl-power-submodal-overlay" onClick={() => setShowPowerSelectorModal(null)}>
                    <div className="cl-power-submodal reveal-bottom" onClick={e => e.stopPropagation()}>
                        <div className="submodal-header">
                            <h3>Spherical • {showPowerSelectorModal.includes('right') ? 'Right' : 'Left'} Eye</h3>
                            <button className="submodal-close" onClick={() => setShowPowerSelectorModal(null)}>✕</button>
                        </div>
                        <div className="cl-power-tabs-mobile">
                            <button className={`cl-tab ${clPowerTab === 'negative' ? 'active' : ''}`} onClick={() => setClPowerTab('negative')}>(-) Negative</button>
                            <button className={`cl-tab ${clPowerTab === 'positive' ? 'active' : ''}`} onClick={() => setClPowerTab('positive')}>(+) Positive</button>
                        </div>
                        <div className="submodal-powers-container">
                            <div className={`powers-col negative-col ${clPowerTab === 'negative' ? 'show-mobile' : 'hide-mobile'}`}>
                                <div className="col-header">(-) Negative</div>
                                <div className="powers-list">
                                    {['-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00'].map(p => (
                                        <label className="power-option" key={p}>
                                            <input type="radio" name={`${showPowerSelectorModal}-power`} 
                                                checked={(showPowerSelectorModal === 'right' ? clRightSph : (showPowerSelectorModal === 'left' ? clLeftSph : (showPowerSelectorModal === 'spec-right' ? prescription.right.sph : prescription.left.sph))) === p}
                                                onChange={() => {
                                                    if (showPowerSelectorModal === 'right') setClRightSph(p);
                                                    else if (showPowerSelectorModal === 'left') setClLeftSph(p);
                                                    else if (showPowerSelectorModal === 'spec-right') handlePrescriptionChange('right', 'sph', p);
                                                    else if (showPowerSelectorModal === 'spec-left') handlePrescriptionChange('left', 'sph', p);
                                                    setShowPowerSelectorModal(null);
                                                }}
                                            /> 
                                            <span className="power-radio"></span> {p}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={`powers-col positive-col ${clPowerTab === 'positive' ? 'show-mobile' : 'hide-mobile'}`}>
                                <div className="col-header">(+) Positive</div>
                                <div className="powers-list">
                                    {['0.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75'].map(p => (
                                        <label className="power-option" key={p}>
                                            <input type="radio" name={`${showPowerSelectorModal}-power`} 
                                                checked={(showPowerSelectorModal === 'right' ? clRightSph : (showPowerSelectorModal === 'left' ? clLeftSph : (showPowerSelectorModal === 'spec-right' ? prescription.right.sph : prescription.left.sph))) === p}
                                                onChange={() => {
                                                    if (showPowerSelectorModal === 'right') setClRightSph(p);
                                                    else if (showPowerSelectorModal === 'left') setClLeftSph(p);
                                                    else if (showPowerSelectorModal === 'spec-right') handlePrescriptionChange('right', 'sph', p);
                                                    else if (showPowerSelectorModal === 'spec-left') handlePrescriptionChange('left', 'sph', p);
                                                    setShowPowerSelectorModal(null);
                                                }}
                                            /> 
                                            <span className="power-radio"></span> {p}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default LensSelectionModal;
