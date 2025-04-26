import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your email...");
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing token.");
      return;
    }

    axios
      .get(`${apiUrl}/api/auth/verifyEmail?token=${token}`)
      .then((res) => {
        if (res.data.status) {
          setStatus("success");
          setMessage(res.data.message);
          alert("Email verified successfully");
          navigate("/sign-in");
        } else {
          setStatus("error");
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data || "Verification failed.");
      });
  }, [searchParams, navigate]);

  const renderIcon = () => {
    if (status === "loading") return <CircularProgress />;
    if (status === "success")
      return <CheckCircleIcon color="success" fontSize="large" />;
    if (status === "error") return <ErrorIcon color="error" fontSize="large" />;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", textAlign: "center", p: 3 }}>
        <CardContent>
          <Box mb={2}>{renderIcon()}</Box>
          <Typography variant="h6" gutterBottom>
            {status === "loading"
              ? "Verifying..."
              : status === "success"
              ? "Email Verified!"
              : "Verification Failed"}
          </Typography>
          <Alert
            severity={status === "error" ? "error" : "info"}
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
          {status === "success" && (
            <Typography variant="caption" display="block" mt={1}>
              Redirecting to login...
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
