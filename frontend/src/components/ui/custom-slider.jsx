import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

export default function SliderSizes({ onEmissionRateChange }) {
  const [emissionRate, setEmissionRate] = React.useState(70); // Default value

  const handleSliderChange = (event, newValue) => {
    setEmissionRate(newValue);
    onEmissionRateChange(newValue); // Pass the value to the parent component
  };

  return (
    <Box sx={{ width: '100%' }}> {/* Adjusted width to 100% */}
      <Slider
        size="small"
        defaultValue={70}
        value={emissionRate}
        onChange={handleSliderChange}
        aria-label="Emission Rate"
        valueLabelDisplay="auto"
      />
    </Box>
  );
}