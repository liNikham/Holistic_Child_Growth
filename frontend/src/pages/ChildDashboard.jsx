import React from 'react';
import { useParams } from 'react-router-dom';
import ActivityCalendar from '../components/ActivityCalendar';
import FloatingButton from '../components/FloatingButtonApp';

const ChildDashboard = () => {
    const { id } = useParams();
    const [showLogModal, setShowLogModal] = React.useState(false);

    // Demo data for the selected child
    const childData = {
        id: id,
        name: id === "1" ? "Sarah Johnson" : "Michael Johnson",
        age: id === "1" ? "4 years" : "2 years",
        recentActivities: [
            {
                title: 'Reading Time',
                category: 'Cognitive',
                duration: '15 mins',
                date: '2024-03-15T10:00:00.000Z',
                description: 'Read "The Very Hungry Caterpillar"',
            },
            {
                title: 'Physical Exercise',
                category: 'Physical',
                duration: '20 mins',
                date: '2024-03-16T14:00:00.000Z',
                description: 'Practiced walking on balance beam',
            }
        ],
        upcomingMilestones: [
            { name: 'Speaks in complete sentences', category: 'Language', dueDate: '2024-04-01' },
            { name: 'Catches a bounced ball', category: 'Physical', dueDate: '2024-04-15' }
        ],
        growthStats: {
            height: '102 cm',
            weight: '16 kg',
            lastCheckup: '2024-02-15'
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Child Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{childData.name}</h1>
                        <p className="text-gray-600">{childData.age}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Update Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Growth Statistics</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Height</span>
                            <span className="font-medium">{childData.growthStats.height}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Weight</span>
                            <span className="font-medium">{childData.growthStats.weight}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Checkup</span>
                            <span className="font-medium">{childData.growthStats.lastCheckup}</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Milestones */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Milestones</h2>
                    <div className="space-y-4">
                        {childData.upcomingMilestones.map((milestone, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4">
                                <p className="font-medium">{milestone.name}</p>
                                <p className="text-sm text-gray-500">
                                    {milestone.category} • Due {new Date(milestone.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {childData.recentActivities.map((activity, index) => (
                            <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{activity.title}</p>
                                        <p className="text-sm text-gray-500">{activity.description}</p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {activity.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity Calendar */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Activity Calendar</h2>
                <ActivityCalendar activities={childData.recentActivities} />
            </div>

            <FloatingButton onClick={() => setShowLogModal(true)} />
        </div>
    );
};

export default ChildDashboard; 