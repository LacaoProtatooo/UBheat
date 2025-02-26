import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import MuiModal from "../ui/mui-modal";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import regression from 'regression';

export const useCO2Emissions = (initialBase = 155.38) => {
  const [emissionRate, setEmissionRate] = useState(70);
  const [baseMtCO2, setBaseMtCO2] = useState(initialBase);
  const [result, setResult] = useState(0);

  // This function now computes:
  // Active MtCO₂ = baseMtCO2 * (emissionRate/100)
  // Result MtCO₂ = baseMtCO2 + Active MtCO₂ = baseMtCO2 * (1 + emissionRate/100)
  const calculateResult = (rate, base) => {
    const active = base * (rate / 100);
    const total = base + active;
    setResult(total.toFixed(2));
  };

  const updateBase = (newBase) => {
    setBaseMtCO2(newBase);
    calculateResult(emissionRate, newBase);
  };

  const handleEmissionRateChange = (newRate) => {
    setEmissionRate(newRate);
    calculateResult(newRate, baseMtCO2);
  };

  const handleBaseMtCO2Change = (event) => {
    const newValue = parseFloat(event.target.value);
    setBaseMtCO2(newValue);
    calculateResult(emissionRate, newValue);
  };

  return {
    emissionRate,
    baseMtCO2,
    result,
    handleEmissionRateChange,
    handleBaseMtCO2Change,
    updateBase 
  };
};

// Modified predictive model hook accepts emissionRate and uses it to adjust future temperature predictions.
export const usePredictiveModel = (emissionRate = 70) => {
  const historicalData = {
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    population: [
      105312992, 106735719, 108119693, 109465287, 110804683,
      112081264, 113100950, 113964338, 114891199
    ],
    co2Emissions: [113908720, 122214770, 136583970, 142309430, 148800700, 
                    136678980, 146142190, 155380930, 163150976],
    temperatures: [26.41, 26.47, 26.53, 26.58, 26.63, 26.67, 26.71, 26.74, 26.78]
  };

  const futureData = {
    years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
    population: [115843670, 116786962, 117729254, 118671546, 
                 119613838, 120556130, 121498422]
  };

  // Convert CO₂ values to MtCO₂ (million tonnes)
  const mtco2 = historicalData.co2Emissions.map(x => x / 1000000);
  const yearTempModel = regression.linear(
    historicalData.years.map((y, i) => [y, historicalData.temperatures[i]])
  );

  const co2TempModel = regression.linear(
    mtco2.map((v, i) => [v, historicalData.temperatures[i]])
  );

  // Future MtCO₂ predictions using a growth rate
  const futureMtCO2 = futureData.population.map((pop, i) => {
    const growthRate = 1.015;
    return mtco2[mtco2.length - 1] * Math.pow(growthRate, i + 1);
  });

  // Incorporate emissionRate into the temperature prediction.
  // Assume a baseline emission rate of 70 and adjust by 0.05°C per percentage point difference.
  const baselineEmissionRate = 70;
  const adjustmentFactor = 0.05;
  const futureTemps = futureMtCO2.map((co2, i) => {
    const timeProjection = yearTempModel.predict([futureData.years[i]])?.[1] || 0;
    const co2Projection = co2TempModel.predict([co2])?.[1] || 0;
    const avgProjection = (timeProjection + co2Projection) / 2;
    const emissionAdjustment = (emissionRate - baselineEmissionRate) * adjustmentFactor;
    return avgProjection + emissionAdjustment;
  });

  return React.useMemo(() => ({
    allYears: [...historicalData.years, ...futureData.years],
    allTemps: [...historicalData.temperatures, ...futureTemps],
    allMtCO2: [...mtco2, ...futureMtCO2],
  }), [emissionRate]);
};

export const CO2EmissionsModal = ({ emissionRate, baseMtCO2, result, handleEmissionRateChange, handleBaseMtCO2Change }) => {
  // Compute Active MtCO₂ for display purposes.
  const activeMtCO2 = (baseMtCO2 * (emissionRate / 100)).toFixed(2);

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <button 
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer" 
        onClick={handleOpen}
      >
        Open Details
      </button>
      <MuiModal
        open={modalOpen}
        handleClose={handleClose}
        title="CO₂ Emissions Details"
        description={
          <div>
            {/* Editable Base MtCO₂ field (Predicted MtCO₂ from regression data) */}
            <TextField
              label="Predicted MtCO₂ (Regression Data)"
              type="number"
              value={baseMtCO2}
              onChange={handleBaseMtCO2Change}
              variant="outlined"
              sx={{ width: '100%', mt: 2 }}
            />
            {/* Active MtCO₂ (Computed as Base * Emission Rate) */}
            <TextField
              label="Active MtCO₂ (Base × Emission Rate)"
              value={activeMtCO2}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{ width: '100%', mt: 2 }}
            />
            {/* Result MtCO₂ (Sum of Predicted + Active) */}
            <TextField
              label="Result MtCO₂ (Predicted + Active)"
              value={result}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{ width: '100%', mt: 2 }}
            />
            {/* Additional details */}
            <div style={{ marginTop: 16, padding: 8, backgroundColor: "#f5f5f5", borderRadius: 4 }}>
              <strong>Emission Details:</strong>
              <p>Emission Rate: {emissionRate}%</p>
              <p>Predicted MtCO₂: {parseFloat(baseMtCO2).toFixed(2)} MtCO₂</p>
              <p>Active MtCO₂: {activeMtCO2} MtCO₂</p>
              <p>Result MtCO₂: {result} MtCO₂</p>
              <p>
                These values are used to temper the regression-based predictions for temperature and CO₂ emissions.
              </p>
            </div>
          </div>
        }
      />
    </>
  );
};

export const YearSelectSlider = ({ onYearChange }) => {
  const minYear = 2022;
  const maxYear = 2030;

  const handleYearChange = (event, newValue) => {
    onYearChange(newValue);
  };

  return (
    <Box sx={{ width: "90%" }}>
      <Slider
        aria-label="Year Select"
        defaultValue={minYear}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={minYear}
        max={maxYear}
        onChange={handleYearChange}
      />
    </Box>
  );
};

export const GoodEffectsTextArea = ({ value }) => (
  <TextField
    label="Positive Environmental Impacts"
    value={value}
    InputProps={{ readOnly: true }}
    variant="outlined"
    multiline
    rows={10}
    sx={{
      width: '100%',
      mt: 2,
      '& .MuiOutlinedInput-root': {
        overflowY: 'auto',
        backgroundColor: '#f0fdf4',
      },
    }}
  />
);

export const BadEffectsTextArea = ({ value }) => (
  <TextField
    label="Negative Environmental Effects"
    value={value}
    InputProps={{ readOnly: true }}
    variant="outlined"
    multiline
    rows={10}
    sx={{
      width: '100%',
      mt: 2,
      '& .MuiOutlinedInput-root': {
        overflowY: 'auto',
        backgroundColor: '#fef2f2',
      },
    }}
  />
);
