import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const PublicLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Public Navbar - Hidden on homepage */}
            {!isHomePage && (
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/" className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        Child Growth
                                    </span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-6">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 font-medium"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <main className="flex-grow">
                <Outlet />
            </main>

            {!isHomePage && (
                <footer className="bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">About Child Growth</h3>
                                <p className="text-gray-600">
                                    Empowering parents to track and celebrate their children's growth journey with AI-powered insights.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Resources</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li>
                                        <Link to="/blog" className="hover:text-blue-600 transition-colors">
                                            Parenting Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/guides" className="hover:text-blue-600 transition-colors">
                                            Development Guides
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact</h3>
                                <p className="text-gray-600">support@childgrowth.com</p>
                                <div className="mt-4 flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                        Twitter
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                        LinkedIn
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                        Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default PublicLayout;