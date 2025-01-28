import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [entries, setEntries] = useState([]);
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        mood: '',
        media: []
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

    const moodOptions = [
        { icon: '😊', label: 'Happy' },
        { icon: '😴', label: 'Tired' },
        { icon: '😢', label: 'Sad' },
        { icon: '😡', label: 'Angry' },
        { icon: '🤒', label: 'Sick' },
        { icon: '🤗', label: 'Excited' }
    ];

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetchJournalEntries();
        }
    }, [selectedChild, selectedDate]);

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
            const response = await axios.get('/api/child-journal/entries', {
                headers: { Authorization: `${token}` },
                params: {
                    childId: selectedChild,
                    date: selectedDate
                }
            });
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching journal entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMediaUpload = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('media', file);
        });

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('/api/child-journal/upload-media', formData, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setNewEntry(prev => ({
                ...prev,
                media: [...prev.media, ...response.data.urls]
            }));
        } catch (error) {
            console.error('Error uploading media:', error);
        }
    };

    const handleSubmitEntry = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('/api/child-journal/entries', {
                ...newEntry,
                childId: selectedChild,
                date: selectedDate
            }, {
                headers: { Authorization: `${token}` },
            });
            setShowNewEntry(false);
            setNewEntry({ title: '', content: '', mood: '', media: [] });
            fetchJournalEntries();
        } catch (error) {
            console.error('Error creating journal entry:', error);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`/api/child-journal/entries/${entryId}`, {
                headers: { Authorization: `${token}` },
            });
            fetchJournalEntries();
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const toggleFavorite = async (entryId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`/api/child-journal/entries/${entryId}/toggle-favorite`, {}, {
                headers: { Authorization: `${token}` },
            });
            fetchJournalEntries();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-lg text-white">
                            <FaBook className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Child's Journal</h1>
                            <p className="text-gray-600">Capture precious moments and memories</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
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
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => setShowNewEntry(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                        >
                            <FaPlus />
                            <span>New Entry</span>
                        </button>
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
                        <p className="text-gray-500">Start capturing memories by adding a new entry</p>
                    </div>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{entry.mood}</div>
                                        <h3 className="text-xl font-semibold text-gray-800">{entry.title}</h3>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => toggleFavorite(entry._id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            {entry.isFavorite ? (
                                                <FaHeart className="text-red-500" />
                                            ) : (
                                                <FaRegHeart />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEntry(entry._id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{entry.content}</p>
                                {entry.media && entry.media.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        {entry.media.map((media, idx) => (
                                            <div key={idx} className="relative aspect-w-16 aspect-h-9">
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.url}
                                                        alt=""
                                                        className="rounded-lg object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <video
                                                        src={media.url}
                                                        controls
                                                        className="rounded-lg w-full h-full"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <FaCalendarAlt />
                                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button className="hover:text-purple-600">
                                            <FaShare />
                                        </button>
                                        <button className="hover:text-purple-600">
                                            <FaDownload />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Entry Modal */}
            {showNewEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">New Journal Entry</h2>
                            <button
                                onClick={() => setShowNewEntry(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmitEntry} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            <div className="flex flex-wrap gap-2 mb-4">
                                {moodOptions.map((mood) => (
                                    <button
                                        key={mood.label}
                                        type="button"
                                        onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.icon }))}
                                        className={`p-2 rounded-lg ${newEntry.mood === mood.icon
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className="text-xl">{mood.icon}</span>
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder="Write your entry..."
                                value={newEntry.content}
                                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-40"
                                required
                            />
                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                    <FaImage />
                                    <span>Add Media</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleMediaUpload}
                                    />
                                </label>
                                {newEntry.media.length > 0 && (
                                    <span className="text-sm text-gray-500">
                                        {newEntry.media.length} file(s) selected
                                    </span>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewEntry(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChildJournal; 