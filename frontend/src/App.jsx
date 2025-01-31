import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css';

// Admin Pages

// Auth Pages

// User / Guest Pages
import About from './components/pages/about';
import Chatbot from './components/pages/chatbot';

function App() {

  return (
    // Wala pang Routes / Modalprovider, ToastProvider, etc.
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  )
}

export default App
