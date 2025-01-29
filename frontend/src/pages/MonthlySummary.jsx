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
    FaMinus,
    FaBrain,
    FaChartBar,
    FaListUl,
    FaClock,
    FaCalendarTimes,
    FaSync,
    FaCalendarDay
} from 'react-icons/fa';

const MonthlySummary = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
            console.log('Children response:', response);
            if (Array.isArray(response.data)) {
                setChildren(response.data);
            } else if (Array.isArray(response.data.data)) {
                setChildren(response.data.data);
            } else {
                console.error('Unexpected data format:', response.data);
                setChildren([]);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
            setChildren([]);
        }
    };

    const fetchMonthlySummary = async () => {
        setLoading(true);
        console.log("in fetchMonthlySummary");
        console.log(selectedChild, selectedMonth,selectedYear);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/children/generateMonthlySummary', {
                headers: { Authorization: `${token}` },
                params: {
                    childId: selectedChild,
                    month: selectedMonth,
                    year: selectedYear
                }
            });
            console.log(response.data.summary);
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

    const formatDate = (month, year) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    
        return `${monthNames[month - 1]} ${year}`;
    };

    const navigateMonth = (direction) => {
        setSelectedMonth((prevMonth) => {
            let newMonth = prevMonth + direction;
            let newYear = selectedYear; // Get the current year state
    
            if (newMonth > 12) {
                newMonth = 1;
                newYear++;
            } else if (newMonth < 1) {
                newMonth = 12;
                newYear--;
            }
    
            setSelectedYear(newYear); // Update the year state
            return newMonth; // Update the month state
        });
    };
    
    const getSelectedChild = () => {
        return children.find(child => child._id === selectedChild);
    };

    const getMonthlyActivities = () => {
        const child = getSelectedChild();
        if (!child?.activities) return [];
        
        return child.activities.filter(activity => {
            const activityDate = new Date(activity.date);
            return activityDate.getMonth() + 1 === selectedMonth && 
                   activityDate.getFullYear() === selectedYear;
        });
    };

    const calculateTotalDuration = () => {
        const activities = getMonthlyActivities();
        return activities.reduce((total, activity) => total + activity.duration, 0);
    };

    const groupActivitiesByDate = () => {
        const activities = getMonthlyActivities();
        const grouped = {};
        
        activities.forEach(activity => {
            const date = new Date(activity.date).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(activity);
        });
        
        return grouped;
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
                            {Array.isArray(children) && children.length > 0 ? (
                                children.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.name} ({new Date(child.dateOfBirth).toLocaleDateString()})
                                </option>
                                ))
                            ) : (
                                <option value="" disabled>No children found</option>
                            )}
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
                            {formatDate(selectedMonth,selectedYear)}
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Child Overview */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChild className="mr-2" /> Child Overview
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-gray-800">{getSelectedChild()?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date of Birth</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(getSelectedChild()?.dateOfBirth).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Growth Metrics */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaRuler className="mr-2" /> Physical Growth
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <span className="text-gray-600 flex items-center mb-2">
                                    <FaWeight className="mr-2" /> Weight
                                </span>
                                <p className="text-2xl font-bold text-gray-800">
                                    {getSelectedChild()?.weight || 'N/A'} kg
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <span className="text-gray-600 flex items-center mb-2">
                                    <FaRuler className="mr-2" /> Height
                                </span>
                                <p className="text-2xl font-bold text-gray-800">
                                    {getSelectedChild()?.height || 'N/A'} cm
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Activity Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaRunning className="mr-2" /> Monthly Activities
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Duration: {calculateTotalDuration()} minutes
                            </div>
                        </h2>
                        <div className="space-y-6">
                            {Object.entries(groupActivitiesByDate()).map(([date, activities]) => (
                                <div key={date} className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-700 mb-3">{date}</h3>
                                    <div className="space-y-3">
                                        {activities.map((activity) => (
                                            <div 
                                                key={activity._id} 
                                                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-blue-100 p-2 rounded-lg">
                                                        <FaRunning className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {activity.activity}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(activity.date).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-gray-600">
                                                    {activity.duration} min
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {getMonthlyActivities().length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No activities recorded for this month
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Generated Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaBrain className="mr-2" /> Development Summary
                        </h2>
                        {summary ? (
                            <div className="prose max-w-none">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {summary.summary}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Click "Generate Summary" to get an AI-powered analysis of your child's activities
                            </div>
                        )}
                    </div>

                    {/* Activity Statistics */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaChartBar className="mr-2" /> Activity Statistics
                            </div>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm text-gray-600 mb-2">Total Activities</h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    {getMonthlyActivities().length}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm text-gray-600 mb-2">Total Duration</h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    {calculateTotalDuration()} minutes
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm text-gray-600 mb-2">Active Days</h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    {Object.keys(groupActivitiesByDate()).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Activities List */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <FaListUl className="mr-2" /> Detailed Activities
                            </div>
                            <button
                                onClick={fetchMonthlySummary}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                            >
                                <FaSync className={loading ? 'animate-spin' : ''} />
                                <span>Generate Summary</span>
                            </button>
                        </h2>
                        <div className="space-y-6">
                            {Object.entries(groupActivitiesByDate()).map(([date, activities]) => (
                                <div key={date} className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <FaCalendarDay className="mr-2" />
                                        {date}
                                    </h3>
                                    <div className="space-y-3">
                                        {activities.map((activity) => (
                                            <div 
                                                key={activity._id} 
                                                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-blue-100 p-3 rounded-lg">
                                                        <FaRunning className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {activity.activity}
                                                        </p>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                            <FaClock className="text-gray-400" />
                                                            <span>{new Date(activity.date).toLocaleTimeString()}</span>
                                                            <span>•</span>
                                                            <span>{activity.duration} minutes</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {activity.notes && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        {activity.notes}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {getMonthlyActivities().length === 0 && (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                    <FaCalendarTimes className="mx-auto text-4xl mb-2 text-gray-400" />
                                    <p>No activities recorded for this month</p>
                                    <p className="text-sm mt-1">Start adding activities to track your child's development</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlySummary; 