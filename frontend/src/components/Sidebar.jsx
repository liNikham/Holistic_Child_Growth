import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaChild,
    FaBook,
    FaCalendarDay,
    FaChartLine,
    FaQuestion,
    FaBrain,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaHeart,
    FaStar,
    FaMedal
} from 'react-icons/fa';
// import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    // const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState('');

    const menuItems = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: FaHome,
            description: 'Overview of your children'
        },
        {
            title: 'Child Profiles',
            path: '/create-child-profile',
            icon: FaChild,
            description: 'Manage child profiles'
        },
        {
            title: 'Daily Entry',
            path: '/daily-entry',
            icon: FaCalendarDay,
            description: 'Record daily activities'
        },
        {
            title: 'Child Journal',
            path: '/child-journal',
            icon: FaBook,
            description: 'Document memories'
        },
        {
            title: 'Monthly Summary',
            path: '/monthly-summary',
            icon: FaChartLine,
            description: 'Track development progress'
        },
        {
            title: 'Journal Query',
            path: '/journal-query',
            icon: FaBrain,
            description: 'Analyze journal entries'
        },
        {
            title: 'Parent Query',
            path: '/parent-query',
            icon: FaQuestion,
            description: 'Ask AI about development'
        },
        {
            title: 'Milestones',
            path: '/milestones',
            icon: FaStar,
            description: 'Track achievements'
        }
    ];

    const handleMouseEnter = (title) => {
        setActiveSection(title);
    };

    const handleMouseLeave = () => {
        setActiveSection('');
    };

    const handleItemClick = (path) => {
        navigate(path);
        handleMouseLeave();
    };

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-800 transition-all duration-300 ease-in-out z-50 
                ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-8 bg-pink-600 text-white p-1 rounded-full shadow-lg hover:bg-pink-700 transition-colors"
            >
                {isCollapsed ? <FaBars size={16} /> : <FaTimes size={16} />}
            </button>

            {/* Logo Area */}
            <div className="p-6">
                <div className="flex items-center justify-center">
                    <div className="bg-pink-500 bg-opacity-20 p-3 rounded-xl">
                        <FaHeart className="text-2xl text-pink-300" />
                    </div>
                    {!isCollapsed && (
                        <h1 className="ml-3 text-xl font-bold text-white">
                            Child Growth
                        </h1>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="px-4">
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                onMouseEnter={() => handleMouseEnter(item.title)}
                                onMouseLeave={handleMouseLeave}
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative cursor-pointer
                                    ${isActive
                                        ? 'bg-white bg-opacity-20 text-white shadow-lg'
                                        : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                <Icon className={`text-xl ${isActive ? 'text-pink-300' : 'text-white group-hover:text-pink-300'}`} />

                                {!isCollapsed && (
                                    <span className="ml-3 font-medium">{item.title}</span>
                                )}

                                {/* Tooltip */}
                                {isCollapsed && (
                                    <div
                                        className={`absolute left-full ml-2 px-3 py-2 bg-white rounded-lg shadow-lg 
                                            transition-opacity duration-200 whitespace-nowrap z-50
                                            ${activeSection === item.title ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    >
                                        <p className="font-medium text-gray-800">{item.title}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="border-t border-white border-opacity-20 pt-4">
                    <div
                        onClick={() => handleItemClick('/settings')}
                        className="flex items-center p-3 text-white hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors cursor-pointer"
                    >
                        <FaCog className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Settings</span>}
                    </div>
                    <div
                        // onClick={logout}
                        className="flex items-center w-full p-3 text-white hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors cursor-pointer"
                    >
                        <FaSignOutAlt className="text-xl" />
                        {!isCollapsed && <span className="ml-3">Logout</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;