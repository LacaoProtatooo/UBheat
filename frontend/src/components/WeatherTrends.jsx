import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const WeatherTrends = () => {
  const [weatherData, setWeatherData] = useState([]);
  const API_KEY = "b05f228625b60990de863e6193f998af"; // OpenWeather API key

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Philippines&units=metric&appid=${API_KEY}`
      );

      const dailyData = {};
      response.data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];

        if (!dailyData[date]) {
          dailyData[date] = {
            tempSum: 0,
            humiditySum: 0,
            windSum: 0,
            count: 0,
          };
        }

        dailyData[date].tempSum += entry.main.temp;
        dailyData[date].humiditySum += entry.main.humidity;
        dailyData[date].windSum += entry.wind.speed;
        dailyData[date].count += 1;
      });

      const forecastArray = Object.keys(dailyData).map((date) => ({
        date,
        avgtemp_c: (dailyData[date].tempSum / dailyData[date].count).toFixed(1),
        avghumidity: (dailyData[date].humiditySum / dailyData[date].count).toFixed(1),
        maxwind_kph: (dailyData[date].windSum / dailyData[date].count).toFixed(1),
      }));

      setWeatherData(forecastArray);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const lineChartData = {
    labels: weatherData.map((day) => day.date),
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData.map((day) => day.avgtemp_c),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Humidity (%)",
        data: weatherData.map((day) => day.avghumidity),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
      },
      {
        label: "Wind Speed (kph)",
        data: weatherData.map((day) => day.maxwind_kph),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Weather Trends in the Philippines",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h4 className="text-lg font-semibold mb-2">Weather Trends</h4>
      <div className="w-full h-420 mx-auto">
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default WeatherTrends;