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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Logs</h1>
      {logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <div className="mb-8">
          <div ref={chartRef}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <ul>
            {logs.map((log, index) => (
              <li key={index} className="mb-2">
                <p><strong>Temperature:</strong> {log.temperature}°C</p>
                <p><strong>CO2 Emissions:</strong> {log.co2Emissions} MtCO2</p>
                <p><strong>Emission Rate:</strong> {log.emissionRate}%</p>
                <p><strong>Analysis:</strong> {log.analysis}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <PDFDownloadLink document={<LogReportPDF logs={logs} chartImage={chartImage} />} fileName="user_logs_report.pdf">
        {({ loading }) => (loading ? "Loading document..." : "Download PDF Report")}
      </PDFDownloadLink>
    </div>
  );
};

export default UserLogsPage;