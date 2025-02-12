import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import { Clock, SmokeEffect, HeatmapComponent, SearchComponent, WeatherInfo, SearchResult } from '../common/heatmapcomponents';

const Heatmap = ({ style = { height: '92vh', width: '100%' } }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [averageTemperature, setAverageTemperature] = useState(null);
  const [hazardousWaterLevels, setHazardousWaterLevels] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [weatherData, setWeatherData] = useState([]); // Add weatherData state

  useEffect(() => {
    if (!mapRef.current) return;

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

    setMapInstance(map);
    
    return () => map.setTarget(null);
  }, []);

  useEffect(() => {
    if (!mapInstance) return;

    const philippineCities = [
      'Manila', 'Cebu', 'Davao', 'Cagayan de Oro', 'Zamboanga',
      'Baguio', 'Iloilo', 'Bacolod', 'General Santos', 'Legazpi',
      'Puerto Princesa', 'Tacloban', 'Tuguegarao', 'Butuan', 'Dumaguete',
      'Tagaytay', 'Olongapo', 'Naga', 'Laoag', 'Cotabato',
    ];

    const fetchWeatherData = async () => {
      const apiKey = 'b05f228625b60990de863e6193f998af';
      const weatherData = [];

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

      const temperatures = weatherData.map((data) => data.temperature);
      const averageTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(2);
      setAverageTemperature(averageTemp);

      const hazardousAreas = [
        { name: 'Manila', waterLevel: 'High' },
        { name: 'Cebu', waterLevel: 'Medium' },
        { name: 'Davao', waterLevel: 'Low' },
      ];
      setHazardousWaterLevels(hazardousAreas);

      // Update weatherData state
      setWeatherData(weatherData);
    };

    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 300000);

    return () => clearInterval(intervalId);
  }, [mapInstance]);

  const fetchSearchCityWeather = async () => {
    const apiKey = 'b05f228625b60990de863e6193f998af';
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error(`Error fetching data for ${searchCity}:`, error);
      setSearchResult(null);
    }
  };

  return (
    <div ref={mapRef} style={{ ...style, position: 'relative' }}>
      {mapInstance && (
        <>
          <Clock mapRef={mapRef} />
          <SmokeEffect mapRef={mapRef} weatherData={weatherData} /> {/* Pass weatherData */}
          <HeatmapComponent map={mapInstance} weatherData={weatherData} /> {/* Pass weatherData */}
        </>
      )}
      <SearchComponent setSearchCity={setSearchCity} fetchSearchCityWeather={fetchSearchCityWeather} />
      <WeatherInfo averageTemperature={averageTemperature} hazardousWaterLevels={hazardousWaterLevels} />
      <SearchResult searchResult={searchResult} />
    </div>
  );
};

export default Heatmap;