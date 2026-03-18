import React, { useState } from 'react';
import './ReadingGlassesPowerSelector.css';

// Age-to-power mapping for reading glasses
const AGE_POWER_TABLE = [
    { id: 1, age: '39 to 40', powers: ['+1.00'] },
    { id: 2, age: '40 to 43', powers: ['+1.00', '+1.25'] },
    { id: 3, age: '43 to 45', powers: ['+1.25', '+1.50'] },
    { id: 4, age: '45 to 47', powers: ['+1.50', '+1.75'] },
    { id: 5, age: '47 to 50', powers: ['+1.75', '+2.00'] },
    { id: 6, age: '50 to 53', powers: ['+2.00', '+2.25'] },
    { id: 7, age: '53 to 55', powers: ['+2.25', '+2.50'] },
    { id: 8, age: '55 to 57', powers: ['+2.50', '+2.75'] },
    { id: 9, age: 'Above 57', powers: ['+3.00'] },
];

const ALL_POWERS = ['+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];

const ReadingGlassesPowerSelector = ({ productImage, onPowerSelected }) => {
    const [sameForBoth, setSameForBoth] = useState(true);
    const [rightPower, setRightPower] = useState('');
    const [leftPower, setLeftPower] = useState('');
    const [selectedAge, setSelectedAge] = useState(null);
    const [showTable, setShowTable] = useState(false);

    const handleRightPowerChange = (val) => {
        setRightPower(val);
        let currentLeft = leftPower;
        if (sameForBoth) {
            currentLeft = val;
            setLeftPower(val); 
        }
        onPowerSelected?.({ rightPower: val, leftPower: currentLeft, sameForBoth });
    };

    const handleLeftPowerChange = (val) => {
        setLeftPower(val);
        onPowerSelected?.({ rightPower, leftPower: val, sameForBoth });
    };

    const handleModeChange = (isSame) => {
        setSameForBoth(isSame);
        let updatedLeft = leftPower;
        if (isSame && rightPower) {
            updatedLeft = rightPower;
            setLeftPower(rightPower);
        }
        onPowerSelected?.({ rightPower, leftPower: updatedLeft, sameForBoth: isSame });
    };

    const handleAgeSelect = (row) => {
        setSelectedAge(row.id);
        if (row.powers.length === 1) {
            handleRightPowerChange(row.powers[0]);
        }
        setShowTable(false);
    };

    const isReady = rightPower && (sameForBoth || leftPower);

    return (
        <div className="rg-selector-container">
            {/* User-friendly Header */}
            <div className="rg-header">
                <div className="rg-category-tag">Reading Glasses</div>
                <h3>Select Your Power</h3>
                <p className="rg-subtext">Choose your lens power based on age or prescription</p>
            </div>

            {/* Mode Selection with Visual Icons */}
            <div className="rg-visual-modes">
                <div 
                    className={`rg-mode-card ${sameForBoth ? 'active' : ''}`}
                    onClick={() => handleModeChange(true)}
                >
                    <div className="mode-viz">
                        <div className="eye-pair">
                            <span className="eye-icon">👁️</span>
                            <span className="eye-sync">🔗</span>
                            <span className="eye-icon">👁️</span>
                        </div>
                    </div>
                    <p>Same Power</p>
                    <span>Both Eyes</span>
                </div>
                <div 
                    className={`rg-mode-card ${!sameForBoth ? 'active' : ''}`}
                    onClick={() => handleModeChange(false)}
                >
                    <div className="mode-viz">
                        <div className="eye-pair split">
                            <span className="eye-icon">👁️</span>
                            <span className="eye-divider">|</span>
                            <span className="eye-icon">👁️</span>
                        </div>
                    </div>
                    <p>Different Power</p>
                    <span>Each Eye</span>
                </div>
            </div>

            {/* Age Guide Trigger */}
            <div className="rg-guide-wrapper">
                <button className="rg-table-trigger" onClick={() => setShowTable(!showTable)}>
                    <span className="trigger-icon">📊</span>
                    Age-to-Power Guide
                    <span className="trigger-arrow">{showTable ? '↑' : '↓'}</span>
                </button>
            </div>

            {/* Age-Power Table */}
            {showTable && (
                <div className="rg-table-container">
                    <table className="rg-guide-table">
                        <thead>
                            <tr>
                                <th>Age Group</th>
                                <th>Recommended Power</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AGE_POWER_TABLE.map((row) => (
                                <tr
                                    key={row.id}
                                    className={selectedAge === row.id ? 'active-row' : ''}
                                    onClick={() => handleAgeSelect(row)}
                                >
                                    <td>{row.age}</td>
                                    <td>
                                        {row.powers.join(' / ')}
                                        {row.powers.length > 1 && <small>*</small>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="table-disclaimer">*Choose the lower power if using for the first time</p>
                </div>
            )}

            {/* Input Section */}
            <div className="rg-inputs-section">
                {sameForBoth ? (
                    <div className="rg-input-pair single">
                        <label>Select Power (OD & OS)</label>
                        <div className="select-wrapper">
                            <select
                                value={rightPower}
                                onChange={(e) => handleRightPowerChange(e.target.value)}
                            >
                                <option value="">-- Choose Power --</option>
                                {ALL_POWERS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="rg-input-pair double">
                        <div className="eye-input">
                            <label>Right Eye (OD)</label>
                            <div className="select-wrapper">
                                <select
                                    value={rightPower}
                                    onChange={(e) => handleRightPowerChange(e.target.value)}
                                >
                                    <option value="">Power</option>
                                    {ALL_POWERS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="eye-input">
                            <label>Left Eye (OS)</label>
                            <div className="select-wrapper">
                                <select
                                    value={leftPower}
                                    onChange={(e) => handleLeftPowerChange(e.target.value)}
                                >
                                    <option value="">Power</option>
                                    {ALL_POWERS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Selection Summary */}
            {isReady && (
                <div className="rg-final-summary">
                    <div className="summary-title">Selected Power</div>
                    <div className="summary-grid">
                        <div className="s-eye"><span>OD</span> {rightPower}</div>
                        <div className="s-eye"><span>OS</span> {leftPower}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReadingGlassesPowerSelector;
