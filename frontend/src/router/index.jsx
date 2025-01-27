import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/DashBoard";
import LandingPage from "../pages/LandingPage";
import AddChildProfile from "../components/AddChildProfile";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import MilestoneTracker from "../pages/MilestoneTracker";
import ActivitySuggestions from "../pages/ActivitySuggestions";
import GrowthJournal from "../pages/GrowthJournal";
import ChildDashboard from "../pages/ChildDashboard";
import ParentProfile from '../pages/ParentProfile';

const PrivateRoute = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicLayout>
                            <LandingPage />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicLayout>
                            <LoginPage />
                        </PublicLayout>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicLayout>
                            <RegisterPage />
                        </PublicLayout>
                    }
                />

                {/* Private Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <Dashboard />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-child-profile"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <AddChildProfile />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/child/:id"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <ChildDashboard />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/milestones"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <MilestoneTracker />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/activities"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <ActivitySuggestions />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/growth-journal"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <GrowthJournal />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <PrivateLayout>
                                <ParentProfile />
                            </PrivateLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;