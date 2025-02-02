import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { IconMessage, IconTemperature, IconDroplet } from '@tabler/icons-react'; // Icons for the message, temperature, and water level

const Heatmap = ({ style = { height: '92vh', width: '100%' } }) => {
  const mapRef = useRef();
  const overlaysRef = useRef([]);
  const canvasRef = useRef(null);
  const smokeParticlesRef = useRef([]);
  const clockRef = useRef(null); // Ref for the clock element
  const [averageTemperature, setAverageTemperature] = useState(null); // State for average temperature
  const [hazardousWaterLevels, setHazardousWaterLevels] = useState([]); // State for hazardous water levels

  useEffect(() => {
    // Initialize the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([122, 12]), // Center on the Philippines
        zoom: 6,
      }),
    });

    // Create a clock element
    const clockElement = document.createElement('div');
    clockElement.style.position = 'absolute';
    clockElement.style.bottom = '10px';
    clockElement.style.left = '10px';
    clockElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    clockElement.style.padding = '5px 10px';
    clockElement.style.borderRadius = '5px';
    clockElement.style.fontFamily = 'Arial, sans-serif';
    clockElement.style.fontSize = '16px';
    clockElement.style.zIndex = '1000';
    mapRef.current.appendChild(clockElement);
    clockRef.current = clockElement;

    // Function to update the clock
    const updateClock = () => {
      const now = new Date();
      const philippineTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // Convert to UTC+8
      const hours = philippineTime.getUTCHours().toString().padStart(2, '0');
      const minutes = philippineTime.getUTCMinutes().toString().padStart(2, '0');
      const seconds = philippineTime.getUTCSeconds().toString().padStart(2, '0');
      clockRef.current.textContent = `Philippine Time: ${hours}:${minutes}:${seconds}`;
    };

    // Update the clock every second
    const clockIntervalId = setInterval(updateClock, 1000);
    updateClock(); // Initial call to display the clock immediately

    // Expanded list of cities
    const philippineCities = [
      'Manila', 'Cebu', 'Davao', 'Cagayan de Oro', 'Zamboanga',
      'Baguio', 'Iloilo', 'Bacolod', 'General Santos', 'Legazpi',
      'Puerto Princesa', 'Tacloban', 'Tuguegarao', 'Butuan', 'Dumaguete'
    ];

    // Create canvas for fog effects
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mapRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');

    // Function to create fog/smoke particles
    const createSmokeParticles = (weatherData) => {
      smokeParticlesRef.current = [];
      weatherData.forEach((data) => {
        const color = data.temperature <= 16 ? 'blue' : data.temperature <= 30 ? 'yellow' : 'red';
        for (let i = 0; i < 20; i++) { // Create 20 particles per city
          smokeParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 2,
            color: color,
            velocityX: (Math.random() - 0.5) * 0.5,
            velocityY: (Math.random() - 0.5) * 0.5,
          });
        }
      });
    };

    // Function to animate fog/smoke
    const animateSmoke = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      smokeParticlesRef.current.forEach((particle) => {
        // Move particle
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
    
        // Add slight randomness to velocity for natural movement
        particle.velocityX += (Math.random() - 0.5) * 0.1;
        particle.velocityY += (Math.random() - 0.5) * 0.1;
    
        // Reset particle if it goes offscreen
        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.velocityX = (Math.random() - 0.5) * 1;
          particle.velocityY = (Math.random() - 0.5) * 1;
        }
    
        // Draw particle with smoother opacity
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.3 + Math.random() * 0.3; // Add some flickering effect
        ctx.fill();
      });
    
      requestAnimationFrame(animateSmoke);
    };

    animateSmoke();

    // Function to get a dynamic heatmap gradient
    const getGradient = (minTemp, maxTemp) => {
      if (minTemp < 10) {
        return ['#0000FF', '#00FFFF', '#FFFF00', '#FF4500', '#FF0000'];
      } else if (maxTemp > 35) {
        return ['#0000FF', '#00FFFF', '#FFFF00', '#FF0000', '#8B0000'];
      }
      return ['#0000FF', '#FFFF00', '#FF0000'];
    };

    // Fetch weather data
    const fetchWeatherData = async () => {
      const apiKey = 'b05f228625b60990de863e6193f998af';
      const weatherData = [];
      canvas.className = 'smoke-canvas';
      
      for (const city of philippineCities) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&appid=${apiKey}&units=metric`
          );
          const { coord, main, wind } = response.data;
          weatherData.push({
            location: [coord.lon, coord.lat],
            temperature: main.temp,
            humidity: main.humidity,
            windSpeed: wind.speed,
            city: city,
          });
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
        }
      }

      // Calculate average temperature
      const temperatures = weatherData.map((data) => data.temperature);
      const averageTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(2);
      setAverageTemperature(averageTemp);

      // Simulate hazardous water levels (for demonstration purposes)
      const hazardousAreas = [
        { name: 'Manila', waterLevel: 'High' },
        { name: 'Cebu', waterLevel: 'Medium' },
        { name: 'Davao', waterLevel: 'Low' },
      ];
      setHazardousWaterLevels(hazardousAreas);

      // Clear overlays
      overlaysRef.current.forEach((overlay) => map.removeOverlay(overlay));
      overlaysRef.current = [];

      // Create heatmap features
      const heatmapFeatures = weatherData.map((data) => {
        return new Feature({
          geometry: new Point(fromLonLat(data.location)),
          weight: data.temperature,
        });
      });

      // Get dynamic gradient
      const minTemp = Math.min(...weatherData.map(d => d.temperature));
      const maxTemp = Math.max(...weatherData.map(d => d.temperature));
      const gradient = getGradient(minTemp, maxTemp);

      // Update heatmap
      const heatmapLayer = new HeatmapLayer({
        source: new VectorSource({ features: heatmapFeatures }),
        blur: 20,
        radius: 25,
        gradient: gradient,
        opacity: 0.7,
      });

      // Remove old heatmap layer
      map.getLayers().forEach((layer) => {
        if (layer instanceof HeatmapLayer) {
          map.removeLayer(layer);
        }
      });

      map.addLayer(heatmapLayer);

      // Add overlays for city data
      weatherData.forEach((data) => {
        const overlayElement = document.createElement('div');
        overlayElement.className = 'temperature-overlay';
        overlayElement.innerHTML = `${data.city}: ${data.temperature}°C`;

        // Click event to show details
        overlayElement.addEventListener('click', () => {
          alert(`Weather in ${data.city}:
          Temperature: ${data.temperature}°C
          Humidity: ${data.humidity}%
          Wind Speed: ${data.windSpeed} km/h`);
        });

        // Color based on temperature
        overlayElement.style.backgroundColor =
          data.temperature <= 16 ? 'rgba(0, 0, 255, 0.7)' :
          data.temperature <= 30 ? 'rgba(255, 255, 0, 0.7)' :
                                   'rgba(255, 0, 0, 0.7)';

        const overlay = new Overlay({
          position: fromLonLat(data.location),
          element: overlayElement,
          positioning: 'bottom-center',
          stopEvent: false,
        });

        map.addOverlay(overlay);
        overlaysRef.current.push(overlay);
      });

      // Create fog based on weather
      createSmokeParticles(weatherData);
    };

    // Fetch data on mount and refresh every 5 minutes
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 300000);

    return () => {
      clearInterval(intervalId);
      clearInterval(clockIntervalId); // Clear the clock interval
      mapRef.current.removeChild(canvas);
      mapRef.current.removeChild(clockRef.current); // Remove the clock element
    };
  }, []);

  return (
    <div ref={mapRef} style={{ ...style, position: 'relative' }}>
      {/* Message Icon */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => window.location.href = '/chatbot'}
      >
        <IconMessage size={24} color="#000" />
      </div>

      {/* Average Temperature and Water Level Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <IconTemperature size={20} color="#000" />
          <span>Avg Temp: {averageTemperature}°C</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <IconDroplet size={20} color="#000" />
          <span>Hazardous Areas: {hazardousWaterLevels.map(area => area.name).join(', ')}</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;