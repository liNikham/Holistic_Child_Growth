import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBrain, FaChartLine, FaLightbulb, FaChild } from 'react-icons/fa';
import ActivityRecommendations from '../components/ActivityRecommendations';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SmartInsightsPage = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchActivities();
        }
    }, [selectedChild]);

    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/children/getAllChildProfiles', {
                headers: { Authorization: token }
            });
            setChildren(response.data);
            if (response.data.length > 0) {
                setSelectedChild(response.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`/api/children/getActivities/${selectedChild}`, {
                headers: { Authorization: token }
            });
            setActivities(response.data.activities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const processActivitiesData = (activities) => {
        // Group activities by date
        const groupedActivities = activities.reduce((acc, activity) => {
            const date = new Date(activity.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = {
                    physical: 0,
                    cognitive: 0,
                    social: 0,
                    creative: 0
                };
            }
            acc[date][activity.category] += parseInt(activity.duration);
            return acc;
        }, {});

        // Convert to chart data format
        const dates = Object.keys(groupedActivities).sort((a, b) => new Date(a) - new Date(b));
        const categories = ['physical', 'cognitive', 'social', 'creative'];
        
        return {
            labels: dates,
            datasets: categories.map((category, index) => ({
                label: category.charAt(0).toUpperCase() + category.slice(1),
                data: dates.map(date => groupedActivities[date][category]),
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ][index],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ][index],
                fill: true,
                tension: 0.4
            }))
        };
    };

    useEffect(() => {
        if (activities.length > 0) {
            setProgressData(processActivitiesData(activities));
        }
    }, [activities]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Development Progress Over Time'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Duration (minutes)'
                }
            }
        }
    };

    // Calculate achievement stats
    const getAchievements = () => {
        if (!activities.length) return [];

        const stats = {
            totalDuration: activities.reduce((sum, act) => sum + parseInt(act.duration), 0),
            categoryCounts: activities.reduce((acc, act) => {
                acc[act.category] = (acc[act.category] || 0) + 1;
                return acc;
            }, {}),
            recentStreak: calculateStreak(activities)
        };

        return [
            {
                title: 'Total Activity Time',
                value: `${Math.round(stats.totalDuration / 60)} hours`,
                icon: FaChartLine
            },
            {
                title: 'Activity Streak',
                value: `${stats.recentStreak} days`,
                icon: FaLightbulb
            },
            {
                title: 'Most Active Category',
                value: getMostActiveCategory(stats.categoryCounts),
                icon: FaBrain
            }
        ];
    };

    const calculateStreak = (activities) => {
        if (!activities.length) return 0;
        const dates = activities.map(a => new Date(a.date).toDateString());
        const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
        let streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const curr = new Date(uniqueDates[i]);
            const prev = new Date(uniqueDates[i - 1]);
            const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) streak++;
            else break;
        }
        return streak;
    };

    const getMostActiveCategory = (categoryCounts) => {
        return Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)[0][0]
            .charAt(0).toUpperCase() + 
            Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)[0][0]
            .slice(1);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FaBrain className="mr-3 text-blue-600" />
                    Smart Insights
                </h1>
                <p className="text-gray-600 mt-2">
                    AI-powered insights and recommendations for your child's development
                </p>
            </div>

            {/* Child Selector */}
            <div className="mb-6">
                <select
                    value={selectedChild || ''}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select a child</option>
                    {children.map(child => (
                        <option key={child._id} value={child._id}>
                            {child.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : selectedChild ? (
                <div className="space-y-6">
                    {/* Activity Recommendations */}
                    <ActivityRecommendations 
                        childId={selectedChild} 
                        activities={activities} 
                    />

                    {/* Development Progress Graph */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FaChartLine className="mr-2 text-green-600" />
                            Development Progress
                        </h2>
                        {progressData && (
                            <div className="h-[400px]">
                                <Line data={progressData} options={chartOptions} />
                            </div>
                        )}
                    </div>

                    {/* Achievements Grid */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <FaLightbulb className="mr-2 text-yellow-600" />
                            Recent Achievements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getAchievements().map((achievement, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <achievement.icon className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-blue-600 font-bold">
                                                {achievement.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <FaChild className="text-gray-400 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">Please select a child to view insights</p>
                </div>
            )}
        </div>
    );
};

export default SmartInsightsPage; 