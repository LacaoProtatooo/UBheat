import React, { useState, useEffect } from "react";
import axios from "axios";

const ThreeDayForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key

  const fetchForecastData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Philippines&units=metric&appid=${API_KEY}`
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading forecast data...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h4 className="text-lg font-semibold mb-2">3-Day Weather Forecast</h4>
      <div className="space-y-2">
        {forecastData.map((day, index) => (
          <div key={index} className="p-2 border border-gray-200 rounded-md">
            <p className="font-medium">{day.date}</p>
            <div className="flex items-center">
              <img
                src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.condition}
                className="w-8 h-8 mr-2"
              />
              <p>Condition: {day.condition}</p>
            </div>
            <p>Temperature: {day.avgTemp}°C</p>
            <p>Humidity: {day.avgHumidity}%</p>
            <p>Wind Speed: {day.avgWind} kph</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeDayForecast;