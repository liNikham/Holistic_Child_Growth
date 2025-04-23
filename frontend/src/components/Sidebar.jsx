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
    FaChevronRight,
    FaGlobe
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    // const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState('');

    const menuItems = [
        {
            path: '/dashboard',
            name: 'dashboard',
            icon: FaHome
        },
          {
            path: '/who',
            name: 'who',
            icon: FaGlobe
        },
        {
            path: '/create-child-profile',
            name: 'addChild',
            icon: FaChild
        },
        {
            path: '/daily-entry',
            name: 'dailyEntry',
            icon: FaBook
        },
        {
            path: '/child-journal',
            name: 'childJournal',
            icon: FaBook
        },
        {
            path: '/monthly-summary',
            name: 'monthlySummary',
            icon: FaChartLine
        },
        {
            path: '/journal-query',
            name: 'journalQuery',
            icon: FaBrain
        },
        {
            path: '/parent-query',
            name: 'parentQuery',
            icon: FaQuestion
        },
        {
            path: '/milestones',
            name: 'milestones',
            icon: FaStar
        },
        {
            path: '/smart-insights',
            name: 'smartInsights',
            icon: FaBrain
        },
       

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
                        const translatedName = t(`sidebar.${item.name}`);

                        return (
                            <div
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                onMouseEnter={() => handleMouseEnter(translatedName)}
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
                                    <span className="ml-3 font-medium">{translatedName}</span>
                                )}

                                {/* Tooltip */}
                                {isCollapsed && (
                                    <div
                                        className={`absolute left-full ml-2 px-3 py-2 bg-white 
                                            rounded-lg shadow-lg transition-opacity duration-200 
                                            whitespace-nowrap z-50
                                            ${activeSection === translatedName ? 'opacity-100' :
                                                'opacity-0 pointer-events-none'}`}
                                    >
                                        <p className="font-medium text-gray-800">{translatedName}</p>
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