import React from 'react';

const GrowthJournal = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Growth Journal</h1>

            {/* Add Entry Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter a title for this entry"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="4"
                            placeholder="Write your observations..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Add Photos
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Save Entry
                    </button>
                </form>
            </div>

            {/* Journal Entries List */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Recent Entries</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">First Steps!</h3>
                            <p className="text-gray-500">March 15, 2024</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Today was an exciting day! Took their first independent steps across the room.
                    </p>
                    <div className="flex gap-2">
                        <img
                            src="/placeholder-image.jpg"
                            alt="First Steps"
                            className="w-24 h-24 object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthJournal; 