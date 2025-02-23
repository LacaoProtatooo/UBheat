import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import MuiModal from "../ui/mui-modal";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const useCO2Emissions = (initialBase = 155.38) => {
  const [emissionRate, setEmissionRate] = useState(70);
  const [baseMtCO2, setBaseMtCO2] = useState(initialBase);
  const [result, setResult] = useState(0);

  const updateBase = (newBase) => {
    setBaseMtCO2(newBase);
    calculateResult(emissionRate, newBase);
  };

  const handleEmissionRateChange = (newRate) => {
    setEmissionRate(newRate);
    calculateResult(newRate, baseMtCO2); // Recalculate result when emission rate changes
  };

  const handleBaseMtCO2Change = (event) => {
    const newValue = parseFloat(event.target.value);
    setBaseMtCO2(newValue);
    calculateResult(emissionRate, newValue); // Recalculate result when base MtCO₂ changes
  };

  const calculateResult = (rate, base) => {
    const calculatedResult = (rate / 100) * base; // Example calculation: emission rate % of base MtCO₂
    setResult(calculatedResult.toFixed(2)); // Round to 2 decimal places
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

export const CO2EmissionsModal = ({ emissionRate, baseMtCO2, result, handleEmissionRateChange, handleBaseMtCO2Change }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer" onClick={handleOpen}>
        Open Details
      </button>
      <MuiModal
        open={modalOpen}
        handleClose={handleClose}
        title="CO2 Emissions Details"
        description={
          <div>
            <TextField
              label="Base MtCO₂"
              value={baseMtCO2}
              onChange={handleBaseMtCO2Change}
              variant="outlined"
              sx={{ width: '100%', mt: 2 }}
            />
            <TextField
              label="Result (MtCO₂)"
              value={result}
              InputProps={{
                readOnly: true, // Make the textbox uneditable
              }}
              variant="outlined"
              sx={{ width: '100%', mt: 2 }}
            />
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
    onYearChange(newValue); // Pass the selected year to the parent component
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
        backgroundColor: '#f0fdf4', // Green background
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
        backgroundColor: '#fef2f2', // Red background
      },
    }}
  />
);
