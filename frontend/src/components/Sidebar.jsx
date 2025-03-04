import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFire,
  faThermometerHalf,
  faCalendarAlt,
  faNewspaper,
  faUsers,
  faUser,
  faBars,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        {/* Toggle Button */}
        <button
          className="text-white focus:outline-none mb-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Profile Section */}
        <div
          className="flex items-center space-x-2 mb-6 cursor-pointer"
          onClick={goToProfile}
        >
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} />
          </div>
          {isExpanded && <span className="text-sm">Profile</span>}
        </div>

        {/* Sidebar Links */}
        <ul>
          <li className="mb-3">
            <button
              onClick={() => setActiveComponent("Home")}
              className={`w-full text-left flex items-center space-x-2 hover:bg-gray-700 p-2 rounded ${
                activeComponent === "Home" ? "bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon={faHome} />
              {isExpanded && <span>Home</span>}
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveComponent("WeatherTrends")}
              className={`w-full text-left flex items-center space-x-2 hover:bg-gray-700 p-2 rounded ${
                activeComponent === "WeatherTrends" ? "bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} />
              {isExpanded && <span>Charts</span>}
            </button>
          </li>
        
        
          <li className="mb-3">
            <button
              onClick={() => setActiveComponent("ThreeDayForecast")}
              className={`w-full text-left flex items-center space-x-2 hover:bg-gray-700 p-2 rounded ${
                activeComponent === "ThreeDayForecast" ? "bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
              {isExpanded && <span>3-Day Forecast</span>}
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveComponent("NewsSection")}
              className={`w-full text-left flex items-center space-x-2 hover:bg-gray-700 p-2 rounded ${
                activeComponent === "NewsSection" ? "bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon={faNewspaper} />
              {isExpanded && <span>Latest Weather News</span>}
            </button>
          </li>
          <li className="mb-3">
            <button
              onClick={() => setActiveComponent("UserList")}
              className={`w-full text-left flex items-center space-x-2 hover:bg-gray-700 p-2 rounded ${
                activeComponent === "UserList" ? "bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon={faUsers} />
              {isExpanded && <span>User List</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;