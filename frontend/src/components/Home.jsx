import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = ({ users, cityWeather, fetchCityWeather, city, setCity }) => {
  // Data for the user growth line graph
  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // X-axis labels
    datasets: [
      {
        label: "User Growth",
        data: [5, 10, 15, 20, 25, 30], // Y-axis data (replace with real data)
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  // Options for the line graph
  const lineGraphOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "User Growth Over Time",
      },
    },
  };

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

        {/* User Growth Line Graph */}
        <div className="p-4 border border-gray-200 rounded-md shadow-sm">
          <h4 className="text-lg font-semibold mb-2">User Growth</h4>
          <div className="h-48">
            <Line data={userGrowthData} options={lineGraphOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;