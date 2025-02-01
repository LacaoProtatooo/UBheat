import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';

const Heatmap = ({ style = { height: '92vh', width: '100%' } }) => {
  const mapRef = useRef();
  const overlaysRef = useRef([]);
  const canvasRef = useRef(null);
  const smokeParticlesRef = useRef([]);

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
        center: fromLonLat([122, 12]),
        zoom: 6,
      }),
    });

    const philippineCities = [
      'Manila', 'Cebu', 'Davao', 'Cagayan de Oro', 'Zamboanga',
      'Baguio', 'Iloilo', 'Bacolod', 'General Santos', 'Legazpi',
      'Puerto Princesa', 'Tacloban', 'Tuguegarao', 'Butuan', 'Dumaguete'
    ];

    // Create fog effect canvas
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
        for (let i = 0; i < 20; i++) {
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

    // Animate the fog effect
    const animateSmoke = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      smokeParticlesRef.current.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        particle.velocityX += (Math.random() - 0.5) * 0.1;
        particle.velocityY += (Math.random() - 0.5) * 0.1;

        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.velocityX = (Math.random() - 0.5) * 1;
          particle.velocityY = (Math.random() - 0.5) * 1;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.3 + Math.random() * 0.3;
        ctx.fill();
      });

      requestAnimationFrame(animateSmoke);
    };

    animateSmoke();

    // Function to get heatmap gradient
    const getGradient = (minTemp, maxTemp) => {
      if (minTemp < 10) {
        return ['#0000FF', '#00FFFF', '#FFFF00', '#FF4500', '#FF0000'];
      } else if (maxTemp > 35) {
        return ['#0000FF', '#00FFFF', '#FFFF00', '#FF0000', '#8B0000'];
      }
      return ['#0000FF', '#FFFF00', '#FF0000'];
    };

    // Fetch weather data and update heatmap
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

      overlaysRef.current.forEach((overlay) => map.removeOverlay(overlay));
      overlaysRef.current = [];

      const heatmapFeatures = weatherData.map((data) => {
        return new Feature({
          geometry: new Point(fromLonLat(data.location)),
          weight: data.temperature,
        });
      });

      const minTemp = Math.min(...weatherData.map(d => d.temperature));
      const maxTemp = Math.max(...weatherData.map(d => d.temperature));
      const gradient = getGradient(minTemp, maxTemp);

      const heatmapLayer = new HeatmapLayer({
        source: new VectorSource({ features: heatmapFeatures }),
        blur: 20,
        radius: 25,
        gradient: gradient,
        opacity: 0.7,
      });

      map.getLayers().forEach((layer) => {
        if (layer instanceof HeatmapLayer) {
          map.removeLayer(layer);
        }
      });

      map.addLayer(heatmapLayer);

      weatherData.forEach((data) => {
        const overlayElement = document.createElement('div');
        overlayElement.className = 'temperature-overlay';
        overlayElement.innerHTML = `${data.city}: ${data.temperature}°C`;

        overlayElement.addEventListener('click', () => {
          alert(`Weather in ${data.city}:
          Temperature: ${data.temperature}°C
          Humidity: ${data.humidity}%
          Wind Speed: ${data.windSpeed} km/h`);
        });

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

      createSmokeParticles(weatherData);
    };

    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 300000);

    return () => {
      clearInterval(intervalId);
      mapRef.current.removeChild(canvas);
    };
  }, []);

  return <div ref={mapRef} style={{ ...style, position: 'relative' }} />;
};

export default Heatmap;
