import React, { useState, useRef } from 'react';
import './ImageZoom.css';

const ImageZoom = ({ src, alt, zoomScale = 2 }) => {
    const [showZoom, setShowZoom] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);

    const handleMouseEnter = () => setShowZoom(true);
    const handleMouseLeave = () => setShowZoom(false);

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;

        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to image in percentage
        let x = ((e.pageX - left - window.scrollX) / width) * 100;
        let y = ((e.pageY - top - window.scrollY) / height) * 100;

        // Constraint check
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        setPosition({ x, y });
        setCursorPos({ x: e.pageX - left - window.scrollX, y: e.pageY - top - window.scrollY });
    };

    return (
        <div 
            className="zoom-container" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            onMouseMove={handleMouseMove}
        >
            <img 
                ref={imgRef}
                src={src} 
                alt={alt} 
                className={`base-image ${showZoom ? 'zoomed' : ''}`}
                draggable="false"
                style={{
                    transform: showZoom ? `scale(${zoomScale})` : 'scale(1)',
                    transformOrigin: `${position.x}% ${position.y}%`
                }}
            />
            {!showZoom && <div className="zoom-hint">Hover to Zoom</div>}
        </div>
    );
};

export default ImageZoom;
