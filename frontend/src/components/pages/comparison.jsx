import React, { useState, useEffect, useMemo } from 'react';
import { Box, Card, CardContent, TextField, Typography, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Using Grid2 from MUI
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
  "Tacloban", "Catbalogan", "Carmona", "Tagbilaran", "Masbate", "Balanga", "Guihulngan", "Cavite City", "Lamitan", "Alaminos", "Bislig",
  "Escalante", "Victorias", "Passi", "Bogo", "Maasin", "Calaca", "Tagaytay", "Dapitan", "Bais", "Muñoz", "Tanjay", "Cabadbaran",
  "Sipalay", "Oroquieta", "Borongan", "Tangub", "La Carlota", "Tandag", "Candon", "Canlaon", "El Salvador", "Batac", "Vigan", "Palayan"
];

/* -------------------------------
   Helper Functions & Hooks
---------------------------------*/

// Actual function to fetch weather data from OpenWeather API
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
  // For temperature, we simply add 0.5°C regardless; if you need to factor year, adjust here.
  const adjustedTemp = parseFloat(apiTemp) + 0.5;
  const activeCO2 = baseMtCO2 * (emissionRate / 100);
  const resultMtCO2 = baseMtCO2 + activeCO2;
  return { adjustedTemp, activeCO2, resultMtCO2 };
};

// Get population projection for a city using data from citypopulation.json.
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

// Hook: Compute base MtCO₂ for the selected year using regression on historical CO₂ data.
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

// Compute CO₂ series from regression model using historical data (2022–2030)
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
   Chart Components
---------------------------------*/

// Temperature Chart (2022–2030)
const TemperatureChart = ({ city1Data, city2Data }) => {
  if (!city1Data || !city2Data) return null;
  const years = [];
  for (let y = 2022; y <= 2030; y++) {
    years.push(y);
  }
  const city1APITemp = Array(years.length).fill(parseFloat(city1Data.apiTemperature));
  const city1AdjustedTemp = Array(years.length).fill(city1Data.adjustedTemp);
  const city2APITemp = Array(years.length).fill(parseFloat(city2Data.apiTemperature));
  const city2AdjustedTemp = Array(years.length).fill(city2Data.adjustedTemp);
  const series = [
    { data: city1APITemp, label: `${city1Data.city} API Temp (°C)`, yAxisKey: 'temp', color: '#FF6384' },
    { data: city1AdjustedTemp, label: `${city1Data.city} Adjusted Temp (°C)`, yAxisKey: 'temp', color: '#FF9F40' },
    { data: city2APITemp, label: `${city2Data.city} API Temp (°C)`, yAxisKey: 'temp', color: '#36A2EB' },
    { data: city2AdjustedTemp, label: `${city2Data.city} Adjusted Temp (°C)`, yAxisKey: 'temp', color: '#4BC0C0' },
  ];
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Temperature Projection (2022–2030)
      </Typography>
      <LineChart 
        width={400}
        height={600}
        series={series}
        xAxis={[{ data: years, scaleType: 'band', label: 'Year', valueFormatter: (v) => v.toString() }]}
        yAxis={[{ id: 'temp', label: 'Temperature (°C)', min: 25, max: 50, tickNumber: 8 }]}
        margin={{ left: 50, right: 50, top: 20, bottom: 20 }}
      />
    </Box>
  );
};

// CO₂ Chart (2022–2030)
const CO2Chart = ({ emissionRate }) => {
  const years = [];
  for (let y = 2022; y <= 2030; y++) {
    years.push(y);
  }
  const co2Series = useMemo(() => computeCO2Series(emissionRate), [emissionRate]);
  const series = [
    { data: co2Series.predicted, label: 'Predicted MtCO₂', yAxisKey: 'co2', color: '#FFCE56' },
    { data: co2Series.active, label: 'Active MtCO₂', yAxisKey: 'co2', color: '#9966FF' },
    { data: co2Series.result, label: 'Result MtCO₂', yAxisKey: 'co2', color: '#FF6384' },
  ];
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        CO₂ Projection (2022–2030)
      </Typography>
      <LineChart
        width={400}
        height={600}
        series={series}
        xAxis={[
          {
            data: years,
            scaleType: 'band',
            label: 'Year',
            valueFormatter: (value) => value.toString(),
          },
        ]}
        yAxis={[
          { id: 'co2', label: 'MtCO₂', position: 'right', min: 140, max: 250, tickNumber: 6 },
        ]}
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
  const safeValueFormatter = (value, unit = '') =>
    value !== null && value !== undefined ? `${value}${unit}` : 'N/A';
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Population Projection (2015–2030)</Typography>
      {city1Pop && city2Pop && (
        <LineChart
          width={400}
          height={600}
          series={[
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
          ]}
          xAxis={[
            {
              data: city1Pop.allYears,
              scaleType: 'band',
              label: 'Year',
              valueFormatter: (value) => value.toString(),
            },
          ]}
          yAxis={[
            { id: 'pop', label: 'Population' },
          ]}
          margin={{ left: 50, right: 50, top: 20, bottom: 20 }}
        />
      )}
    </Box>
  );
};

