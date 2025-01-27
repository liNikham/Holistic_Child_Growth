import React from 'react';

const MilestoneTracker = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Milestone Tracker</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Milestone Categories */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Physical Development</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Walks steadily</span>
                        </li>
                        <li className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Climbs stairs with support</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Cognitive Development</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Recognizes shapes</span>
                        </li>
                        <li className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Counts to five</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Social Development</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Plays with others</span>
                        </li>
                        <li className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Shows empathy</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MilestoneTracker; 