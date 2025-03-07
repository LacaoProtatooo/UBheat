import React, { useState, useEffect } from "react";
import axios from "axios";

const ThreeDayForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Philippines");
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
      );

      // Process 3-hourly data to get daily averages
      const dailyData = {};
      response.data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date (YYYY-MM-DD)

        if (!dailyData[date]) {
          dailyData[date] = {
            tempSum: 0,
            humiditySum: 0,
            windSum: 0,
            count: 0,
            condition: entry.weather[0].description,
            icon: entry.weather[0].icon,
          };
        }

        dailyData[date].tempSum += entry.main.temp;
        dailyData[date].humiditySum += entry.main.humidity;
        dailyData[date].windSum += entry.wind.speed;
        dailyData[date].count += 1;
      });

      // Convert to an array for display
      const forecastArray = Object.keys(dailyData)
        .slice(0, 3) // Get only 3 days
        .map((date) => ({
          date,
          avgTemp: (dailyData[date].tempSum / dailyData[date].count).toFixed(1),
          avgHumidity: (dailyData[date].humiditySum / dailyData[date].count).toFixed(1),
          avgWind: (dailyData[date].windSum / dailyData[date].count).toFixed(1),
          condition: dailyData[date].condition,
          icon: dailyData[date].icon,
        }));

      setForecastData(forecastArray);

      // Set weather alerts if available
      if (response.data.alerts) {
        setWeatherAlerts(response.data.alerts);
      } else {
        setWeatherAlerts([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []);

  // Function to format date for better readability
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get weather background color based on temperature
  const getBackgroundColor = (temp) => {
    const temperature = parseFloat(temp);
    if (temperature >= 30) return "bg-orange-50"; 
    if (temperature >= 20) return "bg-yellow-50";
    if (temperature >= 10) return "bg-blue-50";
    return "bg-indigo-100";
  };

  // Get icon for weather condition
  const getWeatherIcon = (condition, icon) => {
    // Using more modern weather icons
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-t-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Weather Forecast</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="px-3 py-1 rounded text-sm"
            />
            <button 
              onClick={fetchForecastData}
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50"
            >
              Update
            </button>
          </div>
        </div>
        <p className="text-blue-100 mt-1">Current location: {location}</p>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white rounded-b-lg shadow-lg">
        {forecastData.map((day, index) => (
          <div 
            key={index} 
            className={`${getBackgroundColor(day.avgTemp)} rounded-lg shadow-md transition-transform hover:scale-105`}
          >
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg">{formatDate(day.date)}</h3>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <img
                    src={getWeatherIcon(day.condition, day.icon)}
                    alt={day.condition}
                    className="w-16 h-16"
                  />
                  <span className="text-2xl font-bold text-gray-900 ml-2">{day.avgTemp}°C</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 capitalize">{day.condition}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  <span className="text-gray-700">{day.avgHumidity}%</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                  </svg>
                  <span className="text-gray-700">{day.avgWind} kph</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weather Alerts Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          Weather Alerts
        </h3>
        
        {weatherAlerts.length > 0 ? (
          <div className="space-y-3">
            {weatherAlerts.map((alert, index) => (
              <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex justify-between">
                  <h4 className="font-bold text-red-700">{alert.event}</h4>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">Alert</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  For: <span className="font-medium">{alert.areas?.join(", ")}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.start * 1000).toLocaleString()} - {new Date(alert.end * 1000).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-700">{alert.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-green-700">No weather alerts at the moment</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        Data provided by OpenWeather API • Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default ThreeDayForecast;