import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './CommandPalette.css';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { user, vendor } = useAuth();

    // Toggle with Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleCommandSubmit = async (e) => {
        if (e.key === 'Enter' && query.trim()) {
            setLoading(true);
            setAiResponse(null);
            
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('vendorToken');
                const role = user?.isAdmin ? 'admin' : (vendor ? 'vendor' : 'user');
                
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };

                const { data } = await axios.post('/api/ai/command', {
                    command: query,
                    role: role,
                    context: window.location.pathname
                }, config);

                if (data.success) {
                    setAiResponse(data.message);
                    if (data.action) {
                        handleAction(data.action);
                    }
                }
            } catch (error) {
                console.error("AI Command Error:", error);
                setAiResponse("Sorry, I couldn't process that command. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAction = (action) => {
        if (action.type === 'NAVIGATE') {
            navigate(action.payload);
            setIsOpen(false);
        } else if (action.type === 'THEME_CHANGE') {
            // Assuming ThemeContext has a toggle or set function, but for now just log
            console.log("Theme change requested:", action.payload);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
            <div className="command-palette-container" onClick={e => e.stopPropagation()}>
                <div className="command-input-wrapper">
                    <span className="command-icon">✨</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="command-input"
                        placeholder="Ask AI to do something..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleCommandSubmit}
                    />
                    {loading && <div className="spinner-border spinner-border-sm text-primary" role="status"></div>}
                </div>

                <div className="command-results">
                    {aiResponse && (
                        <div className="ai-response">
                            {aiResponse}
                        </div>
                    )}
                    
                    {!aiResponse && !loading && (
                        <>
                            <div className="command-item" onClick={() => setQuery("Show me recent sales")}>
                                <span className="command-item-icon">📊</span>
                                <span>Show me recent sales</span>
                            </div>
                            <div className="command-item" onClick={() => setQuery("Go to products")}>
                                <span className="command-item-icon">📦</span>
                                <span>Go to products</span>
                            </div>
                             <div className="command-item" onClick={() => setQuery("Switch to dark mode")}>
                                <span className="command-item-icon">🌙</span>
                                <span>Switch to dark mode</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="command-footer">
                    <span>AI Agent Active</span>
                    <span>ESC to close</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
