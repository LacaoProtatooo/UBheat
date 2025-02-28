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
import CircleStyle from 'ol/style/Circle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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
  'NCR': '#FF0000',
  'CAR': '#FF7F7F',
  'Region 1': '#FF7F00',
  'Region 2': '#FFBF80',
  'Region 3': '#FFFF00',
  'Region 4A': '#FFFF99',
  'Region 4B': '#00FF00',
  'Region 5': '#99FF99',
  'Region 6': '#00FFFF',
  'Region 7': '#99FFFF',
  'Region 8': '#0000FF',
  'Region 9': '#8080FF',
  'Region 10': '#4B0082',
  'Region 11': '#9A4DFF',
  'Region 12': '#9400D3',
  'Region 13': '#D899FF',
  'BARMM': '#FF00FF'
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
        color: `${REGION_COLORS[regionName]}22`
      }),
      stroke: new Stroke({
        color: REGION_COLORS[regionName],
        width: 2
      })
    }),
    zIndex: 3
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
    clockElement.style.zIndex = '10';
    mapRef.current.appendChild(clockElement);
    clockRef.current = clockElement;
    const updateClock = () => {
      const now = new Date();
      const philippineTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      const hours = philippineTime.getUTCHours().toString().padStart(2, '0');
      const minutes = philippineTime.getUTCMinutes().toString().padStart(2, '0');
      const seconds = philippineTime.getUTCSeconds().toString().padStart(2, '0');
      clockRef.current.textContent = `Philippine Time: ${hours}:${minutes}:${seconds}`;
    };
    const clockIntervalId = setInterval(updateClock, 1000);
    updateClock();
    return () => {
      clearInterval(clockIntervalId);
      if (mapRef.current && clockRef.current) {
        mapRef.current.removeChild(clockRef.current);
      }
    };
  }, [mapRef]);
  return null;
};

const generateRandomFeatures = (cityCoordsArray, numFeaturesPerCity, radiusInMeters) => {
  const features = [];
  cityCoordsArray.forEach(([baseLon, baseLat]) => {
    const latDegreeRadius = radiusInMeters / 110540;
    const lonDegreeRadius = radiusInMeters / (111320 * Math.cos((baseLat * Math.PI) / 180));
    for (let i = 0; i < numFeaturesPerCity * 20; i++) {
      const randomOffsetLat = (Math.random() * 2 - 1) * latDegreeRadius;
      const randomOffsetLon = (Math.random() * 2 - 1) * lonDegreeRadius;
      const randomLon = baseLon + randomOffsetLon;
      const randomLat = baseLat + randomOffsetLat;
      features.push(new Feature({
        geometry: new Point(fromLonLat([randomLon, randomLat])),
        weight: Math.random(),
      }));
    }
  });
  return features;
};

