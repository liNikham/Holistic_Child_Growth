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
    FaMedal,
    FaChevronLeft,
    FaChevronRight
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
            title: 'Add Child',
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
        },
        {
            title: 'Smart Insights',
            path: '/smart-insights',
            icon: FaBrain,
            description: 'AI-powered insights and recommendations'
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
        <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-800 
            transition-all duration-300 ease-in-out z-50 flex flex-col
            ${isCollapsed ? 'w-20' : 'w-64'}`}>
            
            {/* Header Section */}
            <div className="flex-none p-4">
                <div className="flex items-center justify-between mb-6">
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-white">Child Growth</h1>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isCollapsed ? <FaChevronRight className="text-white" /> : 
                            <FaChevronLeft className="text-white" />}
                    </button>
                </div>
            </div>

            {/* Scrollable Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
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
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 
                                    group relative cursor-pointer
                                    ${isActive
                                        ? 'bg-white bg-opacity-20 text-white shadow-lg'
                                        : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                <Icon className={`text-xl ${isActive ? 'text-pink-300' : 
                                    'text-white group-hover:text-pink-300'}`} />

                                {!isCollapsed && (
                                    <span className="ml-3 font-medium">{item.title}</span>
                                )}

                                {/* Tooltip */}
                                {isCollapsed && (
                                    <div
                                        className={`absolute left-full ml-2 px-3 py-2 bg-white 
                                            rounded-lg shadow-lg transition-opacity duration-200 
                                            whitespace-nowrap z-50
                                            ${activeSection === item.title ? 'opacity-100' : 
                                            'opacity-0 pointer-events-none'}`}
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
        </div>
    );
};

export default Sidebar;