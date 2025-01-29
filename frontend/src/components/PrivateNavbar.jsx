import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const PrivateNavbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userName, setUserName] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { name } = JSON.parse(userData);
            setUserName(name || 'User');
        }

        // Click outside handler
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setShowProfileMenu(false);
    };

    const handleSettingsClick = () => {
        navigate('/settings');
        setShowProfileMenu(false);
    };

    return (
        <nav className="bg-white shadow-sm h-16 sticky top-0 right-0 left-64 z-10">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search activities, milestones..."
                            className="w-64 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <LanguageSelector />
                    {/* Notifications */}
                    <button
                        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                        onClick={() => navigate('/notifications')}
                    >
                        <FaBell size={20} />
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Profile Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FaUserCircle size={24} className="text-gray-600" />
                            <span className="text-gray-700 font-medium">{userName}</span>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                <button
                                    onClick={handleProfileClick}
                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <FaUserCircle className="mr-2" /> Profile
                                </button>
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <FaCog className="mr-2" /> Settings
                                </button>
                                <hr className="my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center"
                                >
                                    <FaSignOutAlt className="mr-2" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PrivateNavbar;