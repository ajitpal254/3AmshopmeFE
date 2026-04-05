import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chatbot.css';

// Predefined prompt buttons shown at conversation start
const suggestedPrompts = [
    { id: 1, text: "Show me your most popular products", icon: "🔥" },
    { id: 2, text: "What is your return policy?", icon: "↩️" },
    { id: 3, text: "How can I contact support?", icon: "💬" },
    { id: 4, text: "Where are my orders?", icon: "📦" },
];

// API Gateway URL set in .env as VITE_CHATBOT_API_URL
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL;
const CHATBOT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your 3AmShoppme assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 200);
    };

    const handleSend = async (textToSend = input) => {
        const messageText = textToSend.trim();
        if (!messageText) return;

        setMessages(prev => [...prev, { text: messageText, isBot: false }]);
        setInput('');
        setIsTyping(true);

        try {
            if (!CHATBOT_API_URL) {
                throw new Error('VITE_CHATBOT_API_URL not configured');
            }

            const headers = { 'Content-Type': 'application/json' };
            if (CHATBOT_API_KEY) headers['x-api-key'] = CHATBOT_API_KEY;

            const { data } = await axios.post(
                CHATBOT_API_URL,
                { message: messageText, sessionId },
                { headers }
            );

            if (data.success) {
                const botMsg = {
                    text: data.message,
                    isBot: true,
                    ...(data.action && { action: data.action }),
                };
                setMessages(prev => [...prev, botMsg]);
                if (botMsg.action?.type === 'NAVIGATE') {
                    navigate(botMsg.action.payload);
                    handleClose();
                }
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I received an unexpected response.", isBot: true }]);
            }
        } catch (error) {
            console.warn("Chatbot API unavailable, using local fallback:", error.message);
            // Fallback to local keyword matching when API is not yet configured
            const lowerMsg = messageText.toLowerCase();
            let fallbackText = "I'm not sure how to help with that. Try one of the suggested questions below!";
            if (lowerMsg.includes("return") || lowerMsg.includes("refund")) {
                fallbackText = "We offer a 30-day return policy for all unused items in their original packaging.";
            } else if (lowerMsg.includes("support") || lowerMsg.includes("contact")) {
                fallbackText = "You can reach our support team at support@3amshoppme.com.";
            } else if (lowerMsg.includes("order") || lowerMsg.includes("track")) {
                fallbackText = "You can view your order history in your account dashboard.";
            } else if (lowerMsg.includes("popular") || lowerMsg.includes("trending")) {
                fallbackText = "Check out the Trending section on our home page for the most popular products!";
            }
            setMessages(prev => [...prev, { text: fallbackText, isBot: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const handlePromptClick = (promptText) => {
        handleSend(promptText);
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className={`chatbot-window ${isClosing ? 'closing' : ''}`}>
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">🤖</div>
                            <div>
                                <h3>3AmShop AI</h3>
                                <p>Online & Ready to help</p>
                            </div>
                        </div>
                        <button className="chatbot-close-btn" onClick={handleClose}>&times;</button>
                    </div>

                    <div className="chatbot-messages-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.text}
                                {msg.action && (
                                    <div style={{marginTop: '10px'}}>
                                        <button 
                                            className="chat-action-btn"
                                            onClick={() => {
                                                navigate(msg.action.payload);
                                                handleClose();
                                            }}
                                        >
                                            Click here to go there 🚀
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Show suggested prompts when conversation just started and bot is not typing */}
                        {messages.length === 1 && !isTyping && (
                            <div className="chatbot-prompts">
                                {suggestedPrompts.map((p) => (
                                    <button 
                                        key={p.id} 
                                        className="chatbot-prompt-btn"
                                        onClick={() => handlePromptClick(p.text)}
                                    >
                                        <span>{p.icon}</span> {p.text}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <div className="chatbot-input-wrapper">
                            <input
                                type="text"
                                className="chatbot-input"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                            />
                            <button 
                                className="chatbot-send-btn" 
                                onClick={() => handleSend()}
                                disabled={isTyping || !input.trim()}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
                    <span>🤖</span>
                </button>
            )}
        </div>
    );
};

export default Chatbot;