/* -------------------------------
   Main Layout: 3 Columns x 2 Rows
---------------------------------*/
const Comparison = () => {
  // Editable parameters and selections
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [selectedYear, setSelectedYear] = useState(2020); // Allowed: 2020–2030
  const [emissionRate, setEmissionRate] = useState(0); // Allowed: 0–100
  const baseMtCO2 = useRegressionBaseMtCO2(selectedYear);

  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const [city1Pop, setCity1Pop] = useState(null);
  const [city2Pop, setCity2Pop] = useState(null);

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
    <Box sx={{ p: 3, height: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom>
        Compare Two Philippine Cities
      </Typography>
      {/* Row 1: Top 3 Columns */}
      <Grid container spacing={2} sx={{ height: '50%' }}>
        {/* Column 1: City 1 Selection & Details */}
        <Grid xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="h6">City 1 Selection</Typography>
              <Autocomplete
                options={philippineCities}
                value={city1}
                onChange={(event, newValue) => setCity1(newValue)}
                renderInput={(params) => <TextField {...params} label="City 1" variant="outlined" />}
              />
            </CardContent>
          </Card>
          {city1Data ? (
            <Card variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1">City 1 Details</Typography>
                <Typography variant="body2">
                  API Temp: {city1Data.apiTemperature}°C<br />
                  Adjusted Temp: {city1Data.adjustedTemp}°C<br />
                  Predicted MtCO₂: {baseMtCO2.toFixed(2)} MtCO₂<br />
                  Active MtCO₂: {(baseMtCO2 * (emissionRate / 100)).toFixed(2)} MtCO₂<br />
                  Result MtCO₂: {(baseMtCO2 * (1 + emissionRate / 100)).toFixed(2)} MtCO₂
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              City 1 details not available.
            </Typography>
          )}
        </Grid>

        {/* Column 2: Parameters Card & Population Projection Chart */}
        <Grid xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 1 }}>
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
          {city1Pop && city2Pop ? (
            <Card variant="outlined">
              <CardContent>
                <PopulationChart city1Pop={city1Pop} city2Pop={city2Pop} />
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2">
              Select both cities to view population projections.
            </Typography>
          )}
        </Grid>

        {/* Column 3: City 2 Selection & Details */}
        <Grid xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="h6">City 2 Selection</Typography>
              <Autocomplete
                options={philippineCities}
                value={city2}
                onChange={(event, newValue) => setCity2(newValue)}
                renderInput={(params) => <TextField {...params} label="City 2" variant="outlined" />}
              />
            </CardContent>
          </Card>
          {city2Data ? (
            <Card variant="outlined" sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1">City 2 Details</Typography>
                <Typography variant="body2">
                  API Temp: {city2Data.apiTemperature}°C<br />
                  Adjusted Temp: {city2Data.adjustedTemp}°C<br />
                  Predicted MtCO₂: {baseMtCO2.toFixed(2)} MtCO₂<br />
                  Active MtCO₂: {(baseMtCO2 * (emissionRate / 100)).toFixed(2)} MtCO₂<br />
                  Result MtCO₂: {(baseMtCO2 * (1 + emissionRate / 100)).toFixed(2)} MtCO₂
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              City 2 details not available.
            </Typography>
          )}
        </Grid>
      </Grid>
      {/* Row 2: Three Charts */}
      <Grid container spacing={2} sx={{ mt: 2, height: '50%' }}>
        {/* Column 1: Temperature Projection Chart */}
        <Grid xs={12} md={4}>
          {city1Data && city2Data ? (
            <Card variant="outlined">
              <CardContent>
                <TemperatureChart city1Data={city1Data} city2Data={city2Data} />
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2">Select both cities to view temperature projections.</Typography>
          )}
        </Grid>
        {/* Column 2: (Population Projection Chart already in Row 1, Column 2) */}
        {/* Column 3: CO₂ Projection Chart */}
        <Grid xs={12} md={4}>
          {city1Data && city2Data ? (
            <Card variant="outlined">
              <CardContent>
                <CO2Chart emissionRate={emissionRate} />
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2">Select both cities to view CO₂ projections.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Comparison;
