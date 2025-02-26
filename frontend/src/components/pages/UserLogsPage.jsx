import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import LogReportPDF from "../LogReportPDF";
import html2canvas from "html2canvas";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [chartImage, setChartImage] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch logs from localStorage or an API
    const storedLogs = JSON.parse(localStorage.getItem("userLogs")) || [];
    setLogs(storedLogs);
  }, []);

  const chartData = {
    labels: logs.map((log, index) => `Log ${index + 1}`),
    datasets: [
      {
        label: "Temperature (°C)",
        data: logs.map(log => log.temperature),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "CO2 Emissions (MtCO2)",
        data: logs.map(log => log.co2Emissions),
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Logs Analysis",
      },
    },
  };

  const generateChartImage = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      setChartImage(image);
    }
  };

  useEffect(() => {
    if (logs.length > 0) {
      generateChartImage();
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Logs Dashboard</h1>
        <PDFDownloadLink
          document={<LogReportPDF logs={logs} chartImage={chartImage} />}
          fileName="user_logs_report.pdf"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {({ loading }) => (loading ? "Generating Report..." : "Download PDF Report")}
        </PDFDownloadLink>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Temperature & CO2 Emissions</h2>
          <div ref={chartRef}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Log Entries</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs available.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
                  <p className="text-sm text-gray-600"><strong>Log {index + 1}</strong></p>
                  <p className="text-sm text-gray-600"><strong>Temperature:</strong> {log.temperature}°C</p>
                  <p className="text-sm text-gray-600"><strong>CO2 Emissions:</strong> {log.co2Emissions} MtCO2</p>
                  <p className="text-sm text-gray-600"><strong>Emission Rate:</strong> {log.emissionRate}%</p>
                  <p className="text-sm text-gray-600"><strong>Analysis:</strong> {log.analysis}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogsPage;