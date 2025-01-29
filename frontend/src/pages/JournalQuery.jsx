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
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [filters, setFilters] = useState({
        activities: false,
        meals: false,
        sleep: false,
        health: false,
        milestones: false
    });
    const [showFilters, setShowFilters] = useState(false);
    const [queryResponses, setQueryResponses] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchJournalEntries();
            fetchJournalQuery();
        }
    }, [selectedChild, dateRange, filters]);

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

    const fetchJournalEntries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/journal-entries/search', {
                headers: { Authorization: `${token}` },
                params: {
                    childId: selectedChild,
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                    ...filters
                }
            });
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching journal entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJournalQuery = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.post('/api/journal/query', {
                childId: selectedChild,
                question: "What activities did my child do last month?"
            }, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success && response.data.answers) {
                setQueryResponses(response.data.answers);
                setSelectedResponse(response.data.answers[0]); // Select first response by default
            }
        } catch (error) {
            console.error('Error fetching journal query:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJournalEntries();
    };

    const toggleFilter = (filter) => {
        setFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
    };

    const getEntryIcon = (category) => {
        switch (category) {
            case 'activities': return <FaRunning className="text-green-500" />;
            case 'meals': return <FaUtensils className="text-orange-500" />;
            case 'sleep': return <FaBed className="text-blue-500" />;
            case 'health': return <FaHeartbeat className="text-red-500" />;
            case 'milestones': return <FaStar className="text-yellow-500" />;
            default: return <FaBook className="text-gray-500" />;
        }
    };

    const downloadJournal = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/journal-entries/download', {
                headers: { Authorization: `${token}` },
                params: {
                    childId: selectedChild,
                    startDate: dateRange.start,
                    endDate: dateRange.end
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'journal.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading journal:', error);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-lg text-white">
                            <FaBook className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Journal Explorer</h1>
                            <p className="text-gray-600">Search and analyze your child's growth journey</p>
                        </div>
                    </div>
                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select a child</option>
                        {children.map((child) => (
                            <option key={child._id} value={child._id}>
                                {child.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search and Filters */}
                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="flex space-x-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search journal entries..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                        >
                            <FaFilter />
                            <span>Filters</span>
                            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <button
                            type="button"
                            onClick={downloadJournal}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center space-x-2"
                        >
                            <FaDownload />
                            <span>Export</span>
                        </button>
                    </form>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {Object.keys(filters).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => toggleFilter(filter)}
                                        className={`px-4 py-2 rounded-full flex items-center space-x-2 ${filters[filter]
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {getEntryIcon(filter)}
                                        <span className="capitalize">{filter}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-600" />
                </div>
            ) : (
                <>
                    {/* Query Results */}
                    {queryResponses.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Response List */}
                            <div className="md:col-span-1 space-y-4">
                                {queryResponses.map((response, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedResponse(response)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all ${selectedResponse === response
                                            ? 'bg-blue-50 border-2 border-blue-500'
                                            : 'bg-white border border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">
                                                Response {index + 1}
                                            </span>
                                            <div className="flex items-center text-yellow-500">
                                                <FaStar />
                                                <span className="ml-1 text-sm">
                                                    {parseFloat(response.relevanceScore).toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Date: {response.date}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Selected Response Content */}
                            <div className="md:col-span-3">
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    {selectedResponse ? (
                                        <div className="prose max-w-none">
                                            {formatResponse(selectedResponse.text)}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            Select a response to view details
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JournalQuery; 