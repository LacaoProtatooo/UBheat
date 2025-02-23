import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudRain,
  faWind,
  faThermometerHalf,
} from "@fortawesome/free-solid-svg-icons";
import Prediction from "./prediction"; // Import the Prediction component
import UserList from "../UserList"; // Import the UserList component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HeatmapDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState("temperature"); // Default selected data
  const [news, setNews] = useState([]); // State for storing news articles
  const [city, setCity] = useState("");
  const [cityWeather, setCityWeather] = useState(null);
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key
  const NEWS_API_KEY = "934c0580d10f4bb393731591d07b3515"; // Replace with your NewsAPI key

  // Fetch weather data from OpenWeather API
  const fetchWeatherData = async () => {
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
            icon: entry.weather[0].icon, // Weather icon code
          };
        }

        dailyData[date].tempSum += entry.main.temp;
        dailyData[date].humiditySum += entry.main.humidity;
        dailyData[date].windSum += entry.wind.speed;
        dailyData[date].count += 1;
      });

      // Convert to an array for charting
      const forecastArray = Object.keys(dailyData)
        .slice(0, 3) // Get only 3 days
        .map((date) => ({
          date,
          avgtemp_c: (dailyData[date].tempSum / dailyData[date].count).toFixed(1),
          avghumidity: (dailyData[date].humiditySum / dailyData[date].count).toFixed(1),
          maxwind_kph: (dailyData[date].windSum / dailyData[date].count).toFixed(1),
          condition: dailyData[date].condition,
          icon: dailyData[date].icon,
        }));

      setWeatherData(forecastArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
    }
  };

  // Fetch weather-related news from NewsAPI
  const fetchWeatherNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=weather+Philippines&apiKey=${NEWS_API_KEY}`
      );
      setNews(response.data.articles.slice(0, 2)); // Get top 2 articles
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Fetch weather data for a specific city
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

  useEffect(() => {
    fetchWeatherData();
    fetchWeatherNews();

    // Refresh news every 5 minutes
    const newsInterval = setInterval(fetchWeatherNews, 5 * 60 * 1000);

    return () => clearInterval(newsInterval); // Cleanup interval on unmount
  }, []);

  // Prepare data for the line chart
  const lineChartData = {
    labels: weatherData.map((day) => day.date),
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData.map((day) => day.avgtemp_c),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        hidden: selectedData !== "temperature",
      },
      {
        label: "Humidity (%)",
        data: weatherData.map((day) => day.avghumidity),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        hidden: selectedData !== "humidity",
      },
      {
        label: "Wind Speed (kph)",
        data: weatherData.map((day) => day.maxwind_kph),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        hidden: selectedData !== "wind",
      },
    ],
  };

  // Prepare data for the pie chart (temperature distribution)
  const pieChartData = {
    labels: weatherData.map((day) => day.date),
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData.map((day) => day.avgtemp_c),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "3-Day Weather Forecast in the Philippines",
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Temperature Distribution Over 3 Days",
      },
    },
  };

  if (loading) {
    return <div className="p-4">Loading weather data...</div>;
  }

  return (
    <div className="w-full mx-auto p-4 border border-gray-300 rounded-md bg-gradient-to-r from-blue-100 to-blue-200 shadow-md">
      <h3 className="text-xl font-semibold mb-3">Weather Dashboard</h3>

      {/* Interactive Filters */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedData("temperature")}
          className={`px-4 py-2 rounded-md ${
            selectedData === "temperature"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faThermometerHalf} className="mr-2" />
          Temperature
        </button>
        <button
          onClick={() => setSelectedData("humidity")}
          className={`px-4 py-2 rounded-md ${
            selectedData === "humidity"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faCloudRain} className="mr-2" />
          Humidity
        </button>
        <button
          onClick={() => setSelectedData("wind")}
          className={`px-4 py-2 rounded-md ${
            selectedData === "wind"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faWind} className="mr-2" />
          Wind Speed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 3-Day Forecast */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h4 className="text-lg font-semibold mb-2">3-Day Forecast</h4>
          <div className="space-y-2">
            {weatherData.map((day, index) => (
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
                <p>Temperature: {day.avgtemp_c}°C</p>
                <p>Humidity: {day.avghumidity}%</p>
                <p>Wind Speed: {day.maxwind_kph} kph</p>
              </div>
            ))}
          </div>

          {/* Interactive City Weather Search */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Search City Weather</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={fetchCityWeather}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Search
              </button>
            </div>
            {cityWeather && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md">
                <h4 className="text-lg font-semibold mb-2">{cityWeather.name}</h4>
                <p>Temperature: {cityWeather.main.temp}°C</p>
                <p>Humidity: {cityWeather.main.humidity}%</p>
                <p>Wind Speed: {cityWeather.wind.speed} kph</p>
                <p>Condition: {cityWeather.weather[0].description}</p>
              </div>
            )}
          </div>

          {/* Prediction Component */}
          <div className="mt-4">
            <Prediction />
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h4 className="text-lg font-semibold mb-2">Weather Trends</h4>
          <div className="w-full h-420 mx-auto">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">
                Temperature Distribution
              </h4>
              <div className="w-full h-250 mx-auto">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>

            {/* Real-time Weather News */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Latest Weather News</h4>
              <div className="space-y-4">
                {news.map((article, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {article.title}
                    </a>
                    <p className="text-sm text-gray-600">{article.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="mt-8">
        <UserList />
      </div>
    </div>
  );
};

export default HeatmapDashboard;