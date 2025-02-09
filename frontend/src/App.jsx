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

function App() {
  return (
    <Router
        future={{
          v7_startTransition: true, // Enable React.startTransition for smoother updates
          v7_relativeSplatPath: true, // Enable updated relative splat path resolution
        }}
    >
      <ModalProvider>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/dashboard" element={<HeatmapDashboard />} />
        <Route path="/" element={<Main />} />
      </Routes>
      </ModalProvider>
    </Router>
  );
}

export default App;
