// heatmapcomponents.jsx
import { IconTemperature, IconDroplet, IconSearch } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj'; // Ensure fromLonLat is imported
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';

// Clock Component
export const Clock = ({ mapRef }) => {
  const clockRef = useRef(null);

  useEffect(() => {
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

    const updateClock = () => {
      const now = new Date();
      const philippineTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // Convert to UTC+8
      const hours = philippineTime.getUTCHours().toString().padStart(2, '0');
      const minutes = philippineTime.getUTCMinutes().toString().padStart(2, '0');
      const seconds = philippineTime.getUTCSeconds().toString().padStart(2, '0');
      clockRef.current.textContent = `Philippine Time: ${hours}:${minutes}:${seconds}`;
    };

    const clockIntervalId = setInterval(updateClock, 1000);
    updateClock();

    return () => {
      clearInterval(clockIntervalId);
      mapRef.current.removeChild(clockRef.current);
    };
  }, [mapRef]);

  return null;
};

// Smoke Effect Component
export const SmokeEffect = ({ mapRef, weatherData }) => {
  const canvasRef = useRef(null);
  const smokeParticlesRef = useRef([]);

  useEffect(() => {
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

    createSmokeParticles(weatherData);
    animateSmoke();

    return () => {
      mapRef.current.removeChild(canvas);
    };
  }, [mapRef, weatherData]);

  return null;
};

// Heatmap Component
export const HeatmapComponent = ({ map, weatherData }) => {
  const overlaysRef = useRef([]);

  useEffect(() => {
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
    animateHeatmap(heatmapLayer);

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

    return () => {
      overlaysRef.current.forEach((overlay) => map.removeOverlay(overlay));
    };
  }, [map, weatherData]);

  return null;
};

// Search Component
export const SearchComponent = ({ setSearchCity, fetchSearchCityWeather }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
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
      onClick={() => {
        const city = prompt("Enter city name:");
        if (city) {
          setSearchCity(city);
          fetchSearchCityWeather();
        }
      }}
    >
      <IconSearch size={24} color="#000" />
    </div>
  );
};

// Weather Info Component
export const WeatherInfo = ({ averageTemperature, hazardousWaterLevels }) => {
  return (
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
  );
};

// Search Result Component
export const SearchResult = ({ searchResult }) => {
  if (!searchResult) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
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
        <span>{searchResult.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <IconTemperature size={20} color="#000" />
        <span>Temperature: {searchResult.main.temp}°C</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <IconDroplet size={20} color="#000" />
        <span>Humidity: {searchResult.main.humidity}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>Wind Speed: {searchResult.wind.speed} km/h</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>Condition: {searchResult.weather[0].description}</span>
      </div>
    </div>
  );
};

// Helper function for gradient
const getGradient = (minTemp, maxTemp) => {
  if (minTemp < 10) {
    return ['#0000FF', '#00FFFF', '#FFFF00', '#FF4500', '#FF0000'];
  } else if (maxTemp > 35) {
    return ['#0000FF', '#00FFFF', '#FFFF00', '#FF0000', '#8B0000'];
  }
  return ['#0000FF', '#FFFF00', '#FF0000'];
};

// Helper function for heatmap animation
const animateHeatmap = (heatmapLayer) => {
  let opacityIncreasing = true;
  let radiusIncreasing = true;

  const animate = () => {
    let opacity = 0.7;
    let radius = 25;

    opacity += opacityIncreasing ? 0.01 : -0.01;
    if (opacity >= 1) opacityIncreasing = false;
    if (opacity <= 0.5) opacityIncreasing = true;

    radius += radiusIncreasing ? 0.2 : -0.2;
    if (radius >= 30) radiusIncreasing = false;
    if (radius <= 20) radiusIncreasing = true;

    heatmapLayer.setOpacity(opacity);
    heatmapLayer.setRadius(radius);

    requestAnimationFrame(animate);
  };

  animate();
};