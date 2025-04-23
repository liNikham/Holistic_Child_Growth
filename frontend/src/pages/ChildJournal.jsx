import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    FaBook,
    FaCamera,
    FaPencilAlt,
    FaTrash,
    FaHeart,
    FaRegHeart,
    FaImage,
    FaVideo,
    FaMicrophone,
    FaCalendarAlt,
    FaSmile,
    FaPlus,
    FaEllipsisH,
    FaDownload,
    FaShare
} from 'react-icons/fa';

const ChildJournal = () => {
    const navigate = useNavigate();
    const { childId } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(childId || '');
    const [entries, setEntries] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState([]);

    // Effect to fetch children profiles
    useEffect(() => {
        fetchChildren();
    }, []);

    // Effect to update selected child when URL parameter changes - only on initial mount
    useEffect(() => {
        if (childId) {
            setSelectedChild(childId);
        }
    }, []);  // Only run on mount

    // Effect to fetch journal entries when child selection changes
    useEffect(() => {
        if (selectedChild) {
            fetchJournalEntries();
        }
    }, [selectedChild, currentYear]);

    // Fetch all child profiles
    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/children/getAllChildProfiles', {
                headers: { Authorization: `${token}` },
            });
            setChildren(response.data);

            // If no childId in URL but we have children, select the first one
            if (!childId && response.data.length > 0) {
                setSelectedChild(response.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    // Fetch journal entries for the selected child
    const fetchJournalEntries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`/api/children/journal/${selectedChild}`, {
                headers: { Authorization: `${token}` },
            });

            // Filter entries by the selected year
            const filteredEntries = response.data.filter(entry => entry.year === currentYear);
            setEntries(filteredEntries);

            // Extract available years from the data
            const availableYears = [...new Set(response.data.map(entry => entry.year))];
            setYears(availableYears.sort());

        } catch (error) {
            console.error('Error fetching journal entries:', error);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    // Get month name from number
    const getMonthName = (monthNumber) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[parseInt(monthNumber) - 1] || monthNumber;
    };

    // Navigate to another child's journal
    const handleChildChange = (e) => {
        const newChildId = e.target.value;
        setSelectedChild(newChildId);
        // No navigation, just update the state
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-lg text-white">
                            <FaBook className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Child's Journal</h1>
                            <p className="text-gray-600">Monthly growth summaries and memories</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedChild}
                            onChange={handleChildChange}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Select a child</option>
                            {children.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.name}
                                </option>
                            ))}
                        </select>
                        {years.length > 0 && (
                            <select
                                value={currentYear}
                                onChange={(e) => setCurrentYear(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Journal Entries */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : !selectedChild ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Child</h3>
                        <p className="text-gray-500">Choose a child to view their journal entries</p>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Journal Entries</h3>
                        <p className="text-gray-500">No monthly summaries found for {currentYear}</p>
                    </div>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {getMonthName(entry.month)} {entry.year}
                                    </h3>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            className="text-gray-400 hover:text-purple-500"
                                        >
                                            <FaDownload />
                                        </button>
                                        <button
                                            className="text-gray-400 hover:text-purple-500"
                                        >
                                            <FaShare />
                                        </button>
                                    </div>
                                </div>
                                <div className="prose max-w-none">
                                    {entry.summary.split('\n\n').map((paragraph, pIndex) => (
                                        <p key={pIndex} className="text-gray-600 mb-4 whitespace-pre-wrap">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChildJournal;
