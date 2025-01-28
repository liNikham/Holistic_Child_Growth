import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaChartLine,
    FaChild,
    FaCalendar,
    FaDownload,
    FaRuler,
    FaWeight,
    FaUtensils,
    FaBed,
    FaRunning,
    FaStar,
    FaHeartbeat,
    FaChevronLeft,
    FaChevronRight,
    FaArrowUp,
    FaArrowDown,
    FaMinus
} from 'react-icons/fa';

const MonthlySummary = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild && selectedMonth) {
            fetchMonthlySummary();
        }
    }, [selectedChild, selectedMonth]);

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

    const fetchMonthlySummary = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/monthly-summary', {
                headers: { Authorization: `${token}` },
                params: {
                    childId: selectedChild,
                    month: selectedMonth
                }
            });
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching monthly summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadSummary = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/monthly-summary/download', {
                headers: { Authorization: `${token}` },
                params: {
                    childId: selectedChild,
                    month: selectedMonth
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `monthly-summary-${selectedMonth}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading summary:', error);
        }
    };

    const getGrowthIndicator = (change) => {
        if (change > 0) return <FaArrowUp className="text-green-500" />;
        if (change < 0) return <FaArrowDown className="text-red-500" />;
        return <FaMinus className="text-gray-500" />;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const navigateMonth = (direction) => {
        const current = new Date(selectedMonth);
        current.setMonth(current.getMonth() + direction);
        setSelectedMonth(current.toISOString().slice(0, 7));
    };

    return (
        <div className="">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg text-white">
                            <FaChartLine className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Monthly Development Summary</h1>
                            <p className="text-gray-600">Track your child's growth and achievements</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a child</option>
                            {children.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={downloadSummary}
                            disabled={!selectedChild || !summary}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center space-x-2 disabled:opacity-50"
                        >
                            <FaDownload />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <FaChevronLeft className="text-gray-600" />
                    </button>
                    <div className="flex items-center space-x-2">
                        <FaCalendar className="text-gray-600" />
                        <span className="text-lg font-medium text-gray-700">
                            {formatDate(selectedMonth)}
                        </span>
                    </div>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <FaChevronRight className="text-gray-600" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : !selectedChild ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <FaChild className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Child</h3>
                    <p className="text-gray-500">Choose a child to view their monthly summary</p>
                </div>
            ) : summary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Growth Metrics */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaRuler className="mr-2" /> Physical Growth
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 flex items-center">
                                        <FaWeight className="mr-2" /> Weight
                                    </span>
                                    {getGrowthIndicator(summary.growth.weightChange)}
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{summary.growth.weight} kg</p>
                                <p className="text-sm text-gray-500">
                                    {Math.abs(summary.growth.weightChange)} kg change
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 flex items-center">
                                        <FaRuler className="mr-2" /> Height
                                    </span>
                                    {getGrowthIndicator(summary.growth.heightChange)}
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{summary.growth.height} cm</p>
                                <p className="text-sm text-gray-500">
                                    {Math.abs(summary.growth.heightChange)} cm change
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaRunning className="mr-2" /> Activity Overview
                        </h2>
                        <div className="space-y-4">
                            {summary.activities.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-gray-600">{activity.name}</span>
                                    <div className="flex items-center">
                                        <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${activity.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {activity.count} times
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Health & Sleep */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaHeartbeat className="mr-2" /> Health & Sleep
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 flex items-center">
                                        <FaBed className="mr-2" /> Average Sleep
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {summary.sleep.averageHours}h
                                </p>
                                <p className="text-sm text-gray-500">per night</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Earliest Bedtime</p>
                                    <p className="font-semibold text-gray-800">
                                        {summary.sleep.earliestBedtime}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Latest Bedtime</p>
                                    <p className="font-semibold text-gray-800">
                                        {summary.sleep.latestBedtime}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Milestones & Achievements */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaStar className="mr-2" /> Milestones & Achievements
                        </h2>
                        <div className="space-y-4">
                            {summary.milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-4 flex items-start space-x-3"
                                >
                                    <div className="bg-yellow-100 p-2 rounded-lg">
                                        <FaStar className="text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{milestone.title}</p>
                                        <p className="text-sm text-gray-600">{milestone.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <FaChartLine className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Summary Available</h3>
                    <p className="text-gray-500">No data available for the selected month</p>
                </div>
            )}
        </div>
    );
};

export default MonthlySummary; 