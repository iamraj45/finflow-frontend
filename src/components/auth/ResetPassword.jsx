import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const passwordsMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  const handleReset = async () => {
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${apiUrl}/api/auth/reset-password`, null, {
        params: { token, newPassword },
      });
      console.log(res.data);
      setMessage(res.data.message);
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      setError(
        res.data.message ||
          "Failed to reset password. Link may be invalid or expired."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Reset link maybe invalid or expired");
    }
  }, [token]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      bgcolor="#f9f9f9"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: isSmallScreen ? "100%" : 400,
          maxWidth: "100%",
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Reset Your Password
        </Typography>

        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmPassword && newPassword !== confirmPassword}
          helperText={
            confirmPassword && newPassword !== confirmPassword
              ? "Passwords do not match"
              : ""
          }
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}
        {message && (
          <Typography color="primary" mt={1}>
            {message}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!passwordsMatch || isSubmitting}
          onClick={handleReset}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