// New Modal Component for City Details using Material UI Dialog
const CityDetailsModal = ({ open, handleClose, details }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="city-details-title" aria-describedby="city-details-description">
      <DialogTitle id="city-details-title">Details for {details.city}</DialogTitle>
      <DialogContent>
        <DialogContentText id="city-details-description">
          <strong>City:</strong> {details.city}<br/>
          <strong>API Temperature:</strong> {details.temperature}°C<br/>
          <strong>Adjusted Temperature:</strong> {details.adjustedTemp}°C<br/>
          <strong>Emission Rate:</strong> {details.emissionRate}%<br/>
          <strong>Predicted MtCO₂:</strong> {details.predictedMtCO2} MtCO₂<br/>
          <strong>Active MtCO₂:</strong> {details.activeCO2} MtCO₂<br/>
          <strong>Result MtCO₂:</strong> {details.resultMtCO2} MtCO₂<br/>
          <strong>Selected Year:</strong> {details.selectedYear}<br/>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const HeatmapComponent = ({
  map,
  weatherData,
  emissionRate,
  resultMtCO2,
  adjustedTemp,
  activeCO2,
  selectedYear // This prop must be passed from the parent
}) => {
  const overlaysRef = useRef([]);
  const pointerMoveTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);

  useEffect(() => {
    if (!map || !weatherData.length) return;
    const style = document.createElement('style');
    style.textContent = `
      .temperature-overlay {
        transition: all 0.3s ease-out;
        opacity: 0;
        transform: translateY(10px) scale(0.95);
        visibility: hidden;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 14px;
        white-space: nowrap;
        cursor: pointer;
      }
      .temperature-overlay.active {
        opacity: 1;
        transform: translateY(0) scale(1);
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
    const vectorSource = new VectorSource();
    const minTemp = Math.min(...weatherData.map(d => d.temperature));
    const maxTemp = Math.max(...weatherData.map(d => d.temperature));
    const gradient = getGradient(minTemp, maxTemp);
    const heatmapLayer = new HeatmapLayer({
      source: vectorSource,
      blur: 50,
      radius: 15,
      gradient: gradient,
      opacity: 0.7,
    });
    heatmapLayerRef.current = heatmapLayer;
    map.getLayers().forEach(layer => {
      if (layer instanceof HeatmapLayer) map.removeLayer(layer);
    });
    map.addLayer(heatmapLayer);
    animateHeatmap(heatmapLayer);
    const weatherFeatures = weatherData.map(data => new Feature({
      geometry: new Point(fromLonLat(data.location)),
      weight: data.temperature,
    }));
    const cityPointsSource = new VectorSource({
      features: weatherFeatures.map(feature => {
        feature.setStyle(new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: '#9400D3' }),
            stroke: new Stroke({ color: 'white', width: 2 })
          })
        }));
        return feature;
      })
    });
    const cityPointsLayer = new VectorLayer({
      source: cityPointsSource,
      zIndex: 4
    });
    map.addLayer(cityPointsLayer);
    const cityCoordsArray = weatherData.map(data => data.location);
    const updateHeatmap = () => {
      const randomFeatures = generateRandomFeatures(cityCoordsArray, 5, 23000);
      vectorSource.clear();
      vectorSource.addFeatures([...weatherFeatures, ...randomFeatures]);
    };
    updateHeatmap();
    const intervalId = setInterval(updateHeatmap, 2000);
    
    // Overlay creation: display API temperature, adjusted temperature, and CO₂ rate.
    weatherData.forEach(data => {
      const overlayElement = document.createElement('div');
      overlayElement.className = 'temperature-overlay';
      
      // Compute safe fallback values:
      const dispAdjustedTemp = typeof adjustedTemp === 'number' ? adjustedTemp : data.temperature;
      const dispActiveCO2 = typeof activeCO2 === 'number' ? activeCO2 : 0;
      
      let content = `${data.city}: ${data.temperature}°C`;
      if (emissionRate !== 0) {
        content += `<br/>Adjusted Temp: ${dispAdjustedTemp.toFixed(2)}°C`;
        content += `<br/>CO₂ Rate: ${dispActiveCO2.toFixed(2)} MtCO₂`;
      }
      overlayElement.innerHTML = content;
      overlayElement.style.backgroundColor =
        data.temperature <= 16 ? 'rgba(0, 0, 255, 0.7)' :
        data.temperature <= 30 ? 'rgba(255, 255, 0, 0.7)' :
        'rgba(255, 0, 0, 0.7)';
      
      // Attach click listener to open modal with city details.
      overlayElement.addEventListener('click', () => {
        setCityDetails({
          city: data.city,
          temperature: data.temperature,
          adjustedTemp: dispAdjustedTemp.toFixed(2),
          emissionRate: emissionRate,
          predictedMtCO2: (typeof baseMtCO2 === 'number' ? baseMtCO2.toFixed(2) : "N/A"), // assuming baseMtCO2 is passed as part of details if needed
          activeCO2: dispActiveCO2.toFixed(2),
          resultMtCO2: resultMtCO2,
          selectedYear: selectedYear
        });
        setModalOpen(true);
      });
      
      const overlay = new Overlay({
        position: fromLonLat(data.location),
        element: overlayElement,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      map.addOverlay(overlay);
      overlaysRef.current.push(overlay);
    });
    
    const handlePointerMove = (event) => {
      if (pointerMoveTimeoutRef.current) clearTimeout(pointerMoveTimeoutRef.current);
      pointerMoveTimeoutRef.current = setTimeout(() => {
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, feature => feature);
        overlaysRef.current.forEach(overlay => {
          const overlayElement = overlay.getElement();
          const positionMatch = feature?.getGeometry().getCoordinates().toString() === overlay.getPosition().toString();
          if (positionMatch) {
            overlayElement.classList.add('active');
          } else {
            overlayElement.classList.remove('active');
          }
        });
      }, 50);
    };
    map.on('pointermove', handlePointerMove);
    return () => {
      clearInterval(intervalId);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      map.removeLayer(heatmapLayer);
      map.removeLayer(cityPointsLayer);
      overlaysRef.current.forEach(overlay => map.removeOverlay(overlay));
      map.un('pointermove', handlePointerMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [map, weatherData, emissionRate, resultMtCO2, adjustedTemp, activeCO2, selectedYear]);
  
  return (
    <>
      {cityDetails && (
        <CityDetailsModal 
          open={modalOpen} 
          handleClose={() => setModalOpen(false)} 
          details={cityDetails} 
        />
      )}
    </>
  );
};

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

const getGradient = (minTemp, maxTemp) => {
  if (minTemp < 10) {
    return [
      '#00008B',
      '#0000FF',
      '#00FFFF',
      '#7FFFD4',
      '#FFFF00',
      '#FF8C00',
      '#FF4500',
      '#FF0000'
    ];
  }
  if (maxTemp > 35) {
    return [
      '#0000FF',
      '#00FFFF',
      '#00FF7F',
      '#FFFF00',
      '#FFA500',
      '#FF4500',
      '#FF0000',
      '#8B0000'
    ];
  }
  if (minTemp >= 25 && maxTemp <= 26) {
    return [
      '#00FFFF',
      '#40E0D0',
      '#00FF7F',
      '#98FB98'
    ];
  }
  if (minTemp >= 25 && maxTemp <= 35) {
    return [
      '#00FFFF',
      '#00FF7F',
      '#ADFF2F',
      '#FFFF00',
      '#FFD700',
      '#FFA500',
      '#FF4500'
    ];
  }
  return [
    '#0000FF',
    '#ADD8E6',
    '#90EE90',
    '#FFFF00',
    '#FFB6C1',
    '#FFA500',
    '#FF0000'
  ];
};

const animateHeatmap = (heatmapLayer) => {
  const baseRadius = 10;
  const delta = 7;
  let currentRadius = baseRadius;
  let increasing = true;
  let animationId;
  const animate = () => {
    if (increasing) {
      currentRadius += 0.1;
      if (currentRadius >= baseRadius + delta) increasing = false;
    } else {
      currentRadius -= 0.1;
      if (currentRadius <= baseRadius - delta) increasing = true;
    }
    if (heatmapLayer) {
      heatmapLayer.setRadius(currentRadius);
      animationId = requestAnimationFrame(animate);
    }
  };
  animationId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationId);
};
