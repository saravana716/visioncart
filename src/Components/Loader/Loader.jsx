import React from 'react';
import './Loader.css';

const Loader = ({ fullPage = false }) => {
    return (
        <div className={`vision-loader-container ${fullPage ? 'full-page' : ''}`}>
            <div className="loader-visual">
                <div className="lens-frame">
                    <div className="lens-glass left"></div>
                    <div className="lens-glass right"></div>
                    <div className="bridge"></div>
                </div>
                <div className="loader-text">
                    <span className="char">V</span>
                    <span className="char">I</span>
                    <span className="char">S</span>
                    <span className="char">I</span>
                    <span className="char">O</span>
                    <span className="char">N</span>
                    <span className="char-accent">CART</span>
                </div>
            </div>
            <div className="loading-bar-wrapper">
                <div className="loading-bar-fill"></div>
            </div>
        </div>
    );
};

export default Loader;
