import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import WeatherTrends from "../WeatherTrends";
import HeatPredictionModel from "../HeatPredictionModel";
import TemperatureDistribution from "../TemperatureDistribution";
import ThreeDayForecast from "../ThreeDayForecast";
import NewsSection from "../NewsSection";
import UserList from "../UserList";
import Home from "../Home"; // Import the new Home component

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Home"); // Default to Home
  const [city, setCity] = useState("");
  const [cityWeather, setCityWeather] = useState(null);
  const [users, setUsers] = useState([]); // State for user list
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key

  // Fetch city weather data
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

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users"); // Replace with your API endpoint
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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
      case "UserList":
        return <UserList users={users} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setActiveComponent={setActiveComponent} />

      {/* Main Content */}
      <div className="flex-1 p-4 ml-16">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;