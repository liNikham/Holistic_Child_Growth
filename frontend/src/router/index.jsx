import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/LandingPage";
import DailyCapture from "../pages/DailyCapture";
import Plans from "../pages/Plans";
import Historic from "../pages/Historic";
import Navbar from "../components/Navbar";  

const AppRouter = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dailyCapture" element={<DailyCapture/>} />
                <Route path="/historic" element={<Historic/>} />
                <Route path="/plans" element={<Plans />} />

            </Routes>
        </Router>
    )
}

export default AppRouter;