import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/DashBoard";
import AddChildProfile from "../components/AddChildProfile";
const AppRouter = ()=>{
    return (
        <Router>
            <Navbar />
            <Routes>
                 <Route path="/" element={<LoginPage />} />
                 <Route path="/register" element={<RegisterPage />} />
                 <Route path="/dashboard" element={<Dashboard />} />
                 <Route path="/create-child-profile" element={<AddChildProfile />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;