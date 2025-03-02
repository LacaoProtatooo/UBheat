import React, { useState, useEffect, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const dashboardRef = useRef(null); // Reference to the dashboard container

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

  const generatePDF = async () => {
    const dashboardElement = dashboardRef.current;
  
    // Fetch user data from the database
    let userLogs = [];
    try {
      const response = await axios.get('/api/users'); // Adjust the endpoint as needed
      userLogs = response.data.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified ? "Verified" : "Not Verified",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  
    html2canvas(dashboardElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      // Add a cover page
      pdf.setFontSize(22);
      pdf.text("UBheat Dashboard Report", 20, 30);
      pdf.setFontSize(16);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
  
      // Add the dashboard content
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  
      // Add explanations for the graphs
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text("Explanation of Graphs and Data", 20, 20);
      pdf.setFontSize(12);
  
      const graphExplanations = `
        1. Line Chart: 3-Day Weather Forecast
        - Purpose: Visualizes the 3-day weather forecast for the Philippines, showing trends in temperature, humidity, and wind speed.
        - How It’s Created: Data is fetched from the OpenWeather API, processed to calculate daily averages, and rendered using react-chartjs-2.
        - How Data Changes: The chart updates dynamically based on API responses and user interactions.
  
        2. Pie Chart: Temperature Distribution Over 3 Days
        - Purpose: Shows the distribution of average temperatures over the next 3 days.
        - How It’s Created: Uses the same processed weather data to calculate average temperatures for each day.
        - How Data Changes: The pie chart updates as new weather data is fetched.
  
        3. User Monitoring Section
        - Purpose: Displays user activity logs, including entries and interactions with the dashboard.
        - How It’s Created: The UserList component fetches and displays user data in a tabular format.
        - How Data Changes: New user activities are appended to the log in real-time.
      `;
  
      pdf.text(graphExplanations, 20, 30, { maxWidth: 170 });
  
      // Add user monitoring table
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text("User Monitoring Logs", 20, 20);
      pdf.setFontSize(12);
  
      // Create table headers
      pdf.text("First Name", 20, 40);
      pdf.text("Last Name", 60, 40);
      pdf.text("Email", 100, 40);
      pdf.text("Status", 160, 40);
  
      // Add table rows
      userLogs.forEach((user, index) => {
        const y = 50 + index * 10;
        pdf.text(user.firstName, 20, y);
        pdf.text(user.lastName, 60, y);
        pdf.text(user.email, 100, y);
        pdf.text(user.isVerified, 160, y);
      });
  
      // Add a footer
      pdf.setFontSize(10);
      pdf.text("© 2023 Technological University of the Philippines - Taguig", 20, 280);
  
      // Save the PDF
      pdf.save("dashboard_report.pdf");
    });
  };

  if (loading) {
    return <div className="p-4">Loading weather data...</div>;
  }

  return (
    <div ref={dashboardRef} className="w-full mx-auto p-4 border border-gray-300 rounded-md bg-gradient-to-r from-blue-100 to-blue-200 shadow-md">
      {/* Header Section */}
      <div className="text-center mb-6">
        <img src="/tuplogo.png" alt="TUP Logo" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES-TAGUIG</h1>
        <h2 className="text-xl font-semibold">BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY</h2>
        <p className="text-sm">Km.14 East Service Road, Western Bicutan, Taguig City 1630, Metro Manila, Philippines</p>
        <div className="border-b-2 border-gray-400 my-4"></div>
      </div>

      <h3 className="text-xl font-semibold mb-3">UBheat Dashboard</h3>

      {/* Add a button to generate the PDF */}
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Generate PDF Report
      </button>

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