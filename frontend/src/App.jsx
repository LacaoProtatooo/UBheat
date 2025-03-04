import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// UI Components
import { AuroraBackground } from "./components/ui/aurora-background";
import { ModalProvider } from "./components/ui/animated-modal";
import { ToastContainer } from "react-toastify";

// Page Imports
import Dashboard from "./components/pages/Dashboard";
import About from "./components/pages/about";
import AboutV2 from "./components/pages/aboutv2";
import Chatbot from "./components/pages/chatbot";
import Heatmap from "./components/pages/Heatmap"; 
import Main from "./components/pages/main";
import Signup from "./components/pages/signup";
import Login from "./components/pages/login";
import ProfilePage from "./components/pages/ProfilePage";
import Prediction from "./components/pages/prediction";
import SampleHeatmap from "./components/pages/sampleheatmap";
import UserLogsPage from "./components/pages/UserLogsPage";
import StaticMain from "./components/pages/staticmain";
import Information from "./components/pages/information";
import Comparison from "./components/pages/comparison";
import UserProfile from "./components/common/profile";

// User Authentication
import { checkAuthStatus, handleLogout } from './utils/userauth.js';
import ProtectedRoute from './components/common/protectedroute.jsx';

function App() {

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthStatus);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isAdmin, setAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const handleLogin = (userData) => {
    setIsAuthenticated(true); 
    setUser(userData);
    setAdmin(userData.isAdmin);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', userData.isAdmin.toString());
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAuth = checkAuthStatus();
    const storedAdmin = localStorage.getItem('isAdmin') === 'true';

    if (storedAuth && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setAdmin(storedAdmin);
    }
    
  }, []);

  return (
    <Router>
      <AuroraBackground className="fixed inset-0 z-0" />
      <ModalProvider>
        <ToastContainer />
        <div className="relative z-10">
          <Routes>
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/landing" element={<About />} />
            <Route path="/about" element={<AboutV2 />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/sampleheatmap" element={<SampleHeatmap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profilev2" element={<ProtectedRoute element={<UserProfile />} isAuthenticated={isAuthenticated} />} />
            <Route path="/logs" element={<UserLogsPage />} />
            <Route path="/v2" element={<StaticMain isAuthenticated={isAuthenticated} user={user} handleLogout={() => handleLogout(setIsAuthenticated, setUser, setIsAdmin)} />} />
            <Route path="/information" element={<Information />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/" element={<Main />} />
          </Routes>
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;
