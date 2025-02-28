import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fromLonLat } from 'ol/proj';
import { Clock, HeatmapComponent, SearchComponent, WeatherInfo, SearchResult } from '../common/heatmapcomponents';

const Staticheatmap = ({ style = { height: '92vh', width: '100%' }, emissionRate, resultMtCO2, adjustedTemp, activeCO2 }) => {
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
                })
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
            "Quezon City",
            "Manila",
            "Davao City",
            "Caloocan",
            "Taguig",
            "Zamboanga City",
            "Cebu City",
            "Antipolo",
            "Pasig",
            "Cagayan de Oro",
            "Valenzuela",
            "Dasmariñas",
            "General Santos",
            "Parañaque",
            "Bacoor",
            "San Jose del Monte",
            "Makati",
            "Las Piñas",
            "Bacolod",
            "Muntinlupa",
            "Calamba",
            "Lapu-Lapu City",
            "Imus",
            "Angeles City",
            "Iloilo City",
            "Marikina",
            "General Trias",
            "Pasay",
            "Mandaluyong",
            "Santa Rosa",
            "Biñan",
            "Tarlac City",
            "Malabon",
            "Lipa",
            "Butuan",
            "Baguio",
            "Mandaue",
            "Iligan",
            "Cabuyao",
            "San Fernando",
            "Batangas City",
            "Cabanatuan",
            "San Pedro",
            "Cotabato City",
            "Puerto Princesa",
            "Tagum",
            "Mabalacat",
            "San Pablo",
            "Lucena",
            "Talisay",
            "Malolos",
            "Olongapo",
            "Tacloban",
            "Navotas",
            "Ormoc",
            "Meycauayan",
            "Santo Tomas",
            "Valencia",
            "Trece Martires",
            "Pagadian",
            "Legazpi",
            "Panabo",
            "Naga",
            "Toledo",
            "Marawi",
            "San Carlos",
            "Kabankalan",
            "Koronadal",
            "Tanauan",
            "Bago",
            "Malaybalay",
            "Digos",
            "Calbayog",
            "Sorsogon City",
            "Roxas",
            "Dagupan",
            "Surigao City",
            "Tuguegarao",
            "Kidapawan",
            "Cadiz",
            "Ilagan",
            "Danao",
            "San Jose",
            "Sagay",
            "Santiago",
            "Mati",
            "Calapan",
            "Urdaneta",
            "Cauayan",
            "Tabaco",
            "Ozamiz",
            "Dipolog",
            "Gingoog",
            "Carcar",
            "Dumaguete",
            "Silay",
            "Isabela",
            "San Juan",
            "Gapan",
            "Bayawan",
            "Tabuk",
            "Ligao",
            "Samal",
            "Himamaylan",
            "Iriga",
            "Tayabas",
            "Baybay",
            "Laoag",
            "Bayugan",
            "Tacurong",
            "Catbalogan",
            "Carmona",
            "Tagbilaran",
            "Masbate",
            "Balanga",
            "Guihulngan",
            "Cavite City",
            "Lamitan",
            "Alaminos",
            "Bislig",
            "Escalante",
            "Victorias",
            "Passi",
            "Bogo",
            "Maasin",
            "Calaca",
            "Tagaytay",
            "Dapitan",
            "Bais",
            "Muñoz",
            "Tanjay",
            "Cabadbaran",
            "Sipalay",
            "Oroquieta",
            "Borongan",
            "Tangub",
            "La Carlota",
            "Tandag",
            "Candon",
            "Canlaon",
            "El Salvador",
            "Batac",
            "Vigan",
            "Palayan"
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
                    <HeatmapComponent 
                      map={mapInstance} 
                      weatherData={weatherData}
                      emissionRate={emissionRate}
                      resultMtCO2={resultMtCO2}
                      adjustedTemp={adjustedTemp}
                      activeCO2={activeCO2}
                    />  
                </>
            )}            
            <SearchComponent setSearchCity={setSearchCity} fetchSearchCityWeather={fetchSearchCityWeather} />
            <WeatherInfo averageTemperature={averageTemperature} hazardousWaterLevels={hazardousWaterLevels} />
            <SearchResult searchResult={searchResult} />
        </div>
    );
};

export default Staticheatmap;
