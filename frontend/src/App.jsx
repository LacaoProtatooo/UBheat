import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// UI Components
import { AuroraBackground } from "./components/ui/aurora-background";
import { ModalProvider } from "./components/ui/animated-modal";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

// Page Imports
import Dashboard from "./components/pages/Dashboard";
import About from "./components/pages/about";
import AboutV2 from "./components/pages/aboutv2";
import Chatbot from "./components/pages/chatbot";
import Heatmap from "./components/pages/Heatmap"; 
import Main from "./components/pages/main";
import Signup from "./components/pages/signup";
import Login from "./components/pages/login";
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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ModalProvider>
        <div className="relative z-10">
          <Routes>
            {/* User / Non User Routes */}
            <Route path="/" element={<Main isAuthenticated={isAuthenticated} user={user}/>} />
            <Route path="/information" element={<Information />} />
            <Route path="/about" element={<AboutV2 />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/chatbot" element={<Chatbot />} />
          
            {/* User Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} isAuthenticated={isAuthenticated} handleLogout={() => handleLogout(setIsAuthenticated, setUser, setIsAdmin)} />} />
            <Route path="/v2" element={<StaticMain isAuthenticated={isAuthenticated} user={user} handleLogout={() => handleLogout(setIsAuthenticated, setUser, setIsAdmin)} />} />
            <Route path="/comparison" element={<ProtectedRoute element={<Comparison />} isAuthenticated={isAuthenticated} />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={isAuthenticated} isAdmin={isAdmin} adminOnly={true} />} />
            <Route path="/logs" element={<ProtectedRoute element={<UserLogsPage />} isAuthenticated={isAuthenticated} isAdmin={isAdmin} adminOnly={true} />} />

            {/* Trashed? */}
            <Route path="/landing" element={<About />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/sampleheatmap" element={<SampleHeatmap />} />

          </Routes>
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;
