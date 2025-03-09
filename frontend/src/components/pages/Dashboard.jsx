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

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:underline">Logout</a>
            </li>
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

  // Use zustand store for users
  const { users, fetchUsers } = useUserStore();

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

  // Fetch users on component mount using the zustand store function
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar setActiveComponent={setActiveComponent} />

        {/* Main Content */}
        <div className="flex-1 p-4 ml-16">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
