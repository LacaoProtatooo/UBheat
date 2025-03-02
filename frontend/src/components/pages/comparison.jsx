import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Card, CardContent, TextField, Typography, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LineChart } from '@mui/x-charts/LineChart';
import regression from 'regression';
import axios from 'axios';
import citypopulation from '../../utils/citypopulation.json';

// Allowed cities list
const philippineCities = [
  "Quezon City", "Manila", "Davao City", "Caloocan", "Taguig", "Zamboanga City", "Cebu City", "Antipolo", "Pasig", "Cagayan de Oro",
  "Valenzuela", "Dasmariñas", "General Santos", "Parañaque", "Bacoor", "San Jose del Monte", "Makati", "Las Piñas", "Bacolod", "Muntinlupa",
  "Calamba", "Lapu-Lapu City", "Imus", "Angeles City", "Iloilo City", "Marikina", "General Trias", "Pasay", "Mandaluyong", "Santa Rosa",
  "Biñan", "Tarlac City", "Malabon", "Lipa", "Butuan", "Baguio", "Mandaue", "Iligan", "Cabuyao", "San Fernando", "Batangas City",
  "Cabanatuan", "San Pedro", "Cotabato City", "Puerto Princesa", "Tagum", "Mabalacat", "San Pablo", "Lucena", "Talisay", "Malolos",
  "Olongapo", "Tacloban", "Navotas", "Ormoc", "Meycauayan", "Santo Tomas", "Valencia", "Trece Martires", "Pagadian", "Legazpi",
  "Panabo", "Naga", "Toledo", "Marawi", "San Carlos", "Kabankalan", "Koronadal", "Tanauan", "Bago", "Malaybalay", "Digos", "Calbayog",
  "Sorsogon City", "Roxas", "Dagupan", "Surigao City", "Tuguegarao", "Kidapawan", "Cadiz", "Ilagan", "Danao", "San Jose", "Sagay",
  "Santiago", "Mati", "Calapan", "Urdaneta", "Cauayan", "Tabaco", "Ozamiz", "Dipolog", "Gingoog", "Carcar", "Dumaguete", "Silay",
  "Isabela", "San Juan", "Gapan", "Bayawan", "Tabuk", "Ligao", "Samal", "Himamaylan", "Iriga", "Tayabas", "Baybay", "Laoag", "Bayugan",
  "Catbalogan", "Carmona", "Tagbilaran", "Masbate", "Balanga", "Guihulngan", "Cavite City", "Lamitan", "Alaminos", "Bislig",
  "Escalante", "Victorias", "Passi", "Bogo", "Maasin", "Calaca", "Tagaytay", "Dapitan", "Bais", "Muñoz", "Tanjay", "Cabadbaran",
  "Sipalay", "Oroquieta", "Borongan", "Tangub", "La Carlota", "Tandag", "Candon", "Canlaon", "El Salvador", "Batac", "Vigan", "Palayan"
];

/* -------------------------------
   Helper Functions & Hooks
---------------------------------*/

