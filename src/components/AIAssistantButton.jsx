import { useState } from 'react';
import './AIAssistantButton.css';

const AIAssistantButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
        // TODO: Add AI assistant functionality here
        console.log('AI Assistant clicked');
    };

    return (
        <div className="ai-assistant-container">
            <button
                className="ai-assistant-button"
                onClick={handleClick}
                aria-label="Open AI Assistant"
            >
                <div className="ai-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
                        <path d="M2 17L12 22L22 17" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M2 12L12 17L22 12" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="7" r="1.5" fill="white" />
                        <circle cx="7" cy="9.5" r="1" fill="white" opacity="0.8" />
                        <circle cx="17" cy="9.5" r="1" fill="white" opacity="0.8" />
                        <defs>
                            <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#8B5CF6" />
                                <stop offset="1" stopColor="#3B82F6" />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="2" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#3B82F6" />
                                <stop offset="1" stopColor="#8B5CF6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <span className="ai-text">My AI</span>
            </button>

            {isOpen && (
                <div className="ai-tooltip">
                    AI Assistant coming soon!
                </div>
            )}
        </div>
    );
};

export default AIAssistantButton;
