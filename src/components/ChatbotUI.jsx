import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Sparkles, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatbotUI.css";

// Initialize AI Model
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    }
});

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi there! I'm Shiksha AI. How can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatSessionRef = useRef(null);

    useEffect(() => {
        if (!chatSessionRef.current) {
            chatSessionRef.current = model.startChat({ history: [] });
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            if (!chatSessionRef.current) {
                chatSessionRef.current = model.startChat({ history: [] });
            }

            const result = await chatSessionRef.current.sendMessage(userMessage);
            const responseText = result.response.text();

            const newAIMessage = {
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newAIMessage]);

        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "I'm having trouble connecting. Try again later.",
                    timestamp: new Date(),
                    isError: true
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="ai-wrapper">

            {isOpen && (
                <>
                    <div className="ai-backdrop" onClick={() => setIsOpen(false)} />

                    <div className="ai-chatbox">
                        {/* Header */}
                        <div className="ai-header">
                            <div className="ai-header-left">
                                <div className="ai-logo">
                                    <Sparkles className="ai-logo-icon" />
                                </div>
                                <div>
                                    <h3 className="ai-title">Shiksha AI</h3>
                                    <div className="ai-status">
                                        <span className="ai-online-dot"></span>
                                        <p className="ai-online-text">Online</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setIsOpen(false)} className="ai-close-btn">
                                <X className="ai-close-icon" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="ai-messages">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`ai-message-row ${message.role === 'user' ? 'right' : 'left'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="ai-avatar bot">
                                            <Bot className="ai-avatar-icon" />
                                        </div>
                                    )}

                                    <div className={`ai-bubble ${message.role} ${message.isError ? "error" : ""}`}>
                                        {message.content}
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="ai-avatar user">
                                            <User className="ai-avatar-icon" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="ai-message-row left">
                                    <div className="ai-avatar bot">
                                        <Bot className="ai-avatar-icon" />
                                    </div>
                                    <div className="ai-bubble assistant">
                                        <div className="ai-typing">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="ai-input-area">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Write a message..."
                                disabled={isLoading}
                                className="ai-textarea"
                            />

                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="ai-send-btn"
                            >
                                {isLoading ? (
                                    <Loader2 className="ai-send-icon spin" />
                                ) : (
                                    <Send className="ai-send-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Floating Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="ai-floating-btn">
                {isOpen ? <X className="ai-float-icon" /> : <MessageCircle className="ai-float-icon" />}
            </button>

        </div>
    );
};

export default AIChatbot;
