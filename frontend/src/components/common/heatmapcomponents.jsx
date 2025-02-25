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
import { Style, Fill, Stroke } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import { GeoJSON } from 'ol/format';

// Import region GeoJSON data
import Region1 from '../../utils/regions/region-1.json';
import Region2 from '../../utils/regions/region-2.json';
import Region3 from '../../utils/regions/region-3.json';
import Region4A from '../../utils/regions/region-4A.json';
import Region4B from '../../utils/regions/region-4B.json';
import Region5 from '../../utils/regions/region-5.json';
import Region6 from '../../utils/regions/region-6.json';
import Region7 from '../../utils/regions/region-7.json';
import Region8 from '../../utils/regions/region-8.json';
import Region9 from '../../utils/regions/region-9.json';
import Region10 from '../../utils/regions/region-10.json';
import Region11 from '../../utils/regions/region-11.json';
import Region12 from '../../utils/regions/region-12.json';
import Region13 from '../../utils/regions/region-13.json';
import RegionCAR from '../../utils/regions/region-car.json';
import RegionNCR from '../../utils/regions/region-ncr.json';
import RegionBARMM from '../../utils/regions/region-barmm.json';

// Custom color palette for Philippine regions
export const REGION_COLORS = {
    'NCR': '#FF0000',        // Dark Red
    'CAR': '#FF7F7F',        // Light Red
    'Region 1': '#FF7F00',   // Dark Orange
    'Region 2': '#FFBF80',   // Light Orange
    'Region 3': '#FFFF00',   // Dark Yellow
    'Region 4A': '#FFFF99',  // Light Yellow
    'Region 4B': '#00FF00',  // Dark Green
    'Region 5': '#99FF99',   // Light Green
    'Region 6': '#00FFFF',   // Dark Cyan
    'Region 7': '#99FFFF',   // Light Cyan
    'Region 8': '#0000FF',   // Dark Blue
    'Region 9': '#8080FF',   // Light Blue
    'Region 10': '#4B0082',  // Dark Indigo
    'Region 11': '#9A4DFF',  // Light Indigo
    'Region 12': '#9400D3',  // Dark Violet
    'Region 13': '#D899FF',  // Light Violet
    'BARMM': '#FF00FF'       // Magenta
};

export const regionGeoJSON = {
    'NCR': RegionNCR,
    'CAR': RegionCAR,
    'Region 1': Region1,
    'Region 2': Region2,
    'Region 3': Region3,
    'Region 4A': Region4A,
    'Region 4B': Region4B,
    'Region 5': Region5,
    'Region 6': Region6,
    'Region 7': Region7,
    'Region 8': Region8,
    'Region 9': Region9,
    'Region 10': Region10,
    'Region 11': Region11,
    'Region 12': Region12,
    'Region 13': Region13,
    'BARMM': RegionBARMM
};

// Define a function that creates a vector layer for a given region
export const createRegionLayer = (regionName, geojsonData) => {
  return new VectorLayer({
      source: new VectorSource({
          format: new GeoJSON(),
          features: new GeoJSON().readFeatures(geojsonData, {
              featureProjection: 'EPSG:3857'
          })
      }),
      style: new Style({
          fill: new Fill({
              color: `${REGION_COLORS[regionName]}22` // Decreased opacity to 20%
          }),
          stroke: new Stroke({
              color: REGION_COLORS[regionName],
              width: 2 // Increased stroke width
          })
      }),
      zIndex: 3 // Higher zIndex to bring to foreground
  });
};

export const RegionLegend = () => (
  <div style={{
    position: 'absolute',
    bottom: '50px',
    left: '20px',
    zIndex: 10,
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  }}>
    <h4>Philippine Regions</h4>
    {Object.entries(REGION_COLORS).map(([region, color]) => (
      <div key={region} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          marginRight: '10px',
          border: `1px solid ${color}`
        }}></div>
        <span>{region}</span>
      </div>
    ))}
  </div>
);

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
    clockElement.style.zIndex = '10'; // Set zIndex to 10
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

const generateRandomFeatures = (baseCoords, numFeatures, radiusInMeters) => {
  const features = [];
  const [baseLon, baseLat] = baseCoords;
  // Approximate conversion: 1° latitude ≈ 110,540 meters,
  // and 1° longitude ≈ 111,320 * cos(latitude) meters.
  const latDegreeRadius = radiusInMeters / 110540;
  const lonDegreeRadius =
    radiusInMeters / (111320 * Math.cos((baseLat * Math.PI) / 180));

  for (let i = 0; i < numFeatures; i++) {
    // Random offset between -1 and 1 multiplied by degree radius
    const randomOffsetLat = (Math.random() * 2 - 1) * latDegreeRadius;
    const randomOffsetLon = (Math.random() * 2 - 1) * lonDegreeRadius;
    const randomLon = baseLon + randomOffsetLon;
    const randomLat = baseLat + randomOffsetLat;

    const feature = new Feature({
      geometry: new Point(fromLonLat([randomLon, randomLat])),
      weight: Math.random(), // Adjust as needed
    });
    features.push(feature);
  }
  return features;
};


