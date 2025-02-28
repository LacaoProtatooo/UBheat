import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Utilities
import { ModalProvider } from './components/ui/animated-modal';
import { ToastContainer, toast } from 'react-toastify';

// Admin Pages
import HeatmapDashboard from './components/pages/HeatmapDashboard';

// Auth Pages

// User / Guest Pages
import About from './components/pages/about';
import Chatbot from './components/pages/chatbot';
import Heatmap from './components/pages/Heatmap'; 
import Main from './components/pages/main';
import Signup from './components/pages/signup';
import Login from './components/pages/login';
import ProfilePage from './components/pages/ProfilePage';
import Prediction from './components/pages/prediction';
import SampleHeatmap from './components/pages/sampleheatmap';
import UserLogsPage from "./components/pages/UserLogsPage";
import StaticMain from './components/pages/staticmain';
import Information from './components/pages/information';
import Comparison from './components/pages/comparison';

function App() {
  return (
    
      <Router
          future={{

            v7_startTransition: true, // Enable React.startTransition for smoother updates
            v7_relativeSplatPath: true, // Enable updated relative splat path resolution
          }}
      >
          <ModalProvider>
            <ToastContainer />
            <div className="relative z-10">
              <Routes>
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/landing" element={<About />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/heatmap" element={<Heatmap />} />
                <Route path="/sampleheatmap" element={<SampleHeatmap />} />
                <Route path="/dashboard" element={<HeatmapDashboard />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/logs" element={<UserLogsPage />} />
                <Route path="/v2" element={<StaticMain />} />
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
