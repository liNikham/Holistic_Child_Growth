import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaBook,
    FaCalendar,
    FaSearch,
    FaFilter,
    FaChild,
    FaChartLine,
    FaHeartbeat,
    FaUtensils,
    FaBed,
    FaRunning,
    FaStar,
    FaChevronDown,
    FaChevronUp,
    FaClock,
    FaDownload,
    FaSpinner
} from 'react-icons/fa';

const JournalQuery = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [question, setQuestion] = useState('');
    const [queryResponse, setQueryResponse] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

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

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!selectedChild || !question) {
            alert('Please select a child and enter a question');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.post('/api/journal/query', {
                childId: selectedChild,
                question: question
            }, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data)
            if (response.data.success && response.data.answers) {
                setQueryResponse(response.data.answers); // Taking the first answer
            }
        } catch (error) {
            console.error('Error fetching journal query:', error);
            alert('Failed to get response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatResponse = (text) => {
        if (!text) return null;

        // Split response into sections
        const sections = text.split('\n\n');

        return (
            <div className="space-y-6">
                {sections.map((section, index) => {
                    // Handle main headers (text between **)
                    if (section.startsWith('**') && section.endsWith('**')) {
                        return (
                            <h2 key={index} className="text-xl font-bold text-blue-800 border-b border-blue-200 pb-2">
                                {section.replace(/\*\*/g, '').replace('[Child\'s Name]', selectedChild?.name || '')}
                            </h2>
                        );
                    }

                    // Handle sub-headers with bullet points
                    if (section.startsWith('**')) {
                        const [header, ...content] = section.split('\n');
                        return (
                            <div key={index} className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {header.replace(/\*\*/g, '')}
                                </h3>
                                <div className="pl-4">
                                    {content.map((item, i) => {
                                        if (item.trim().startsWith('*')) {
                                            return (
                                                <div key={i} className="flex items-start space-x-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                    <p className="text-gray-700 flex-1">
                                                        {item.replace(/^\*\s*/, '')
                                                            .replace('[Child\'s Name]', selectedChild?.name || '')}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <p key={i} className="text-gray-700">
                                                {item.replace('[Child\'s Name]', selectedChild?.name || '')}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    // Regular paragraphs
                    return (
                        <p key={index} className="text-gray-700 leading-relaxed">
                            {section.replace('[Child\'s Name]', selectedChild?.name || '')}
                        </p>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-lg text-white">
                        <FaBook className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Child Development Query</h1>
                        <p className="text-gray-600">Ask questions about your child's development journey</p>
                    </div>
                </div>

                {/* Question Form */}
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Child
                        </label>
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select a child</option>
                            {children.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Question
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask about your child's development..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows="3"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FaSearch />
                                <span>Get Answer</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Response Display */}
            {queryResponse && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Response</h2>
                    <div className="prose max-w-none">
                        {queryResponse}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalQuery; 