import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaChild,
    FaUtensils,
    FaBed,
    FaSmile,
    FaTrophy,
    FaWeight,
    FaRuler,
    FaNotesMedical,
    FaCalendarDay
} from 'react-icons/fa';

const DailyEntry = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        childId: '',
        weight: '',
        height: '',
        meals: {
            breakfast: '',
            lunch: '',
            dinner: '',
            snacks: ''
        },
        sleep: {
            bedTime: '',
            wakeTime: '',
            naps: []
        },
        mood: '',
        activities: [],
        milestones: '',
        healthNotes: '',
        generalNotes: ''
    });

    // Fetch children list
    useEffect(() => {
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
        fetchChildren();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChildSelect = (childId) => {
        setSelectedChild(childId);
        setFormData(prev => ({ ...prev, childId }));
    };

    const handleActivityToggle = (activity) => {
        setFormData(prev => ({
            ...prev,
            activities: prev.activities.includes(activity)
                ? prev.activities.filter(a => a !== activity)
                : [...prev.activities, activity]
        }));
    };

    const handleAddNap = () => {
        setFormData(prev => ({
            ...prev,
            sleep: {
                ...prev.sleep,
                naps: [...prev.sleep.naps, { start: '', end: '' }]
            }
        }));
    };

    const handleNapChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            sleep: {
                ...prev.sleep,
                naps: prev.sleep.naps.map((nap, i) =>
                    i === index ? { ...nap, [field]: value } : nap
                )
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('/api/daily-entries/create', formData, {
                headers: { Authorization: `${token}` },
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating daily entry:', error);
        } finally {
            setLoading(false);
        }
    };

    const activities = [
        'Reading', 'Drawing', 'Playing Outside', 'Music',
        'Physical Exercise', 'Learning Activity', 'Social Interaction'
    ];

    const moodOptions = ['Happy', 'Calm', 'Tired', 'Fussy', 'Energetic', 'Sick'];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaCalendarDay className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Daily Entry</h1>
                        <p className="text-gray-600">Record your child's daily activities and progress</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Child
                            </label>
                            <select
                                value={selectedChild}
                                onChange={(e) => handleChildSelect(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Choose a child</option>
                                {children.map((child) => (
                                    <option key={child._id} value={child._id}>
                                        {child.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaRuler className="mr-2" /> Measurements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meals */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaUtensils className="mr-2" /> Meals
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Breakfast
                                </label>
                                <input
                                    type="text"
                                    name="meals.breakfast"
                                    value={formData.meals.breakfast}
                                    onChange={handleChange}
                                    placeholder="What did they eat?"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lunch
                                </label>
                                <input
                                    type="text"
                                    name="meals.lunch"
                                    value={formData.meals.lunch}
                                    onChange={handleChange}
                                    placeholder="What did they eat?"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dinner
                                </label>
                                <input
                                    type="text"
                                    name="meals.dinner"
                                    value={formData.meals.dinner}
                                    onChange={handleChange}
                                    placeholder="What did they eat?"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Snacks
                                </label>
                                <input
                                    type="text"
                                    name="meals.snacks"
                                    value={formData.meals.snacks}
                                    onChange={handleChange}
                                    placeholder="Any snacks?"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sleep */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaBed className="mr-2" /> Sleep Schedule
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedtime
                                </label>
                                <input
                                    type="time"
                                    name="sleep.bedTime"
                                    value={formData.sleep.bedTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Wake Time
                                </label>
                                <input
                                    type="time"
                                    name="sleep.wakeTime"
                                    value={formData.sleep.wakeTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Naps */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">Naps</label>
                                <button
                                    type="button"
                                    onClick={handleAddNap}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    + Add Nap
                                </button>
                            </div>
                            {formData.sleep.naps.map((nap, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4">
                                    <input
                                        type="time"
                                        value={nap.start}
                                        onChange={(e) => handleNapChange(index, 'start', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Start time"
                                    />
                                    <input
                                        type="time"
                                        value={nap.end}
                                        onChange={(e) => handleNapChange(index, 'end', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="End time"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mood */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaSmile className="mr-2" /> Mood
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {moodOptions.map((mood) => (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, mood }))}
                                    className={`px-4 py-2 rounded-full ${formData.mood === mood
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activities */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaChild className="mr-2" /> Activities
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {activities.map((activity) => (
                                <button
                                    key={activity}
                                    type="button"
                                    onClick={() => handleActivityToggle(activity)}
                                    className={`px-4 py-2 rounded-full ${formData.activities.includes(activity)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {activity}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaTrophy className="mr-2" /> Milestones
                        </h2>
                        <textarea
                            name="milestones"
                            value={formData.milestones}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any new achievements or milestones today?"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Health Notes */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaNotesMedical className="mr-2" /> Health Notes
                        </h2>
                        <textarea
                            name="healthNotes"
                            value={formData.healthNotes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any health-related observations or concerns?"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* General Notes */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700">Additional Notes</h2>
                        <textarea
                            name="generalNotes"
                            value={formData.generalNotes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any other observations or notes about today?"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyEntry; 