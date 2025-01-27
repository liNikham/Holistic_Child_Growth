import React, { useState } from 'react';
import ActivityCalendar from '../components/ActivityCalendar';
import FloatingButton from '../components/FloatingButtonApp';

const ActivitySuggestions = () => {
    const [showLogModal, setShowLogModal] = useState(false);
    const activities = [
        {
            title: 'Color Sorting',
            category: 'Cognitive',
            duration: '15 mins',
            materials: 'Colored blocks or toys',
            description: 'Help your child sort objects by color to develop recognition skills.',
            date: '2024-03-15T10:00:00.000Z',
        },
        {
            title: 'Balance Beam',
            category: 'Physical',
            duration: '20 mins',
            materials: 'Tape or rope',
            description: 'Create a line on the floor for walking practice to improve balance.',
            date: '2024-03-16T14:00:00.000Z',
        },
        {
            title: 'Story Time',
            category: 'Language',
            duration: '15 mins',
            materials: 'Age-appropriate books',
            description: 'Read together and ask questions about the story.',
            date: '2024-03-17T09:00:00.000Z',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Activity Suggestions</h1>
                <p className="text-gray-600 mb-4">
                    Explore age-appropriate activities to support your child's development
                </p>
            </div>

            {/* Activity Calendar Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Activity Calendar</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <ActivityCalendar activities={activities} />
                </div>
            </div>

            {/* Suggested Activities Grid */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Recommended Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">{activity.title}</h3>
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {activity.category}
                                </span>
                            </div>
                            <div className="mb-4">
                                <span className="text-gray-600 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {activity.duration}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{activity.description}</p>
                            <div className="text-sm text-gray-500">
                                <strong>Materials needed:</strong>
                                <p className="mt-1">{activity.materials}</p>
                            </div>
                            <button className="mt-4 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
                                Add to Calendar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Button for Adding New Activity */}
            <FloatingButton onClick={() => setShowLogModal(true)} />

            {/* Activity Log Modal */}
            {showLogModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Log New Activity</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Activity Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter activity name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option>Physical</option>
                                    <option>Cognitive</option>
                                    <option>Language</option>
                                    <option>Social</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowLogModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save Activity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitySuggestions; 