import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBrain, FaChartLine, FaLightbulb, FaChild, FaCalendarAlt, FaFire, FaTrophy, FaRegClock } from 'react-icons/fa';
import ActivityRecommendations from '../components/ActivityRecommendations';
import { Line, Bar, Pie, PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
    RadialLinearScale
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
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
    const [timeDistributionData, setTimeDistributionData] = useState(null);
    const [weeklyTrendsData, setWeeklyTrendsData] = useState(null);
    const [activityCountsByDay, setActivityCountsByDay] = useState(null);

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

            // For each activity, categorize it using the new endpoint
            const activitiesWithCategories = await Promise.all(response.data.activities.map(async (activity) => {
                console.log(activity);
                const categoryResponse = await axios.post(
                    '/api/children/categorize',
                    { description: activity.activity },
                    {
                        headers: {
                            Authorization: `${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(categoryResponse.data);
                return {
                    ...activity,
                    category: categoryResponse.data.category // Assuming the response contains a category
                };
            }));

            setActivities(activitiesWithCategories);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process activities data for time-series chart
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
            // Dynamically use the category from the activity
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

    // Process time distribution by category
    const processTimeDistribution = (activities) => {
        // Calculate total duration for each category
        const categoryTotals = activities.reduce((acc, activity) => {
            const category = activity.category;
            acc[category] = (acc[category] || 0) + parseInt(activity.duration);
            return acc;
        }, {});

        // Convert to chart data
        return {
            labels: Object.keys(categoryTotals).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
            datasets: [{
                label: 'Time Spent (minutes)',
                data: Object.values(categoryTotals),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        };
    };

    // Process weekly trends data
    const processWeeklyTrends = (activities) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Init counters for activities per day
        const activityCountsByDay = daysOfWeek.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});

        // Count activities per day of week
        activities.forEach(activity => {
            const date = new Date(activity.date);
            const dayName = daysOfWeek[date.getDay()];
            activityCountsByDay[dayName]++;
        });

        // Create data for daily activity counts
        const dailyActivityData = {
            labels: daysOfWeek,
            datasets: [{
                label: 'Activities per Day',
                data: daysOfWeek.map(day => activityCountsByDay[day]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        };

        // Also track time per day
        const minutesByDay = daysOfWeek.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});

        activities.forEach(activity => {
            const date = new Date(activity.date);
            const dayName = daysOfWeek[date.getDay()];
            minutesByDay[dayName] += parseInt(activity.duration);
        });

        // Create data for time spent by day
        const timeByDayData = {
            labels: daysOfWeek,
            datasets: [{
                label: 'Minutes per Day',
                data: daysOfWeek.map(day => minutesByDay[day]),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        };

        return {
            activityCounts: dailyActivityData,
            timeByDay: timeByDayData
        };
    };

    useEffect(() => {
        if (activities.length > 0) {
            // Calculate and set all chart data
            setProgressData(processActivitiesData(activities));
            setTimeDistributionData(processTimeDistribution(activities));
            setWeeklyTrendsData(processWeeklyTrends(activities));

            // Count activities by day (for heatmap-like display)
            const countsByDay = {};
            activities.forEach(activity => {
                const date = new Date(activity.date).toLocaleDateString();
                countsByDay[date] = (countsByDay[date] || 0) + 1;
            });
            setActivityCountsByDay(countsByDay);
        }
    }, [activities]);

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Activity Time Distribution'
            }
        }
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Activity Frequency by Day'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Activities'
                }
            }
        }
    };

    const timeByDayOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Minutes Spent by Day'
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
                icon: FaRegClock,
                color: 'bg-blue-100 text-blue-600'
            },
            {
                title: 'Activity Streak',
                value: `${stats.recentStreak} days`,
                icon: FaFire,
                color: 'bg-orange-100 text-orange-600'
            },
            {
                title: 'Most Active Category',
                value: getMostActiveCategory(stats.categoryCounts),
                icon: FaTrophy,
                color: 'bg-green-100 text-green-600'
            },
            {
                title: 'Activities Recorded',
                value: activities.length,
                icon: FaCalendarAlt,
                color: 'bg-purple-100 text-purple-600'
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
        if (!Object.keys(categoryCounts).length) return 'None';
        return Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)[0][0]
            .charAt(0).toUpperCase() +
            Object.entries(categoryCounts)
                .sort(([, a], [, b]) => b - a)[0][0]
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
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {getAchievements().map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-4">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full ${stat.color}`}>
                                        <stat.icon className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Activity Recommendations */}
                    <ActivityRecommendations
                        childId={selectedChild}
                        activities={activities}
                    />

                    {/* Additional Charts Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <FaChartLine className="mr-2 text-green-600" />
                            Activity Analysis
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Development Progress Graph */}
                            {progressData && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Progress Over Time</h3>
                                    <div className="h-[300px]">
                                        <Line data={progressData} options={lineChartOptions} />
                                    </div>
                                </div>
                            )}

                            {/* Time Distribution Pie Chart */}
                            {timeDistributionData && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Time Distribution by Category</h3>
                                    <div className="h-[300px]">
                                        <Pie data={timeDistributionData} options={pieChartOptions} />
                                    </div>
                                </div>
                            )}

                            {/* Weekly Activity Patterns */}
                            {weeklyTrendsData && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Frequency by Day</h3>
                                        <div className="h-[300px]">
                                            <Bar data={weeklyTrendsData.activityCounts} options={barChartOptions} />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Time Spent by Day</h3>
                                        <div className="h-[300px]">
                                            <Bar data={weeklyTrendsData.timeByDay} options={timeByDayOptions} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Activity Calendar (simplified) */}
                        {activityCountsByDay && Object.keys(activityCountsByDay).length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Calendar</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(activityCountsByDay).map(([date, count]) => (
                                            <div key={date} className="text-center">
                                                <div
                                                    className={`w-10 h-10 flex items-center justify-center rounded-full 
                                                        ${count > 3 ? 'bg-green-500' :
                                                            count > 1 ? 'bg-green-300' : 'bg-green-100'} 
                                                        text-white font-medium`}
                                                    title={`${count} activities on ${date}`}
                                                >
                                                    {count}
                                                </div>
                                                <div className="text-xs mt-1 text-gray-500">
                                                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <FaChild className="mx-auto text-5xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">Select a child to see insights</h3>
                    <p className="text-gray-500 mt-2">
                        Choose a child from the dropdown above to view AI-powered analytics and recommendations
                    </p>
                </div>
            )}
        </div>
    );
};

export default SmartInsightsPage; 