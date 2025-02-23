import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector'; // Changed from VectorTileLayer
import VectorSource from 'ol/source/Vector'; // Changed from VectorTileSource

import { Style, Fill, Stroke } from 'ol/style';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import { Clock, SearchComponent, WeatherInfo, SearchResult } from '../common/heatmapcomponents';
import OSM from 'ol/source/OSM';
import { GeoJSON } from 'ol/format';

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
const REGION_COLORS = {
    'NCR': '#FF0000',        // Red
    'CAR': '#FF7F00',        // Orange
    'Region 1': '#FFFF00',   // Yellow
    'Region 2': '#7FFF00',   // Yellow-Green
    'Region 3': '#00FF00',   // Green
    'Region 4A': '#00FF7F',  // Spring Green
    'Region 4B': '#00FFFF',  // Cyan
    'Region 5': '#007FFF',   // Azure
    'Region 6': '#0000FF',   // Blue
    'Region 7': '#7F00FF',   // Indigo
    'Region 8': '#9400D3',   // Violet
    'Region 9': '#BF00BF',   // Purple
    'Region 10': '#FF00FF',  // Magenta
    'Region 11': '#FF007F',  // Rose
    'Region 12': '#FF1493',  // Deep Pink
    'Region 13': '#FF4500',  // Red-Orange
    'BARMM': '#FFD700'       // Gold (for variety)
};


const regionGeoJSON = {
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
const createRegionLayer = (regionName, geojsonData) => {
    return new VectorLayer({
        source: new VectorSource({
            format: new GeoJSON(),
            features: new GeoJSON().readFeatures(geojsonData, {
                featureProjection: 'EPSG:3857' // Correct projection
            })
        }),
        style: new Style({
            fill: new Fill({
                color: `${REGION_COLORS[regionName]}33` // Add opacity
            }),
            stroke: new Stroke({
                color: REGION_COLORS[regionName],
                width: 1
            })
        }),
        zIndex: 1
    });
};

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
                    source: new OSM()
                }),
                ...Object.entries(regionGeoJSON).map(([region, geojson]) => createRegionLayer(region, geojson))
            ],
            view: new View({
                center: fromLonLat([122, 12]),
                zoom: 6
            })
        });

        setMapInstance(map);
        
        return () => map.setTarget(null);
    }, []);

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
                </>
            )}
            <SearchComponent setSearchCity={setSearchCity} fetchSearchCityWeather={fetchSearchCityWeather} />
            <WeatherInfo averageTemperature={averageTemperature} hazardousWaterLevels={hazardousWaterLevels} />
            <SearchResult searchResult={searchResult} />
            
            {/* Legend Component */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
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
        </div>
    );
};

export default Heatmap;