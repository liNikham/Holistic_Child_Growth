import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutSuccess } from '../features/userSlice';

const PrivateLayout = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                            <div className="relative group">
                                <button className="flex items-center space-x-2">
                                    <span className="text-gray-700">{currentUser?.name}</span>
                                </button>
                                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl hidden group-hover:block">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
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