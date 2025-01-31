import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Admin Pages

// Auth Pages

// User / Guest Pages
import About from './components/pages/about';
import Heatmap from './components/pages/Heatmap'; // Import the Heatmap component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/heatmap" element={<Heatmap />} /> {/* Add Heatmap route */}
      </Routes>
    </Router>
  );
}

export default App;
