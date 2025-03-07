import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";
import LogReportPDF from "../LogReportPDF";
import html2canvas from "html2canvas";

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const UserLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [chartImage, setChartImage] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isChartReady, setIsChartReady] = useState(false);
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
        borderColor: "rgba(53, 162, 235, 1)",
        backgroundColor: "rgba(53, 162, 235, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(53, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: "rgba(53, 162, 235, 1)",
      },
      {
        label: "CO2 Emissions (MtCO2)",
        data: logs.map(log => log.co2Emissions),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            size: 12,
            weight: 'bold'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: "Temperature & CO2 Emissions Trends",
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: "rgba(44, 62, 80, 0.9)",
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (context.datasetIndex === 0) {
                label += '°C';
              } else if (context.datasetIndex === 1) {
                label += ' MtCO2';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: 20
    },
    animation: {
      onComplete: () => {
        if (logs.length > 0 && !isChartReady) {
          generateChartImage();
        }
      }
    }
  };

  const generateChartImage = async () => {
    if (chartRef.current) {
      setIsGeneratingPDF(true);
      
      try {
        // Delay to ensure the chart is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 500));
    
        const canvas = await html2canvas(chartRef.current, {
          scale: 2, // Higher quality
          backgroundColor: "#ffffff",
          logging: false,
        });
        const image = canvas.toDataURL("image/png");
        setChartImage(image);
        setIsChartReady(true);
      } catch (error) {
        console.error("Error generating chart image:", error);
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };

  // Manual trigger for chart image generation
  const handleRefreshChart = async () => {
    setIsChartReady(false);
    await generateChartImage();
  };

  // Initial chart image generation when logs are loaded
  useEffect(() => {
    if (logs.length > 0 && !isChartReady) {
      const timer = setTimeout(() => {
        generateChartImage();
      }, 1000); // Allow time for chart to render
      
      return () => clearTimeout(timer);
    }
  }, [logs, isChartReady]);

  // PDF Download Button Component
  const PDFDownloadButton = () => {
    if (!isChartReady || logs.length === 0) {
      return (
        <button 
          className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed transition duration-300 flex items-center gap-2"
          disabled
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          {isGeneratingPDF ? "Preparing Chart..." : "Download PDF Report"}
        </button>
      );
    }
    
    return (
      <PDFDownloadLink
        document={<LogReportPDF logs={logs} chartImage={chartImage} />}
        fileName="ubheat_analysis_report.pdf"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
      >
        {({ loading, error }) => (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            {loading ? "Generating PDF..." : "Download PDF Report"}
          </>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">UBheat Analysis Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitoring temperature and CO2 emissions data</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefreshChart}
            disabled={isGeneratingPDF}
            className={`${isGeneratingPDF ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'} text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh Chart
          </button>
          <PDFDownloadButton />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Temperature & CO2 Emissions</h2>
          <div ref={chartRef} className="h-80">
            {logs.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">No chart data available</p>
                <p className="text-sm text-gray-400 mt-1">Add logs to view the chart</p>
              </div>
            )}
          </div>
          {isGeneratingPDF && (
            <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-md text-sm flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing chart for PDF report...
            </div>
          )}
        </div>

        {/* Logs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Log Entries</h2>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No logs available.</p>
              <p className="text-sm text-gray-400 mt-1">Log data will appear here once recorded.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-800">Log Entry #{index + 1}</p>
                    {log.timestamp && (
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-lg font-semibold text-blue-600">{log.temperature}°C</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-xs text-gray-500">CO2 Emissions</p>
                      <p className="text-lg font-semibold text-red-600">{log.co2Emissions} MtCO2</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Emission Rate</p>
                      <p className="text-lg font-semibold text-yellow-600">{log.emissionRate}%</p>
                    </div>
                  </div>
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