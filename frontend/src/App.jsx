import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Admin Pages

// Auth Pages

// User / Guest Pages
import About from './components/pages/about';
import Chatbot from './components/pages/chatbot';
import Heatmap from './components/pages/Heatmap'; 
import Main from './components/pages/main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
