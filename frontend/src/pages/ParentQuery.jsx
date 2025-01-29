import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaChild,
    FaRobot,
    FaPaperPlane,
    FaSpinner,
    FaSearch,
    FaHistory,
    FaBookmark,
    FaRegBookmark,
    FaInfoCircle,
    FaLightbulb,
    FaBrain,
    FaStar,
    FaMicrophone,
    FaMicrophoneSlash,
    FaGlobe,
    FaCheck
} from 'react-icons/fa';

const ParentQuery = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [query, setQuery] = useState('');
    const [conversations, setConversations] = useState([]);
    const [savedQueries, setSavedQueries] = useState([]);
    const chatEndRef = useRef(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const recognition = useRef(null);

    const suggestionQueries = [
        "What milestones should my child reach at their age?",
        "Is my child's growth rate normal?",
        "How can I improve my child's sleep schedule?",
        "What activities are best for my child's development?",
        "How can I support my child's language development?",
        "What are healthy meal options for my child?"
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'zh', name: '中文' }
    ];

    useEffect(() => {
        fetchChildren();
        fetchSavedQueries();
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            recognition.current = new webkitSpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.lang = selectedLanguage;

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [conversations]);

    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/children/getAllChildProfiles', {
                headers: { Authorization: `${token}` },
            });
            setChildren(response.data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const fetchSavedQueries = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/parent-queries/saved', {
                headers: { Authorization: `${token}` },
            });
            setSavedQueries(response.data);
        } catch (error) {
            console.error('Error fetching saved queries:', error);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleVoiceInput = () => {
        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
        }
        setIsListening(!isListening);
    };

    const formatResponse = (text) => {
        // Split response into sections
        const sections = text.split('\n\n');

        return (
            <div className="space-y-6">
                {sections.map((section, index) => {
                    // Handle headers (text between **)
                    if (section.startsWith('**') && section.endsWith('**')) {
                        return (
                            <h2 key={index} className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-2">
                                {section.replace(/\*\*/g, '')}
                            </h2>
                        );
                    }

                    // Handle sub-headers
                    if (section.startsWith('**')) {
                        const [header, ...content] = section.split('\n');
                        return (
                            <div key={index} className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {header.replace(/\*\*/g, '')}
                                </h3>
                                {content.length > 0 && (
                                    <div className="pl-4">
                                        {content.map((item, i) => {
                                            if (item.trim().startsWith('*')) {
                                                return (
                                                    <div key={i} className="flex items-start space-x-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                        <p className="text-gray-700 flex-1">
                                                            {item.replace(/^\*\s*/, '')}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <p key={i} className="text-gray-700">
                                                    {item}
                                                </p>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Handle bullet points
                    if (section.includes('\n* ')) {
                        const [intro, ...bullets] = section.split('\n* ');
                        return (
                            <div key={index} className="space-y-3">
                                {intro && (
                                    <p className="text-gray-700">{intro}</p>
                                )}
                                <div className="space-y-2 pl-4">
                                    {bullets.map((bullet, i) => (
                                        <div key={i} className="flex items-start space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                            <p className="text-gray-700 flex-1">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    // Regular paragraphs
                    return (
                        <p key={index} className="text-gray-700 leading-relaxed">
                            {section}
                        </p>
                    );
                })}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || !selectedChild) return;

        const newQuery = {
            type: 'question',
            content: query,
            timestamp: new Date().toISOString()
        };

        setConversations(prev => [...prev, newQuery]);
        setQuery('');
        setLoading(true);
        setShowSuggestions(false);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('/api/children/parent-queries/ask', {
                childId: selectedChild,
                query: newQuery.content,
                language: selectedLanguage,
                childInfo: children.find(child => child._id === selectedChild)
            }, {
                headers: { Authorization: `${token}` },
            });

            const answer = {
                type: 'answer',
                content: response.data.answer,
                timestamp: new Date().toISOString()
            };

            setConversations(prev => [...prev, answer]);
        } catch (error) {
            console.error('Error getting answer:', error);
            const errorMsg = {
                type: 'error',
                content: error.response?.data?.message || 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            };
            setConversations(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
    };

    const toggleSaveQuery = async (query) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('/api/parent-queries/toggle-save', {
                query
            }, {
                headers: { Authorization: `${token}` },
            });
            fetchSavedQueries();
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    const isQuerySaved = (query) => {
        return savedQueries.some(saved => saved.query === query);
    };

    // Add animation classes for messages
    const getMessageAnimationClass = (type) => {
        return type === 'question'
            ? 'animate-slide-left'
            : 'animate-slide-right';
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex mt-10">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Enhanced Header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                                <FaBrain className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">AI Child Development Assistant</h1>
                                <p className="text-blue-100">Get expert insights and personalized guidance</p>
                            </div>
                        </div>
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        >
                            <option value="">Select a child</option>
                            {children.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Enhanced Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
                    {conversations.length === 0 && showSuggestions && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaLightbulb className="text-3xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    How can I help you today?
                                </h3>
                                <p className="text-gray-600">
                                    Ask anything about your child's development and growth
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestionQueries.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="p-4 text-left rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md group"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <FaStar className="text-blue-600" />
                                            </div>
                                            <span className="text-gray-700 group-hover:text-blue-600">
                                                {suggestion}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {conversations.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'} ${getMessageAnimationClass(msg.type)}`}
                        >
                            <div
                                className={`max-w-4xl rounded-2xl p-6 ${msg.type === 'question'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-12'
                                    : msg.type === 'error'
                                        ? 'bg-red-50 text-red-700 mr-12'
                                        : 'bg-white border border-gray-200 shadow-lg mr-12'
                                    }`}
                            >
                                {msg.type === 'answer' ? (
                                    <div className="prose max-w-none">
                                        {formatResponse(msg.content)}
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}
                                <div className="text-xs mt-4 text-gray-500 border-t border-gray-100 pt-2">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-gray-50 rounded-2xl p-4 mr-12 shadow-lg flex items-center space-x-3">
                                <FaSpinner className="animate-spin text-blue-600" />
                                <span className="text-gray-600">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Enhanced Input Area with Voice and Language Support */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex items-center space-x-4 mb-4">
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={toggleVoiceInput}
                            className={`p-3 rounded-full ${isListening
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600'
                                } hover:bg-opacity-80`}
                        >
                            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="flex space-x-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Type your question in ${languages.find(l => l.code === selectedLanguage).name}...`}
                            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                            disabled={!selectedChild || isListening}
                        />
                        <button
                            type="submit"
                            disabled={!query.trim() || !selectedChild || loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                    {!selectedChild && (
                        <p className="mt-3 text-sm text-red-600 flex items-center bg-red-50 p-3 rounded-lg">
                            <FaInfoCircle className="mr-2" />
                            Please select a child to ask questions
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentQuery; 