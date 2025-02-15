import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import MuiModal from "../ui/mui-modal";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const useCO2Emissions = () => {
  const [emissionRate, setEmissionRate] = useState(70); // State for emission rate
  const [baseMtCO2, setBaseMtCO2] = useState(135.68); // Base metric tons of CO₂
  const [result, setResult] = useState(0); // State for the calculated result

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
    InputProps={{
      readOnly: true, 
    }}
    variant="outlined"
    multiline // Allow multiple lines
    rows={10} 
    sx={{
      width: '100%',
      mt: 2,
      '& .MuiOutlinedInput-root': {
        overflowY: 'auto', // Enable vertical scrolling
      },
    }}
  />
);

export const BadEffectsTextArea = ({ value }) => (
  <TextField
    label="Negative Environmental Effects"
    value={value}
    InputProps={{
      readOnly: true, 
    }}
    variant="outlined"
    multiline 
    rows={10}
    sx={{
      width: '100%',
      mt: 2,
      '& .MuiOutlinedInput-root': {
        overflowY: 'auto', // Enable vertical scrolling
      },
    }}
  />
);
