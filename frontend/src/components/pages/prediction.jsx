import React, { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import regression from 'regression';
import { Box, Typography } from '@mui/material';

const Prediction = () => {
    // Historical data with population and temperatures
    const historicalData = useMemo(() => ({
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
        population: [
            105312992, 106735719, 108119693, 109465287, 110804683,
            112081264, 113100950, 113964338, 114891199 // 2023 population
        ],
        co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 
                      136678980, 146142190, 155380930, 163150976],
        temperatures: [26.41, 26.47, 26.53, 26.58, 26.63, 26.67, 26.71, 26.74, 26.78]
    }), []);

    // Future projections
    const futureData = useMemo(() => ({
        years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
        population: [115843670, 116786962, 117729254, 118671546, 
                    119613838, 120556130, 121498422]
    }), []);

    // Memoized calculations
    const { allYears, allTemps, allMtCO2, regressionLine } = useMemo(() => {
        // Calculate historical MtCO2
        const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
        
        // Create regression model
        const regressionModel = regression.linear(
            mtco2.map((v, i) => [v, historicalData.temperatures[i]])
        );
        
        // Calculate per capita emissions trend
        const emissionTrend = regression.linear(
            historicalData.years.map((y, i) => [
                y, 
                mtco2[i] / (historicalData.population[i] / 1000000) // per capita in tons
            ])
        );

        // Future calculations
        const futurePerCapita = futureData.years.map(y => 
            emissionTrend.predict(y)[1]
        );
        
        const futureMtCO2 = futureData.population.map((pop, i) => 
            (pop / 1000000 * futurePerCapita[i]) // Convert population to millions
        );

        // Temperature projections
        const baseTemp = historicalData.temperatures.slice(-1)[0];
        const lastCO2 = mtco2.slice(-1)[0];
        const futureTemps = futureMtCO2.map(co2 => 
            baseTemp + 0.015 * (co2 - lastCO2)
        );

        return {
            allYears: [...historicalData.years, ...futureData.years],
            allTemps: [...historicalData.temperatures, ...futureTemps],
            allMtCO2: [...mtco2, ...futureMtCO2],
            regressionLine: [
                ...mtco2.map(co2 => regressionModel.predict([co2])[1]),
                ...futureMtCO2.map(co2 => regressionModel.predict([co2])[1])
            ]
        };
    }, [historicalData, futureData]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Philippines Urban Heat Prediction Model (2015-2030)
            </Typography>
            
            <LineChart
                width={1200}
                height={600}
                series={[
                    { 
                        data: allTemps,
                        label: 'Temperature (°C)',
                        yAxisKey: 'temp',
                        color: '#ff6384',
                        valueFormatter: (value) => value !== null ? `${value.toFixed(2)}°C` : 'N/A',
                    },
                    { 
                        data: regressionLine,
                        label: 'Regression Projection',
                        yAxisKey: 'temp',
                        color: '#ff0000',
                        dashStyle: '5 5',
                        valueFormatter: (value) => value !== null ? `${value.toFixed(2)}°C` : 'N/A',
                    },
                    {
                        data: allMtCO2,
                        label: 'CO₂ Emissions (MtCO2)',
                        yAxisKey: 'co2',
                        color: '#4bc0c0',
                        valueFormatter: (value) => value !== null ? `${value.toFixed(1)} Mt` : 'N/A',
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
                        valueFormatter: (value) => value !== null ? `${value.toFixed(2)}°C` : 'N/A',
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
                Data Sources: PAGASA, World Bank, PSA - Projections based on linear regression model
            </Typography>
        </Box>
    );
};

export default Prediction;