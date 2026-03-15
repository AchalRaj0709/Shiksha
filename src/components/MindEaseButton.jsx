import { useState } from 'react';
import './MindEaseButton.css';

const MindEaseButton = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        // Navigate to MindEase mental health module using environment variable or fallback to local
        const mentalHealthUrl = import.meta.env.VITE_MENTAL_HEALTH_URL || 'http://localhost:3001';
        window.location.href = `${mentalHealthUrl}/wellbeing`;
    };

    return (
        <button
            className="mindease-button"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="MindEase - Mental Wellness"
        >
            <div className="mindease-logo-wrapper">
                <svg
                    className="mindease-logo-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Lotus/Zen Circle Design */}
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#mindease-gradient)"
                        strokeWidth="1.5"
                        fill="none"
                        className="mindease-circle"
                    />
                    <path
                        d="M12 6C12 6 9 9 9 12C9 14 10.5 15.5 12 15.5C13.5 15.5 15 14 15 12C15 9 12 6 12 6Z"
                        fill="url(#mindease-gradient)"
                        className="mindease-lotus"
                    />
                    <path
                        d="M8 12C8 12 9.5 10 12 10C14.5 10 16 12 16 12"
                        stroke="url(#mindease-gradient-2)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="mindease-wave"
                    />
                    <circle
                        cx="12"
                        cy="8"
                        r="1.5"
                        fill="url(#mindease-gradient-2)"
                        className="mindease-dot"
                    />
                    <defs>
                        <linearGradient id="mindease-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#A78BFA" />
                            <stop offset="0.5" stopColor="#7DD3FC" />
                            <stop offset="1" stopColor="#86EFAC" />
                        </linearGradient>
                        <linearGradient id="mindease-gradient-2" x1="8" y1="8" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#86EFAC" />
                            <stop offset="1" stopColor="#7DD3FC" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <span className="mindease-text">MindEase</span>
            {isHovered && (
                <div className="mindease-tooltip">
                    Mental Wellness & Meditation
                </div>
            )}
        </button>
    );
};

export default MindEaseButton;