// Fetch weather data from OpenWeather API
const fetchCityWeather = async (cityName) => {
  const apiKey = 'b05f228625b60990de863e6193f998af';
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},PH&appid=${apiKey}&units=metric`
    );
    const { main } = response.data;
    return { city: cityName, apiTemperature: main.temp.toFixed(2) };
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    return { city: cityName, apiTemperature: '0.00' };
  }
};

// Compute parameters based on API temperature, emissionRate, and base MtCO₂.
const computeCityParameters = (apiTemp, emissionRate, baseMtCO2) => {
  // Calculate active and result MtCO₂.
  const activeCO2 = baseMtCO2 * (emissionRate / 100);
  const resultMtCO2 = baseMtCO2 + activeCO2;

  // Calculate the ratio between result and base.
  const ratio = resultMtCO2 / baseMtCO2; // equals 1 + (emissionRate/100)
  
  // Assume baseline emissionRate of 70% corresponds to a ratio of 1.70.
  const baselineRatio = 1.7;
  
  // Determine the additional temperature adjustment.
  // Here, we use a constant multiplier of 5°C per ratio unit difference.
  const deltaTemp = (ratio - baselineRatio) * 5;
  
  // Compute adjusted temperature as API temperature plus 0.5 plus our delta.
  const adjustedTemp = parseFloat(apiTemp) + 0.5 + deltaTemp;

  return { adjustedTemp, activeCO2, resultMtCO2 };
};


// Get population projection for a city from citypopulation.json.
const getPopulationProjection = (cityName) => {
  const data = citypopulation[cityName];
  if (!data) return null;
  const baseYears = Object.keys(data).map(Number).sort((a, b) => a - b);
  const basePopulation = baseYears.map(year => data[year]);
  const dataPoints = baseYears.map((year, idx) => [year, basePopulation[idx]]);
  const model = regression.linear(dataPoints);
  const fullYears = [];
  for (let year = 2015; year <= 2030; year++) {
    fullYears.push(year);
  }
  const fullPopulation = fullYears.map(year => {
    const pred = model.predict(year);
    return Math.round(pred[1]);
  });
  return { city: cityName, allYears: fullYears, allPopulation: fullPopulation };
};

// Hook: Compute base MtCO₂ (predicted from regression) for the selected year.
const useRegressionBaseMtCO2 = (selectedYear) => {
  return useMemo(() => {
    const historicalData = {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 136678980, 146142190, 155380930, 163150976]
    };
    const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
    const dataPoints = historicalData.years.map((year, idx) => [year, mtco2[idx]]);
    const model = regression.linear(dataPoints);
    const fullYears = [];
    for (let year = 2015; year <= 2030; year++) {
      fullYears.push(year);
    }
    const fullMtCO2 = fullYears.map(year => {
      const pred = model.predict(year);
      return pred[1];
    });
    const index = fullYears.indexOf(selectedYear);
    return index !== -1 ? fullMtCO2[index] : 155.38;
  }, [selectedYear]);
};

// Compute CO₂ series (for 2022–2030) from regression.
const computeCO2Series = (emissionRate) => {
  const historicalData = {
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 136678980, 146142190, 155380930, 163150976]
  };
  const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
  const dataPoints = historicalData.years.map((year, idx) => [year, mtco2[idx]]);
  const model = regression.linear(dataPoints);
  const years = [];
  for (let year = 2022; year <= 2030; year++) {
    years.push(year);
  }
  const predicted = years.map(year => {
    const pred = model.predict(year);
    return pred[1];
  });
  const active = predicted.map(val => (emissionRate > 0 ? val * (emissionRate / 100) : 0));
  const result = predicted.map((val, i) => val + active[i]);
  return { years, predicted, active, result };
};

/* -------------------------------
   Responsive Chart Wrapper Component
---------------------------------*/
// This component measures its container and passes the measured width/height to the LineChart.
const ResponsiveLineChart = (props) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {dimensions.height > 0 && <LineChart {...props} width={dimensions.width} height={dimensions.height} />}
    </div>
  );
};

/* -------------------------------
   Chart Components
---------------------------------*/

// Temperature Chart (2022–2030)
const TemperatureChart = ({ city1Data, city2Data }) => {
  if (!city1Data || !city2Data) return null;
  const years = Array.from({ length: 9 }, (_, i) => 2022 + i);
  const city1APITemp = years.map(() => parseFloat(city1Data.apiTemperature));
  const city1AdjustedTemp = years.map(() => city1Data.adjustedTemp);
  const city2APITemp = years.map(() => parseFloat(city2Data.apiTemperature));
  const city2AdjustedTemp = years.map(() => city2Data.adjustedTemp);
  const series = [
    { data: city1APITemp, label: `${city1Data.city} API Temp (°C)`, yAxisKey: 'temp', color: '#FF6384' },
    { data: city1AdjustedTemp, label: `${city1Data.city} Adjusted Temp (°C)`, yAxisKey: 'temp', color: '#FF9F40' },
    { data: city2APITemp, label: `${city2Data.city} API Temp (°C)`, yAxisKey: 'temp', color: '#36A2EB' },
    { data: city2AdjustedTemp, label: `${city2Data.city} Adjusted Temp (°C)`, yAxisKey: 'temp', color: '#4BC0C0' },
  ];

  return (
    <Box sx={{ width: '100%', height: '95%' }}>
      <Typography variant="h6" gutterBottom>
        Temperature Projection (2022–2030)
      </Typography>
      <ResponsiveLineChart 
        series={series}
        xAxis={[{ data: years, scaleType: 'band', label: 'Year', valueFormatter: (v) => v.toString() }]}
        yAxis={[{ id: 'temp', label: 'Temperature (°C)', min: 15, max: 50, tickNumber: 8 }]}
        margin={{ left: 50, right: 50, top: 20, bottom: 20 }}
      />
    </Box>
  );
};

// CO₂ Chart (2022–2030)
const CO2Chart = ({ emissionRate }) => {
  const years = Array.from({ length: 9 }, (_, i) => 2022 + i);
  const co2Series = useMemo(() => computeCO2Series(emissionRate), [emissionRate]);
  const { predicted, active, result } = co2Series;
  const series = [
    { data: predicted, label: 'Predicted MtCO₂', yAxisKey: 'co2', color: '#FFCE56' },
    { data: active, label: 'Active MtCO₂', yAxisKey: 'co2', color: '#9966FF' },
    { data: result, label: 'Result MtCO₂', yAxisKey: 'co2', color: '#FF6384' },
  ];

  return (
    <Box sx={{ width: '100%', height: '95%' }}>
      <Typography variant="h6" gutterBottom>
        CO₂ Projection (2022–2030)
      </Typography>
      <ResponsiveLineChart 
        series={series}
        xAxis={[{ data: years, scaleType: 'band', label: 'Year', valueFormatter: (v) => v.toString() }]}
        yAxis={[{ id: 'co2', label: 'MtCO₂', position: 'right', min: 0, max: 300, tickNumber: 6 }]}
        margin={{ left: 50, right: 50, top: 20, bottom: 20 }}
        sx={{
          '.MuiLineElement-root': { strokeWidth: 2.5 },
          '.MuiMarkElement-root': { display: 'none' },
          '.MuiChartsAxis-tickLabel': { fontSize: '0.875rem' },
        }}
      />
    </Box>
  );
};

// Population Projection Chart (2015–2030)
const PopulationChart = ({ city1Pop, city2Pop }) => {
  if (!city1Pop || !city2Pop) return null;
  const safeValueFormatter = (value) =>
    value !== null && value !== undefined ? `${value}` : 'N/A';
  const years = city1Pop.allYears;
  const series = [
    {
      data: city1Pop.allPopulation,
      label: `${city1Pop.city} Population`,
      yAxisKey: 'pop',
      color: '#ff6384',
      valueFormatter: (value) => safeValueFormatter(value),
    },
    {
      data: city2Pop.allPopulation,
      label: `${city2Pop.city} Population`,
      yAxisKey: 'pop',
      color: '#36a2eb',
      valueFormatter: (value) => safeValueFormatter(value),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '95%' }}>
      <Typography variant="h6" gutterBottom>
        Population Projection (2015–2030)
      </Typography>
      <ResponsiveLineChart 
        series={series}
        xAxis={[
          {
            data: years,
            scaleType: 'band',
            label: 'Year',
            valueFormatter: (v) => v.toString(),
          },
        ]}
        yAxis={[
          { id: 'pop', label: 'Population' },
        ]}
        // Increased left margin for more space
        margin={{ left: 80, right: 50, top: 20, bottom: 20 }}
      />
    </Box>
  );
};

/* -------------------------------
   Main Layout: 6×6 CSS Grid
---------------------------------*/
const Comparison = () => {
  // States for city selections, selected year and emission rate.
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [selectedYear, setSelectedYear] = useState(2020);
  const [emissionRate, setEmissionRate] = useState(0);

  // Derived base MtCO₂ for the selected year.
  const baseMtCO2 = useRegressionBaseMtCO2(selectedYear);

  // City weather and population data states.
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const [city1Pop, setCity1Pop] = useState(null);
  const [city2Pop, setCity2Pop] = useState(null);

  // Fetch City 1 data.
  useEffect(() => {
    if (city1 && philippineCities.includes(city1)) {
      fetchCityWeather(city1).then(data => {
        const params = computeCityParameters(data.apiTemperature, emissionRate, baseMtCO2);
        setCity1Data({ ...data, ...params });
        const popData = getPopulationProjection(city1);
        setCity1Pop(popData);
      });
    }
  }, [city1, emissionRate, baseMtCO2]);

  // Fetch City 2 data.
  useEffect(() => {
    if (city2 && philippineCities.includes(city2)) {
      fetchCityWeather(city2).then(data => {
        const params = computeCityParameters(data.apiTemperature, emissionRate, baseMtCO2);
        setCity2Data({ ...data, ...params });
        const popData = getPopulationProjection(city2);
        setCity2Pop(popData);
      });
    }
  }, [city2, emissionRate, baseMtCO2]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        p: 2,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: 2,
      }}
    >
      {/* Top Section (Rows 1–2) */}
      {/* City 1 Selection & Details (Cols 1–2) */}
      <Box sx={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}>
        <Card variant="outlined" sx={{ mb: 1, height: '48%' }}>
          <CardContent>
            <Typography variant="h6">1st City Selection</Typography>
            <Autocomplete
              options={philippineCities}
              value={city1}
              onChange={(event, newValue) => setCity1(newValue)}
              renderInput={(params) => <TextField {...params} label="City 1" variant="outlined" />}
            />
          </CardContent>
        </Card>
        {city1Data ? (
          <Card variant="outlined" sx={{ height: '50%' }}>
            <CardContent>
              <Typography variant="subtitle1">1st City Details</Typography>
              <Typography variant="body2">
                API Temp: {city1Data.apiTemperature}°C<br />
                Adjusted Temp: {city1Data.adjustedTemp}°C<br />
                Predicted MtCO₂: {baseMtCO2.toFixed(2)} MtCO₂<br />
                Active MtCO₂: {(baseMtCO2 * (emissionRate / 100)).toFixed(2)} MtCO₂<br />
                Result MtCO₂: {city1Data.resultMtCO2.toFixed(2)} MtCO₂
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body2">City 1 details not available.</Typography>
        )}
      </Box>

      {/* Parameters Section (Cols 3–4) */}
      <Box sx={{ gridColumn: '3 / 5', gridRow: '1 / 3' }}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Parameters</Typography>
            <TextField
              label="Selected Year (2020–2030)"
              type="number"
              value={selectedYear}
              onChange={(e) => {
                const year = Number(e.target.value);
                if (year >= 2020 && year <= 2030) {
                  setSelectedYear(year);
                }
              }}
              variant="outlined"
              fullWidth
              margin="normal"
              inputProps={{ min: 2020, max: 2030 }}
            />
            <TextField
              label="Emission Rate (%)"
              type="number"
              value={emissionRate}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                setEmissionRate(value);
              }}
              variant="outlined"
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: 100, step: 1 }}
            />
            <TextField
              label="Base MtCO₂ (Predicted)"
              type="number"
              value={baseMtCO2.toFixed(2)}
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* City 2 Selection & Details (Cols 5–6) */}
      <Box sx={{ gridColumn: '5 / 7', gridRow: '1 / 3' }}>
        <Card variant="outlined" sx={{ mb: 1, height: '48%' }}>
          <CardContent>
            <Typography variant="h6">2nd City Selection</Typography>
            <Autocomplete
              options={philippineCities}
              value={city2}
              onChange={(event, newValue) => setCity2(newValue)}
              renderInput={(params) => <TextField {...params} label="City 2" variant="outlined" />}
            />
          </CardContent>
        </Card>
        {city2Data ? (
          <Card variant="outlined" sx={{ height: '50%' }}>
            <CardContent>
              <Typography variant="subtitle1">2nd City Details</Typography>
              <Typography variant="body2">
                API Temp: {city2Data.apiTemperature}°C<br />
                Adjusted Temp: {city2Data.adjustedTemp}°C<br />
                Predicted MtCO₂: {baseMtCO2.toFixed(2)} MtCO₂<br />
                Active MtCO₂: {(baseMtCO2 * (emissionRate / 100)).toFixed(2)} MtCO₂<br />
                Result MtCO₂: {city2Data.resultMtCO2.toFixed(2)} MtCO₂
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body2">City 2 details not available.</Typography>
        )}
      </Box>

      {/* Bottom Section: Charts */}
      {/* Temperature Projection Chart (Rows 3–6, Cols 1–2) */}
      <Box sx={{ gridColumn: '1 / 3', gridRow: '3 / 7' }}>
        {city1Data && city2Data ? (
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', p: 1 }}>
              <TemperatureChart city1Data={city1Data} city2Data={city2Data} />
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body2">Select both cities to view temperature projections.</Typography>
        )}
      </Box>

      {/* Population Projection Chart (Rows 3–6, Cols 3–4) */}
      <Box sx={{ gridColumn: '3 / 5', gridRow: '3 / 7' }}>
        {city1Pop && city2Pop ? (
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', p: 1 }}>
              <PopulationChart city1Pop={city1Pop} city2Pop={city2Pop} />
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body2">Select both cities to view population projections.</Typography>
        )}
      </Box>

      {/* CO₂ Projection Chart (Rows 3–6, Cols 5–6) */}
      <Box sx={{ gridColumn: '5 / 7', gridRow: '3 / 7' }}>
        {city1Data && city2Data ? (
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', p: 1 }}>
              <CO2Chart emissionRate={emissionRate} />
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body2">Select both cities to view CO₂ projections.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Comparison;
