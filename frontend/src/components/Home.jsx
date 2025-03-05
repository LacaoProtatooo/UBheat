import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = ({ users, cityWeather, fetchCityWeather, city, setCity }) => {
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key

  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=Philippines&units=metric&appid=${API_KEY}`
        );
        setWeatherAlerts(response.data.alerts || []);
      } catch (error) {
        console.error("Error fetching weather alerts:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/notifications'); // Replace with your actual API endpoint
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchWeatherAlerts();
    fetchNotifications();
  }, []);

  // Log users data to debug
  console.log("Users data:", users);

  // Data for the user status bar chart
  const activeUsers = users.filter(user => user.isActive).length;
  const deactivatedUsers = users.filter(user => !user.isActive).length;

  const userStatusData = {
    labels: ["Active Users", "Deactivated Users"],
    datasets: [
      {
        label: "User Status",
        data: [activeUsers, deactivatedUsers],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "User Status Distribution",
      },
    },
  };

  const [performanceStats, setPerformanceStats] = useState({
    loadTime: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    const memoryUsage = window.performance.memory ? (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';

    setPerformanceStats({
      loadTime,
      memoryUsage,
    });
  }, []);
  return (
    <div>
      {/* Grid Layout for Home */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Counter */}
        <div className="p-4 border border-gray-200 rounded-md shadow-sm">
          <h4 className="text-lg font-semibold mb-2">User Count</h4>
          <p className="text-2xl font-bold">{users.length} Users</p>
        </div>

        {/* City Weather Search */}
        <div className="p-4 border border-gray-200 rounded-md shadow-sm">
          <h4 className="text-lg font-semibold mb-2">Search City Weather</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="px-4 py-2 border border-gray-300 rounded-md flex-1"
            />
            <button
              onClick={fetchCityWeather}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Search
            </button>
          </div>
          {cityWeather && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">{cityWeather.name}</h4>
              <p>Temperature: {cityWeather.main.temp}°C</p>
              <p>Humidity: {cityWeather.main.humidity}%</p>
              <p>Wind Speed: {cityWeather.wind.speed} kph</p>
              <p>Condition: {cityWeather.weather[0].description}</p>
            </div>
          )}
        </div>

        {/* User Status Bar Chart */}
        <div className="p-4 border border-gray-200 rounded-md shadow-sm">
          <h4 className="text-lg font-semibold mb-2">User Status</h4>
          <div className="h-48">
            <Bar data={userStatusData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 border border-gray-200 rounded-md shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Browser Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h4 className="text-lg font-semibold mb-2">Page Load Time</h4>
            <p className="text-2xl font-bold">{performanceStats.loadTime} ms</p>
          </div>
          <div className="p-4 bg-green-50 rounded-md">
            <h4 className="text-lg font-semibold mb-2">Memory Usage</h4>
            <p className="text-2xl font-bold">{performanceStats.memoryUsage}</p>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="mt-8 p-4 border border-gray-200 rounded-md shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Weather Alerts</h4>
        <ul className="space-y-2">
          {weatherAlerts.length > 0 ? (
            weatherAlerts.map((alert, index) => (
              <li key={index} className="p-2 bg-red-50 rounded-md">
                <p className="text-sm">
                  {alert.event} for <span className="font-semibold">{alert.area}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Issued {new Date(alert.start * 1000).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <li className="p-2 bg-green-50 rounded-md">
              <p className="text-sm">No weather alerts at the moment</p>
            </li>
          )}
        </ul>
      </div>

      {/* Notifications Panel */}
      <div className="mt-8 p-4 border border-gray-200 rounded-md shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Notifications</h4>
        <ul className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={index} className={`p-2 rounded-md ${notification.type === 'signup' ? 'bg-blue-50' : notification.type === 'deactivated' ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <li className="p-2 bg-green-50 rounded-md">
              <p className="text-sm">No notifications at the moment</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;