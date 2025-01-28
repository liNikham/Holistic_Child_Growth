import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaTrophy, FaCheck, FaClock, FaPlus } from 'react-icons/fa';

const Milestones = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        category: 'physical',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const categories = {
        physical: { label: 'Physical Development', color: 'blue' },
        cognitive: { label: 'Cognitive Growth', color: 'purple' },
        social: { label: 'Social Skills', color: 'green' },
        emotional: { label: 'Emotional Development', color: 'pink' },
        language: { label: 'Language Skills', color: 'yellow' }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchMilestones();
        }
    }, [selectedChild]);

    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/children/getAllChildProfiles', {
                headers: { Authorization: `${token}` },
            });
            setChildren(response.data);
            if (response.data.length > 0) {
                setSelectedChild(response.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const fetchMilestones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`/api/milestones/${selectedChild}`, {
                headers: { Authorization: `${token}` },
            });
            setMilestones(response.data);
        } catch (error) {
            console.error('Error fetching milestones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMilestone = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('/api/milestones/create', {
                ...newMilestone,
                childId: selectedChild
            }, {
                headers: { Authorization: `${token}` },
            });
            setShowAddModal(false);
            setNewMilestone({
                title: '',
                category: 'physical',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
            fetchMilestones();
        } catch (error) {
            console.error('Error adding milestone:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Milestones</h1>
                    <p className="text-gray-600">Track and celebrate your child's achievements</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {children.map((child) => (
                            <option key={child._id} value={child._id}>
                                {child.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Add Milestone</span>
                    </button>
                </div>
            </div>

            {/* Milestones Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(categories).map(([key, { label, color }]) => (
                        <div key={key} className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className={`text-xl font-semibold mb-4 text-${color}-600 flex items-center`}>
                                <FaTrophy className="mr-2" />
                                {label}
                            </h2>
                            <div className="space-y-4">
                                {milestones
                                    .filter(m => m.category === key)
                                    .map((milestone, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className={`p-2 bg-${color}-100 rounded-full`}>
                                                <FaStar className={`text-${color}-500`} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{milestone.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(milestone.date).toLocaleDateString()}
                                                </p>
                                                {milestone.notes && (
                                                    <p className="text-sm text-gray-600 mt-1">{milestone.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Milestone Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Milestone</h2>
                        <form onSubmit={handleAddMilestone} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newMilestone.title}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newMilestone.category}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {Object.entries(categories).map(([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Achieved
                                </label>
                                <input
                                    type="date"
                                    value={newMilestone.date}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={newMilestone.notes}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Milestone
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Milestones; 