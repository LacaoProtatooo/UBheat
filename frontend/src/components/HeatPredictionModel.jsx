import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import regression from 'regression';
import { toPng } from 'html-to-image';

const PredictionChart = ({ onChartImageReady }) => {
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  const historicalData = useMemo(() => ({
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    population: [
      105312992, 106735719, 108119693, 109465287, 110804683,
      112081264, 113100950, 113964338, 114891199
    ],
    co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 
                  136678980, 146142190, 155380930, 163150976],
    temperatures: [26.41, 26.47, 26.53, 26.58, 26.63, 26.67, 26.71, 26.74, 26.78]
  }), []);

  const futureData = useMemo(() => ({
    years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
    population: [115843670, 116786962, 117729254, 118671546, 
                119613838, 120556130, 121498422]
  }), []);

  const { allYears, allTemps, allMtCO2, regressionLine } = useMemo(() => {
    const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
    
    const yearTempModel = regression.linear(
      historicalData.years.map((y, i) => [y, historicalData.temperatures[i]])
    );

    const co2TempModel = regression.linear(
      mtco2.map((v, i) => [v, historicalData.temperatures[i]])
    );

    const futureMtCO2 = futureData.population.map((pop, i) => {
      const growthRate = 1.015;
      return mtco2[mtco2.length-1] * Math.pow(growthRate, i+1);
    });

    const futureYears = futureData.years;
    const futureTemps = futureMtCO2.map((co2, i) => {
      const timeProjection = yearTempModel.predict([futureYears[i]])?.[1] || 0;
      const co2Projection = co2TempModel.predict([co2])?.[1] || 0;
      return (timeProjection + co2Projection) / 2;
    });

    return {
      allYears: [...historicalData.years, ...futureData.years],
      allTemps: [...historicalData.temperatures, ...futureTemps],
      allMtCO2: [...mtco2, ...futureMtCO2],
      regressionLine: [
        ...historicalData.years.map(y => yearTempModel.predict([y])?.[1] || 0),
        ...futureYears.map(y => yearTempModel.predict([y])?.[1] || 0)
      ]
    };
  }, [historicalData, futureData]);

  const safeValueFormatter = (value, unit = '') =>
    value !== null && value !== undefined ? `${value.toFixed(2)}${unit}` : 'N/A';

  useEffect(() => {
    if (chartRef.current) {
      toPng(chartRef.current)
        .then((dataUrl) => {
          setChartImage(dataUrl);
          onChartImageReady(dataUrl); // Pass the image URL to the parent component
        })
        .catch((error) => {
          console.error('Error generating chart image:', error);
        });
    }
  }, [onChartImageReady]);

  return (
    <Box sx={{ p: 3 }} ref={chartRef}>
      <Typography variant="h5" gutterBottom>
        Philippines Urban Heat Prediction Model (2015-2030)
      </Typography>
      
      <LineChart
        width={800}
        height={400}
        series={[
          { 
            data: allTemps,
            label: 'Observed & Projected Temperature (°C)',
            yAxisKey: 'temp',
            color: '#ff6384',
            valueFormatter: (value) => safeValueFormatter(value, '°C'),
          },
          { 
            data: regressionLine,
            label: 'Linear Trend Line',
            yAxisKey: 'temp',
            color: '#ff0000',
            dashStyle: '5 5',
            valueFormatter: (value) => safeValueFormatter(value, '°C'),
          },
          {
            data: allMtCO2,
            label: 'CO₂ Emissions (MtCO2)',
            yAxisKey: 'co2',
            color: '#4bc0c0',
            valueFormatter: (value) => safeValueFormatter(value, ' Mt'),
          },
        ]}
        xAxis={[{
          data: allYears,
          scaleType: 'band',
          label: 'Year',
          valueFormatter: (value) => value.toString(),
        }]}
        yAxis={[
          { 
            id: 'temp', 
            label: 'Temperature (°C)',
            min: 26,
            max: 28,
            tickNumber: 8,
            labelStyle: { 
                writingMode: 'vertical-rl',  
                textAlign: 'center', 
                transform: 'translate(-30px, 0px)', 
                fontSize: '1rem'
              }
          },
          { 
            id: 'co2', 
            label: 'CO₂ Emissions (MtCO2)', 
            position: 'right',
            min: 100,
            max: 200,
            tickNumber: 5,
          },
        ]}
        margin={{ left: 90, right: 90, top: 40, bottom: 60 }}
        sx={{
          '.MuiLineElement-root': { strokeWidth: 2.5 },
          '.MuiMarkElement-root': { display: 'none' },
          '.MuiChartsAxis-tickLabel': { fontSize: '0.875rem' }
        }}
      />
      
      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        Linear trend based on 2015-2023 data (R² = {regression.linear(
          historicalData.years.map((y, i) => [y, historicalData.temperatures[i]])
        ).r2.toFixed(3)})
      </Typography>
    </Box>
  );
};

export default PredictionChart;