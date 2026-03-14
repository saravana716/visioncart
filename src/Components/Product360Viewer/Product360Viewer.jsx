import React, { useState, useRef, useEffect } from 'react';
import './Product360Viewer.css';
import { MdOutline360 } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

const Product360Viewer = ({ images, isOpen, onClose }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const lastRotation = useRef({ x: 0, y: 0 });

    const mainImage = images?.[0] || '';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setRotation({ x: 0, y: 0 });
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startPos.current = {
            x: e.pageX || (e.touches ? e.touches[0].pageX : 0),
            y: e.pageY || (e.touches ? e.touches[0].pageY : 0)
        };
        lastRotation.current = rotation;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const currentX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
        const currentY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
        
        const diffX = currentX - startPos.current.x;
        const diffY = currentY - startPos.current.y;
        
        // sensitivity
        const sensitivity = 0.5;
        
        setRotation({
            y: lastRotation.current.y + diffX * sensitivity,
            x: lastRotation.current.x - diffY * sensitivity
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    if (!isOpen || !mainImage) return null;

    return (
        <div className="product-360-overlay">
            <div className="product-360-modal reveal-in">
                <div className="modal-header">
                    <div className="title-area">
                        <MdOutline360 className="icon-360" />
                        <h3>3D Perspective View</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <IoCloseOutline />
                    </button>
                </div>

                <div 
                    className={`viewer-container ${isDragging ? 'grabbing' : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    <div className="perspective-wrapper">
                        <div 
                            className="image-3d-card"
                            style={{
                                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0, 0.2, 1)'
                            }}
                        >
                            <img 
                                src={mainImage} 
                                alt="Product 3D" 
                                draggable="false"
                            />
                            {/* Reflection Shimmer */}
                            <div 
                                className="shimmer-overlay"
                                style={{
                                    transform: `translateX(${-rotation.y * 2}px) translateY(${rotation.x * 2}px)`,
                                    opacity: isDragging ? 0.3 : 0.1
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="drag-helper">
                        <span className="drag-line"></span>
                        <p>Drag to Tilt & Rotate</p>
                        <span className="drag-line"></span>
                    </div>
                </div>

                <div className="interaction-info">
                    <p>Interactive 3D Perspective Experience</p>
                </div>
            </div>
        </div>
    );
};

export default Product360Viewer;
