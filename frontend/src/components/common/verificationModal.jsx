import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

const VerificationModal = ({ open, onClose, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    // Basic validation
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Please enter a valid 6-digit numeric code.");
      return;
    }
    setLoading(true);
    try {
      await onVerify(verificationCode);
      onClose(); // Optionally close the modal on success
      toast.success("Email verified successfully!");
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Verify Your Email</DialogTitle>
      <DialogContent>
        <Typography variant="body2" align="center" gutterBottom>
          Enter the 6-digit verification code sent to your email.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Verification Code"
          type="text"
          fullWidth
          variant="outlined"
          value={verificationCode}
          onChange={(e) => {
            setVerificationCode(e.target.value);
            if (error) setError("");
          }}
          inputProps={{
            maxLength: 6,
            style: { textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.3rem" },
          }}
          disabled={loading}
          placeholder="123456"
        />
        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleVerify} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificationModal;
