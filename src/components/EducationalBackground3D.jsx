import React from 'react';
import './EducationalBackground3D.css';

const EducationalBackground3D = () => {
    return (
        <div className="educational-bg-3d">
            {/* Floating Books */}
            <div className="floating-element book book-1">
                <div className="book-cover"></div>
                <div className="book-spine"></div>
            </div>
            <div className="floating-element book book-2">
                <div className="book-cover"></div>
                <div className="book-spine"></div>
            </div>
            <div className="floating-element book book-3">
                <div className="book-cover"></div>
                <div className="book-spine"></div>
            </div>

            {/* Graduation Caps */}
            <div className="floating-element grad-cap cap-1">
                <div className="cap-top"></div>
                <div className="cap-tassel"></div>
            </div>
            <div className="floating-element grad-cap cap-2">
                <div className="cap-top"></div>
                <div className="cap-tassel"></div>
            </div>

            {/* Atoms/Molecules */}
            <div className="floating-element atom atom-1">
                <div className="nucleus"></div>
                <div className="orbit orbit-1"></div>
                <div className="orbit orbit-2"></div>
                <div className="orbit orbit-3"></div>
            </div>
            <div className="floating-element atom atom-2">
                <div className="nucleus"></div>
                <div className="orbit orbit-1"></div>
                <div className="orbit orbit-2"></div>
            </div>

            {/* Light Bulbs (Ideas) */}
            <div className="floating-element lightbulb bulb-1">
                <div className="bulb-glass"></div>
                <div className="bulb-base"></div>
                <div className="bulb-glow"></div>
            </div>
            <div className="floating-element lightbulb bulb-2">
                <div className="bulb-glass"></div>
                <div className="bulb-base"></div>
                <div className="bulb-glow"></div>
            </div>

            {/* Mathematical Symbols */}
            <div className="floating-element math-symbol symbol-1">π</div>
            <div className="floating-element math-symbol symbol-2">∑</div>
            <div className="floating-element math-symbol symbol-3">∞</div>
            <div className="floating-element math-symbol symbol-4">√</div>

            {/* Geometric Shapes */}
            <div className="floating-element geo-shape cube-1">
                <div className="cube-face front"></div>
                <div className="cube-face back"></div>
                <div className="cube-face left"></div>
                <div className="cube-face right"></div>
                <div className="cube-face top"></div>
                <div className="cube-face bottom"></div>
            </div>
            <div className="floating-element geo-shape pyramid-1">
                <div className="pyramid-face base"></div>
                <div className="pyramid-face side1"></div>
                <div className="pyramid-face side2"></div>
                <div className="pyramid-face side3"></div>
                <div className="pyramid-face side4"></div>
            </div>

            {/* Particles */}
            {[...Array(20)].map((_, i) => (
                <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
        </div>
    );
};

export default EducationalBackground3D;
