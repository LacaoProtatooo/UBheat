import React, { useState } from "react";
import SliderSizes from "../ui/custom-slider";
import TextField from '@mui/material/TextField';
import MuiModal from "../ui/mui-modal";

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
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer" onClick={handleOpen}>
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
