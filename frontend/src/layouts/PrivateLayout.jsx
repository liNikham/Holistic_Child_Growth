import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/PrivateNavbar';

const PrivateLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        const parsedValue = saved ? JSON.parse(saved) : false;
        return parsedValue;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('sidebarCollapsed');
            const parsedValue = saved ? JSON.parse(saved) : false;
            setIsCollapsed(parsedValue);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleToggleSidebar = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue));
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={handleToggleSidebar}
            />
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} overflow-auto`}>
                <Navbar />
                <div className="p-5 ml-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default PrivateLayout; 