// Integrated Heatmap Component
export const HeatmapComponent = ({ map, weatherData }) => {
  const overlaysRef = useRef([]);
  const pointerMoveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!map || !weatherData.length) return;

    // Create a new vector source for our heatmap features
    const vectorSource = new VectorSource();

    // Calculate a gradient based on weatherData temperature range
    const minTemp = Math.min(...weatherData.map((d) => d.temperature));
    const maxTemp = Math.max(...weatherData.map((d) => d.temperature));
    const gradient = getGradient(minTemp, maxTemp);

    // Create the heatmap layer using the vector source
    const heatmapLayer = new HeatmapLayer({
      source: vectorSource,
      blur: 20,
      radius: 25,
      gradient: gradient,
      opacity: 0.7,
    });

    // Remove any pre-existing heatmap layers and add our new one
    map.getLayers().forEach((layer) => {
      if (layer instanceof HeatmapLayer) {
        map.removeLayer(layer);
      }
    });
    map.addLayer(heatmapLayer);

    // Generate features based on weather data
    const weatherFeatures = weatherData.map((data) => {
      return new Feature({
        geometry: new Point(fromLonLat(data.location)),
        weight: data.temperature,
      });
    });

    // Define a base coordinate for the random features (e.g., main city: Manila)
    const mainCityCoords = [120.984222, 14.599512];

    // Function to update the heatmap with both weather and random features
    const updateHeatmap = () => {
      const randomFeatures = generateRandomFeatures(mainCityCoords, 10, 5000); // 10 random features within a 5 km radius
      vectorSource.clear();
      // Merge weatherData features with random features
      vectorSource.addFeatures([...weatherFeatures, ...randomFeatures]);
    };

    // Initial update and then every 5 seconds
    updateHeatmap();
    const intervalId = setInterval(updateHeatmap, 5000);

    // Add overlays for each weatherData feature
    weatherData.forEach((data) => {
      const overlayElement = document.createElement('div');
      overlayElement.className = 'temperature-overlay';
      overlayElement.innerHTML = `${data.city}: ${data.temperature}°C`;
      overlayElement.style.backgroundColor =
        data.temperature <= 16
          ? 'rgba(0, 0, 255, 0.7)'
          : data.temperature <= 30
          ? 'rgba(255, 255, 0, 0.7)'
          : 'rgba(255, 0, 0, 0.7)';

      const overlay = new Overlay({
        position: fromLonLat(data.location),
        element: overlayElement,
        positioning: 'bottom-center',
        stopEvent: false,
      });

      map.addOverlay(overlay);
      overlaysRef.current.push(overlay);
    });

    // Handle pointer move events to show/hide overlays when hovering on features
    const handlePointerMove = (event) => {
      if (pointerMoveTimeoutRef.current) {
        clearTimeout(pointerMoveTimeoutRef.current);
      }
      pointerMoveTimeoutRef.current = setTimeout(() => {
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

        overlaysRef.current.forEach((overlay) => {
          const overlayElement = overlay.getElement();
          if (
            feature &&
            feature.getGeometry().getCoordinates().toString() ===
              overlay.getPosition().toString()
          ) {
            overlayElement.style.visibility = 'visible';
            overlayElement.style.opacity = '1';
          } else {
            overlayElement.style.visibility = 'hidden';
            overlayElement.style.opacity = '0';
          }
        });
      }, 50);
    };

    map.on('pointermove', handlePointerMove);

    // Cleanup on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
      map.removeLayer(heatmapLayer);
      overlaysRef.current.forEach((overlay) => map.removeOverlay(overlay));
      map.un('pointermove', handlePointerMove);
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
        zIndex: 10,
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
        zIndex: 10,
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
        zIndex: 10,
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
const animateHeatmap = (heatmapLayer, map) => {
  const baseRadius = 25; // Fixed base radius in pixels
  const delta = 1;       // Maximum oscillation (in pixels)
  let currentRadius = baseRadius;
  let increasing = true;

  const animate = () => {
    // Update currentRadius in fixed pixel units
    if (increasing) {
      currentRadius += 0.2;
      if (currentRadius >= baseRadius + delta) {
        increasing = false;
      }
    } else {
      currentRadius -= 0.2;
      if (currentRadius <= baseRadius - delta) {
        increasing = true;
      }
    }
    // Set the radius—since it's in pixels, it remains fixed regardless of zoom
    heatmapLayer.setRadius(currentRadius);
    requestAnimationFrame(animate);
  };
  animate();
};