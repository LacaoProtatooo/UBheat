import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { ModalProvider } from './components/ui/animated-modal';

// Admin Pages

// Auth Pages

// User / Guest Pages
import About from './components/pages/about';
import Chatbot from './components/pages/chatbot';
import Heatmap from './components/pages/Heatmap'; 
import Main from './components/pages/main';
import HeatmapDashboard from './components/pages/HeatmapDashboard';
import Signup from './components/pages/signup';
import Login from './components/pages/login';
import ProfilePage from './components/pages/ProfilePage';
import Prediction from './components/pages/prediction';
import SampleHeatmap from './components/pages/sampleheatmap';

function App() {
  return (
    <ModalProvider>
      <Router
          future={{

            v7_startTransition: true, // Enable React.startTransition for smoother updates
            v7_relativeSplatPath: true, // Enable updated relative splat path resolution
          }}
      >
        <Routes>
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/about" element={<About />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/sampleheatmap" element={<SampleHeatmap />} />
          <Route path="/dashboard" element={<HeatmapDashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
