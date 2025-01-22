import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css';

// Admin Pages

// User / Guest Pages
import About from './components/pages/about';

function App() {

  return (
    // Wala pang Routes / Modalprovider, ToastProvider, etc.
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
