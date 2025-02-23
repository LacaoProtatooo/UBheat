import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";

export const GoodEffectsTextField = React.memo(({ text, speed = 90, ...props }) => {
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!text) return setDisplayText("");

    let currentIndex = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed]);

  return (
    <TextField
      {...props}
      value={displayText}
      InputProps={{ readOnly: true }}
      multiline
      rows={10}
      fullWidth
    />
  );
});