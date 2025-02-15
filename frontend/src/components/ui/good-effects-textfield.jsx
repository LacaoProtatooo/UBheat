import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

export const GoodEffectsTextField = ({ text, speed = 10, ...props }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text, speed]);

  return (
    <TextField
      {...props}
      value={displayText}
      InputProps={{
        readOnly: true, // Make the text field uneditable
      }}
      multiline
      rows={10}
      fullWidth
    />
  );
};