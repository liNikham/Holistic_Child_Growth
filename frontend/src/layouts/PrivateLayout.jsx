import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutSuccess } from '../features/userSlice';

const PrivateLayout = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        dispatch(signOutSuccess());
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/dashboard" className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-blue-600">KidGrowth</span>
                            </Link>
                            <div className="hidden md:flex space-x-6">
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    My Children
                                </Link>
                                <Link
                                    to="/milestones"
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    Milestones
                                </Link>
                                <Link
                                    to="/activities"
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    Activities
                                </Link>
                                <Link
                                    to="/growth-journal"
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    Journal
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <img
                                        src={currentUser?.profileImage || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-gray-700 font-medium">{currentUser?.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
                                        onMouseLeave={() => setIsDropdownOpen(false)}
                                    >
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow bg-gray-50 p-6">{children}</main>

            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto py-4 px-4">
                    <p className="text-center text-gray-600">
                        © {new Date().getFullYear()} KidGrowth
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PrivateLayout;