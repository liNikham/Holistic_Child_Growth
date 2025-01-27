import React from 'react';
import { Link } from 'react-router-dom';

const PublicLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Public Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                                <span className="text-2xl font-bold text-blue-600">KidGrowth</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-blue-600">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">{children}</main>

            <footer className="bg-gray-50 border-t">
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About KidGrowth</h3>
                            <p className="text-gray-600">
                                Helping parents track and celebrate their children's growth journey.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <Link to="/blog" className="hover:text-blue-600">
                                        Parenting Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/guides" className="hover:text-blue-600">
                                        Development Guides
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <p className="text-gray-600">support@kidgrowth.com</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;