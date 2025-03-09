import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import WeatherTrends from "../WeatherTrends";
import HeatPredictionModel from "../HeatPredictionModel";
import TemperatureDistribution from "../TemperatureDistribution";
import ThreeDayForecast from "../ThreeDayForecast";
import NewsSection from "../NewsSection";
import UserList from "../UserList";
import Home from "../Home"; // Import the Home component
import UserLogsPage from "./UserLogsPage";
import { useUserStore } from "../store/zuser";
import axios from "axios";
import { checkAuthStatus, handleLogout } from "../../utils/userauth";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Header component receives the logout function as a prop.
const Header = ({ logout }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <button onClick={logout} className="text-red-500 hover:text-red-700">
              <AiOutlineLogout className="inline-block mr-2" /> Log Out
            </button>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Home"); // Default to Home
  const [city, setCity] = useState("");
  const [cityWeather, setCityWeather] = useState(null);
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key

  // Auth state declarations
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Use zustand store for users
  const { users, fetchUsers } = useUserStore();
  const navigate = useNavigate();

  // Fetch city weather data from OpenWeather API
  const fetchCityWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setCityWeather(response.data);
    } catch (error) {
      console.error("Error fetching city weather data:", error);
    }
  };

  // Fetch auth info and users on component mount
  useEffect(() => {
    const storedAuth = checkAuthStatus();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedAdmin = localStorage.getItem("isAdmin") === "true";

    setIsAuthenticated(storedAuth);
    setCurrentUser(storedUser);
    setIsAdmin(storedAdmin);

    fetchUsers();
  }, [fetchUsers]);

  // Logout function using handleLogout from userauth
  const logout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  // Function to render the active component based on the sidebar selection.
  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return (
          <Home
            users={users}
            cityWeather={cityWeather}
            fetchCityWeather={fetchCityWeather}
            city={city}
            setCity={setCity}
          />
        );
      case "WeatherTrends":
        return <WeatherTrends />;
      case "HeatPredictionModel":
        return <HeatPredictionModel />;
      case "TemperatureDistribution":
        return <TemperatureDistribution />;
      case "ThreeDayForecast":
        return <ThreeDayForecast />;
      case "NewsSection":
        return <NewsSection />;
      case "UserLogsPage":
        return <UserLogsPage />;
      case "UserList":
        return <UserList />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with logout */}
      <Header logout={logout} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar setActiveComponent={setActiveComponent} />

        {/* Main Content */}
        <div className="flex-1 p-4 ml-16">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
