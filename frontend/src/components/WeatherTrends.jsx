import React, { useEffect, useState, useMemo } from "react";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Box, Typography, Grid } from '@mui/material';
import regression from 'regression';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { LineChart } from '@mui/x-charts/LineChart';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const WeatherTrends = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
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

  const barChartData = {
    labels: weatherData.map((day) => day.date),
    datasets: [
      {
        label: "Wind Speed (kph)",
        data: weatherData.map((day) => day.maxwind_kph),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Wind Speed Over 3 Days",
      },
    },
  };

  const donutChartData = {
    labels: ["Temperature", "Humidity", "Wind Speed"],
    datasets: [
      {
        label: "Weather Metrics",
        data: [
          weatherData.reduce((sum, day) => sum + parseFloat(day.avgtemp_c), 0) / weatherData.length,
          weatherData.reduce((sum, day) => sum + parseFloat(day.avghumidity), 0) / weatherData.length,
          weatherData.reduce((sum, day) => sum + parseFloat(day.maxwind_kph), 0) / weatherData.length,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Weather Metrics Distribution",
      },
    },
  };

  const historicalData = useMemo(() => ({
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    population: [
      105312992, 106735719, 108119693, 109465287, 110804683,
      112081264, 113100950, 113964338, 114891199
    ],
    co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 
                  136678980, 146142190, 155380930, 163150976],
    temperatures: [26.41, 26.47, 26.53, 26.58, 26.63, 26.67, 26.71, 26.74, 26.78]
  }), []);

  const futureData = useMemo(() => ({
    years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
    population: [115843670, 116786962, 117729254, 118671546, 
                119613838, 120556130, 121498422]
  }), []);

  const { allYears, allTemps, allMtCO2, regressionLine } = useMemo(() => {
    const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
    
    const yearTempModel = regression.linear(
      historicalData.years.map((y, i) => [y, historicalData.temperatures[i]])
    );

    const co2TempModel = regression.linear(
      mtco2.map((v, i) => [v, historicalData.temperatures[i]])
    );

    const futureMtCO2 = futureData.population.map((pop, i) => {
      const growthRate = 1.015;
      return mtco2[mtco2.length-1] * Math.pow(growthRate, i+1);
    });

    const futureYears = futureData.years;
    const futureTemps = futureMtCO2.map((co2, i) => {
      const timeProjection = yearTempModel.predict([futureYears[i]])?.[1] || 0;
      const co2Projection = co2TempModel.predict([co2])?.[1] || 0;
      return (timeProjection + co2Projection) / 2;
    });

    return {
      allYears: [...historicalData.years, ...futureData.years],
      allTemps: [...historicalData.temperatures, ...futureTemps],
      allMtCO2: [...mtco2, ...futureMtCO2],
      regressionLine: [
        ...historicalData.years.map(y => yearTempModel.predict([y])?.[1] || 0),
        ...futureYears.map(y => yearTempModel.predict([y])?.[1] || 0)
      ]
    };
  }, [historicalData, futureData]);

  const safeValueFormatter = (value, unit = '') =>
    value !== null && value !== undefined ? `${value.toFixed(2)}${unit}` : 'N/A';

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Weather Trends in the Philippines
      </Typography>

      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Weather Trends
            </Typography>
            <Line data={lineChartData} options={{ ...lineChartOptions, maintainAspectRatio: false }} />
          </Box>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Temperature Distribution
            </Typography>
            <Pie data={pieChartData} options={{ ...pieChartOptions, maintainAspectRatio: false }} />
          </Box>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Wind Speed Over 6 Days
            </Typography>
            <Bar data={barChartData} options={{ ...barChartOptions, maintainAspectRatio: false }} />
          </Box>
        </Grid>

        {/* Donut Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Weather Metrics Distribution
            </Typography>
            <Doughnut data={donutChartData} options={{ ...donutChartOptions, maintainAspectRatio: false }} />
          </Box>
        </Grid>

        {/* Gantt Chart (Placeholder) */}
        <Grid item xs={12}>
       
        </Grid>
      </Grid>

      {/* Urban Heat Prediction Model */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Philippines Urban Heat Prediction Model (2015-2030)
        </Typography>
        <LineChart
          width={600}
          height={300}
          series={[
            { 
              data: allTemps,
              label: 'Observed & Projected Temperature (°C)',
              yAxisKey: 'temp',
              color: '#ff6384',
              valueFormatter: (value) => safeValueFormatter(value, '°C'),
            },
            { 
              data: regressionLine,
              label: 'Linear Trend Line',
              yAxisKey: 'temp',
              color: '#ff0000',
              dashStyle: '5 5',
              valueFormatter: (value) => safeValueFormatter(value, '°C'),
            },
            {
              data: allMtCO2,
              label: 'CO₂ Emissions (MtCO2)',
              yAxisKey: 'co2',
              color: '#4bc0c0',
              valueFormatter: (value) => safeValueFormatter(value, ' Mt'),
            },
          ]}
          xAxis={[{
            data: allYears,
            scaleType: 'band',
            label: 'Year',
            valueFormatter: (value) => value.toString(),
          }]}
          yAxis={[
            { 
              id: 'temp', 
              label: 'Temperature (°C)',
              min: 26,
              max: 28,
              tickNumber: 8,
              labelStyle: { 
                  writingMode: 'vertical-rl',  
                  textAlign: 'center', 
                  transform: 'translate(-30px, 0px)', 
                  fontSize: '1rem'
                }
            },
            { 
              id: 'co2', 
              label: 'CO₂ Emissions (MtCO2)', 
              position: 'right',
              min: 100,
              max: 200,
              tickNumber: 5,
            },
          ]}
          margin={{ left: 90, right: 90, top: 40, bottom: 60 }}
          sx={{
            '.MuiLineElement-root': { strokeWidth: 2.5 },
            '.MuiMarkElement-root': { display: 'none' },
            '.MuiChartsAxis-tickLabel': { fontSize: '0.875rem' }
          }}
        />
        
        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
          Linear trend based on 2015-2023 data (R² = {regression.linear(
            historicalData.years.map((y, i) => [y, historicalData.temperatures[i]])
          ).r2.toFixed(3)})
        </Typography>
      </Box>
    </Box>
  );
};

export default WeatherTrends;