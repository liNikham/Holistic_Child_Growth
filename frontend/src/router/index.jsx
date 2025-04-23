import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/DashBoard";
import LandingPage from "../pages/LandingPage";
import AddChildProfile from "../components/AddChildProfile";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import ActivitySuggestions from "../pages/ActivitySuggestions";
import GrowthJournal from "../pages/GrowthJournal";
import ChildDashboard from "../pages/ChildDashboard";
import ParentProfile from '../pages/ParentProfile';
import ActivityPage from "../pages/ActivityPage";
import DailyEntry from "../pages/DailyEntry";
import ParentQuery from "../pages/ParentQuery";
import JournalQuery from "../pages/JournalQuery";
import MonthlySummary from "../pages/MonthlySummary";
import ChildJournal from "../pages/ChildJournal";
import Milestones from "../pages/Milestones";
import RecommendationsPage from '../pages/RecommendationsPage';
import SmartInsightsPage from "../pages/SmartInsightsPage";
import Who from "../pages/Who";

const PrivateRoute = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes wrapped in PublicLayout */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Private Routes wrapped in PrivateLayout */}
                <Route element={
                    <PrivateRoute>
                        <PrivateLayout />
                    </PrivateRoute>
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-child-profile" element={<AddChildProfile />} />
                    <Route path="/child/:childId" element={<ChildDashboard />} />
                    <Route path="/milestones" element={<Milestones />} />
                    <Route path="/child/:childId/activities" element={<ActivityPage />} />
                    <Route path="/growth-journal" element={<GrowthJournal />} />
                    <Route path="/profile" element={<ParentProfile />} />
                    <Route path="/daily-entry" element={<DailyEntry />} />
                    <Route path="/parent-query" element={<ParentQuery />} />
                    <Route path="/journal-query" element={<JournalQuery />} />
                    <Route path="/monthly-summary" element={<MonthlySummary />} />
                    <Route path="/child-journal" element={<ChildJournal />} />
                    <Route path="/recommendations/:childId" element={<RecommendationsPage />} />
                    <Route path="/smart-insights" element={<SmartInsightsPage />} />
                    <Route path='/who' element={<Who/>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;