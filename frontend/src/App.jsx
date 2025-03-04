import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// Import your background component and other providers/pages
import { AuroraBackground } from "../src/components/ui/aurora-background";
import { ModalProvider } from "./components/ui/animated-modal";
import { ToastContainer } from "react-toastify";

// Page Imports
import HeatmapDashboard from "./components/pages/HeatmapDashboard";
import About from "./components/pages/about";
import Chatbot from "./components/pages/chatbot";
import Heatmap from "./components/pages/Heatmap"; 
import Main from "./components/pages/main";
import Signup from "./components/pages/signup";
import Login from "./components/pages/login";
import ProfilePage from "./components/pages/ProfilePage";
import Prediction from "./components/pages/prediction";
import SampleHeatmap from "./components/pages/sampleheatmap";
import UserLogsPage from "./components/pages/UserLogsPage";
<<<<<<< Updated upstream
import StaticMain from './components/pages/staticmain';
import Information from './components/pages/information';
import Comparison from './components/pages/comparison';
import Dashboard from './components/pages/Dashboard';

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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/logs" element={<UserLogsPage />} />
                <Route path="/v2" element={<StaticMain />} />
                <Route path="/information" element={<Information />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="admin" component={Dashboard} />
                <Route path="/" element={<Main />} />
              </Routes>
            </div>
        </ModalProvider>
      </Router>
=======
import StaticMain from "./components/pages/staticmain";
import Information from "./components/pages/information";
import Comparison from "./components/pages/comparison";
import AboutV2 from "./components/pages/aboutv2";

function App() {
  return (
    <Router>
      {/* Render the AuroraBackground as a fixed element that covers the entire viewport */}
      <AuroraBackground className="fixed inset-0 z-0" />
      <ModalProvider>
        <ToastContainer />
        {/* This container is placed above the background using a higher z-index */}
        <div className="relative z-10">
          <Routes>
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/landing" element={<About />} />
            <Route path="/about" element={<AboutV2 />} />
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
>>>>>>> Stashed changes
  );
}

export default App;
