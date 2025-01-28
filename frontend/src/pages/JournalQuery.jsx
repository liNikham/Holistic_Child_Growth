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
    FaDownload
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

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchJournalEntries();
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

    return (
        <div className="">
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

            {/* Journal Entries Timeline */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Journal Entries Found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                    </div>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-lg">
                                    {getEntryIcon(entry.category)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {entry.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FaClock className="mr-1" />
                                            {new Date(entry.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{entry.content}</p>
                                    {entry.metrics && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                                            {Object.entries(entry.metrics).map(([key, value]) => (
                                                <div key={key} className="text-center">
                                                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                                                    <p className="font-semibold text-gray-700">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JournalQuery; 