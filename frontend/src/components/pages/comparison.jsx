import React, { useState, useEffect, useMemo } from 'react';
import { Box, Card, CardContent, TextField, Typography, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2'; // using Grid2 from MUI
import { LineChart } from '@mui/x-charts/LineChart';
import regression from 'regression';

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

// Dummy function to simulate fetching weather data (API Temperature)
const fetchCityWeather = async (cityName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API temperature between 26°C and 30°C
      const apiTemperature = (26 + Math.random() * 4).toFixed(2);
      resolve({ city: cityName, apiTemperature });
    }, 500);
  });
};

// Compute parameters based on API temperature, emissionRate, and baseMtCO2.
const computeCityParameters = (apiTemp, emissionRate, baseMtCO2) => {
  const adjustedTemp = parseFloat(apiTemp) + 0.5;
  const activeCO2 = baseMtCO2 * (emissionRate / 100);
  const resultMtCO2 = baseMtCO2 + activeCO2;
  return { adjustedTemp, activeCO2, resultMtCO2 };
};

// Get population projection using simulated base data for 2020-2025 and regression extrapolation
const getPopulationProjection = (cityName) => {
  // Simulate base population data for years 2020 to 2025
  const baseYears = [2020, 2021, 2022, 2023, 2024, 2025];
  const basePopulation = baseYears.map(() => Math.floor(1000000 + Math.random() * 500000));
  
  // Create regression model on base data
  const dataPoints = baseYears.map((year, idx) => [year, basePopulation[idx]]);
  const model = regression.linear(dataPoints);
  
  // Define the full range of years (2015 to 2030)
  const fullYears = [];
  for (let year = 2015; year <= 2030; year++) {
    fullYears.push(year);
  }
  
  // Use regression to predict population for each year
  const fullPopulation = fullYears.map(year => {
    const pred = model.predict(year);
    return Math.round(pred[1]);
  });
  
  return { city: cityName, allYears: fullYears, allPopulation: fullPopulation };
};

// Regression chart component for population projections (for two cities)
const PredictionChart = ({ city1Pop, city2Pop }) => {
  const safeValueFormatter = (value, unit = '') =>
    value !== null && value !== undefined ? `${value}${unit}` : 'N/A';

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Population Projection (2015–2030)</Typography>
      {city1Pop && city2Pop && (
        <LineChart
          width={600}
          height={300}
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
            {
              id: 'pop',
              label: 'Population',
            },
          ]}
          margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
        />
      )}
    </Box>
  );
};

const Comparison = () => {
  // Editable parameters and selections
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [selectedYear, setSelectedYear] = useState(2022);
  const [emissionRate, setEmissionRate] = useState(70);
  const [baseMtCO2, setBaseMtCO2] = useState(155.38);

  // Data for each city
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const [city1Pop, setCity1Pop] = useState(null);
  const [city2Pop, setCity2Pop] = useState(null);

  // Fetch weather data and compute parameters for City 1
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

  // Fetch weather data and compute parameters for City 2
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Compare Two Philippine Cities</Typography>
      <Grid container spacing={2}>
        {/* Left Panel: City 1 Selection */}
        <Grid xs={12} md={3}>
          <Autocomplete
            options={philippineCities}
            value={city1}
            onChange={(event, newValue) => setCity1(newValue)}
            renderInput={(params) => <TextField {...params} label="City 1" variant="outlined" />}
          />
        </Grid>
        {/* Middle Panel: Comparison Details */}
        <Grid xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Comparison Details</Typography>
              <TextField
                label="Selected Year"
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Emission Rate (%)"
                type="number"
                value={emissionRate}
                onChange={(e) => setEmissionRate(Number(e.target.value))}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Base MtCO₂ (Predicted)"
                type="number"
                value={baseMtCO2}
                onChange={(e) => setBaseMtCO2(Number(e.target.value))}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              {city1Data && city2Data ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">City 1: {city1Data.city}</Typography>
                  <Typography variant="body2">
                    API Temperature: {city1Data.apiTemperature}°C<br />
                    Adjusted Temperature: {city1Data.adjustedTemp}°C<br />
                    Predicted MtCO₂: {baseMtCO2.toFixed(2)} MtCO₂<br />
                    Active MtCO₂: {(baseMtCO2 * (emissionRate / 100)).toFixed(2)} MtCO₂<br />
                    Result MtCO₂: {(baseMtCO2 * (1 + emissionRate / 100)).toFixed(2)} MtCO₂
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">City 2: {city2Data.city}</Typography>
                    <Typography variant="body2">
                      API Temperature: {city2Data.apiTemperature}°C<br />
                      Adjusted Temperature: {city2Data.adjustedTemp}°C<br />
                      Predicted MtCO₂: {baseMtCO2.toFixed(2)} MtCO₂<br />
                      Active MtCO₂: {(baseMtCO2 * (emissionRate / 100)).toFixed(2)} MtCO₂<br />
                      Result MtCO₂: {(baseMtCO2 * (1 + emissionRate / 100)).toFixed(2)} MtCO₂
                    </Typography>
                  </Box>
                  <PredictionChart city1Pop={city1Pop} city2Pop={city2Pop} />
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Please select both cities to compare details.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Right Panel: City 2 Selection */}
        <Grid xs={12} md={3}>
          <Autocomplete
            options={philippineCities}
            value={city2}
            onChange={(event, newValue) => setCity2(newValue)}
            renderInput={(params) => <TextField {...params} label="City 2" variant="outlined" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Comparison;
