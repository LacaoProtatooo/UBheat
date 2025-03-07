import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
        const response = await axios.get('http://localhost:5000/api/auth/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchWeatherAlerts();
    fetchNotifications();
  }, []);

  // Data for the user status doughnut chart
  const activeUsers = users.filter(user => user.isActive).length;
  const deactivatedUsers = users.filter(user => !user.isActive).length;

  const userStatusData = {
    labels: ["Active Users", "Deactivated Users"],
    datasets: [
      {
        label: "User Status",
        data: [activeUsers, deactivatedUsers],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  // Options for the doughnut chart
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: "User Status Distribution",
        font: {
          size: 16,
          weight: "bold"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
    cutout: '70%'
  };

  const [performanceStats, setPerformanceStats] = useState({
    loadTime: 0,
    memoryUsage: 0,
    cpuUsage: 'N/A'
  });

  useEffect(() => {
    const loadTime = window.performance.timing 
      ? window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
      : 0;
    const memoryUsage = window.performance.memory 
      ? (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB' 
      : 'N/A';

    setPerformanceStats({
      loadTime,
      memoryUsage,
      cpuUsage: 'N/A' // Placeholder as browser API doesn't provide this directly
    });
  }, []);

  // Weather icon mapping
  const getWeatherIcon = (description) => {
    const iconMap = {
      'clear sky': '☀️',
      'few clouds': '🌤️',
      'scattered clouds': '☁️',
      'broken clouds': '☁️',
      'shower rain': '🌧️',
      'rain': '🌦️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'mist': '🌫️'
    };
    
    for (const [key, value] of Object.entries(iconMap)) {
      if (description.toLowerCase().includes(key)) {
        return value;
      }
    }
    return '🌡️'; // Default icon
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Count Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-4 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{users.length}</p>
              <p className="text-sm text-gray-500 mt-1">
                {activeUsers} active ({Math.round((activeUsers / users.length) * 100)}%)
              </p>
            </div>
          </div>
          
          {/* Page Load Time Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-4 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Page Load Time</p>
              <p className="text-3xl font-bold text-gray-800">{performanceStats.loadTime} ms</p>
              <p className="text-sm text-gray-500 mt-1">
                Memory: {performanceStats.memoryUsage}
              </p>
            </div>
          </div>
          
          {/* Weather Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-4 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Weather Alerts</p>
              <p className="text-3xl font-bold text-gray-800">{weatherAlerts.length}</p>
              <p className="text-sm text-gray-500 mt-1">
                {weatherAlerts.length > 0 ? "Active alerts" : "No active alerts"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Status Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Status</h3>
            <div className="h-64">
              <Doughnut data={userStatusData} options={doughnutChartOptions} />
            </div>
          </div>
          
          {/* City Weather Card */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Information</h3>
            <div className="flex flex-col mb-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={fetchCityWeather}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
                >
                  Search
                </button>
              </div>
              
              {cityWeather ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800 mb-1">{cityWeather.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-5xl">
                      {getWeatherIcon(cityWeather.weather[0].description)}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="text-4xl font-bold text-gray-800 mb-4">
                      {Math.round(cityWeather.main.temp)}°C
                    </div>
                    <p className="text-lg text-gray-700 capitalize mb-6">
                      {cityWeather.weather[0].description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Humidity</p>
                          <p className="font-medium">{cityWeather.main.humidity}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Wind</p>
                          <p className="font-medium">{cityWeather.wind.speed} kph</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Pressure</p>
                          <p className="font-medium">{cityWeather.main.pressure} hPa</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <p className="text-gray-500">Enter a city name to see weather information</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Notifications and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weather Alerts Panel */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Weather Alerts</h3>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {weatherAlerts.length} alerts
              </span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {weatherAlerts.length > 0 ? (
                weatherAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="font-medium text-red-800">{alert.event}</p>
                        <p className="text-sm text-red-700">for <span className="font-semibold">{alert.area}</span></p>
                        <p className="text-xs text-red-600 mt-1">
                          Issued {new Date(alert.start * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700">No weather alerts at the moment</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Notifications Panel */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {notifications.length} new
              </span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => {
                  let bgColor, borderColor, iconColor;
                  
                  switch(notification.type) {
                    case 'signup':
                      bgColor = 'bg-blue-50';
                      borderColor = 'border-blue-500';
                      iconColor = 'text-blue-500';
                      break;
                    case 'deactivated':
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-500';
                      iconColor = 'text-red-500';
                      break;
                    default:
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-500';
                      iconColor = 'text-green-500';
                  }
                  
                  return (
                    <div key={index} className={`${bgColor} border-l-4 ${borderColor} rounded-lg p-4`}>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor} mr-2 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-gray-800">{notification.message}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                            <button className="text-xs text-gray-600 hover:text-gray-800">Mark as read</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-gray-50 border-l-4 border-gray-300 rounded-lg p-4">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-600">No notifications at the moment</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Performance Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Page Load Time</p>
                  <p className="text-2xl font-bold text-blue-900">{performanceStats.loadTime} ms</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Memory Usage</p>
                  <p className="text-2xl font-bold text-green-900">{performanceStats.memoryUsage}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-800">CPU Usage</p>
                  <p className="text-2xl font-bold text-purple-900">{performanceStats.cpuUsage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;