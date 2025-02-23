import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import { Clock, HeatmapComponent, SearchComponent, WeatherInfo, SearchResult, REGION_COLORS, regionGeoJSON, createRegionLayer, RegionLegend } from '../common/heatmapcomponents';

const Heatmap = ({ style = { height: '92vh', width: '100%' } }) => {
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [averageTemperature, setAverageTemperature] = useState(null);
    const [hazardousWaterLevels, setHazardousWaterLevels] = useState([]);
    const [searchCity, setSearchCity] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                ...Object.entries(regionGeoJSON).map(([region, geojson]) => createRegionLayer(region, geojson))
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
            'Manila',           // NCR
            'Baguio',           // CAR
            'Laoag',            // Region 1 (Ilocos Region)
            'Tuguegarao',       // Region 2 (Cagayan Valley)
            'San Fernando',     // Region 3 (Central Luzon)
            'Calamba',          // Region 4A (CALABARZON)
            'Puerto Princesa',  // Region 4B (MIMAROPA)
            'Legazpi',          // Region 5 (Bicol Region)
            'Iloilo',           // Region 6 (Western Visayas)
            'Cebu',             // Region 7 (Central Visayas)
            'Tacloban',         // Region 8 (Eastern Visayas)
            'Zamboanga',        // Region 9 (Zamboanga Peninsula)
            'Cagayan de Oro',   // Region 10 (Northern Mindanao)
            'Davao',            // Region 11 (Davao Region)
            'General Santos',   // Region 12 (SOCCSKSARGEN)
            'Butuan',           // Region 13 (Caraga)
            'Cotabato'          // BARMM
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
                    <HeatmapComponent map={mapInstance} weatherData={weatherData} />  
                </>
            )}
            
            <SearchComponent setSearchCity={setSearchCity} fetchSearchCityWeather={fetchSearchCityWeather} />
            <WeatherInfo averageTemperature={averageTemperature} hazardousWaterLevels={hazardousWaterLevels} />
            <SearchResult searchResult={searchResult} />
            <RegionLegend />
        </div>
    );
};

export default Heatmap;