import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  useMediaQuery,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Google, Facebook, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import image from "../../assets/img.png";
import { loginUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { signInWithGoogle } from "../../utils/signInWithGoogle";
import axios from "axios";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmail, setResetEmail] = useState("rk@gmail.com");
  const [resetMessage, setResetMessage] = useState(null);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmailError, setResetEmailError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setIsSubmitting(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      const response = await loginUser({ email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const userId = decoded.userId;
      const emailFromToken = decoded.email;
      const userName = decoded.name;

      localStorage.setItem("userId", userId);
      localStorage.setItem("email", emailFromToken);
      localStorage.setItem("userName", userName);

      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const { success, user, error: googleError } = await signInWithGoogle();
      if (!success) throw googleError;

      const idToken = await user.getIdToken();

      // Send Firebase token to backend to get your JWT
      const response = await loginUser({ firebaseToken: idToken });
      const token = response.data.token;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("email", decoded.email);
      localStorage.setItem("userName", decoded.name);

      navigate("/");
    } catch (err) {
      console.error("Google Sign-In failed:", err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to open the dialog
  const handleOpenResetDialog = () => {
    setOpenResetDialog(true);
    setResetEmail(email); // Pre-fill with email from login form if available
    setResetEmailError("");
  };

  // Handler to close the dialog
  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
    setResetEmailError("");
  };

  const handlePasswordResetLink = async () => {
    setResetMessage(null);
    setError("");
    setResetEmailError("");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetEmail) {
      setResetEmailError("Email is required");
      return;
    } else if (!emailRegex.test(resetEmail)) {
      setResetEmailError("Enter a valid email address");
      return;
    }

    setIsResetting(true);

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/request-password-reset?email=${resetEmail}`
      );
      console.log(response.data);
      const message = response.data.message;
      if (message.includes("not registered")) {
        setResetMessage({
          text: message,
          color: "error",
        });
      } else {
        setResetMessage({
          text: message,
          color: "success",
        });
      }
      handleCloseResetDialog();
    } catch (err) {
      setResetEmailError("Failed to send link to reset password.");
    } finally {
      setIsResetting(false);
    }
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      container
      sx={{ height: "100vh", backgroundColor: "var(--color-primary)" }}
    >
      {/* LEFT SECTION */}
      {!isSmallScreen && (
        <Grid
          item
          xs={12}
          md={6}
          width={"60%"}
          sx={{
            backgroundImage: `url(${image})`,
            color: "var(--color-primary)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 10,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            color="var(--color-primary)"
          >
            Welcome to
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="var(--color-primary)"
          >
            FinFlow Community
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2 }}
            color="var(--color-primary)"
          >
            Home to smart financial tracking and insights.
          </Typography>
        </Grid>
      )}

      {/* RIGHT SECTION */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          width: isSmallScreen ? "100%" : "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 3, sm: 10 },
          backgroundColor: "var(--color-primary)",
        }}
      >
        <Box width="100%" maxWidth="400px">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Welcome back!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Login to your account
          </Typography>
          <Typography variant="body2" mb={2}>
            It’s nice to see you again. Ready to add some expenses?
          </Typography>

          <TextField
            label="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{ sx: { backgroundColor: "var(--color-input-bg)" } }}
          />
          <TextField
            label="Your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{ sx: { backgroundColor: "var(--color-input-bg)" } }}
          />
          {error && (
            <Typography variant="body2" color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Button
            onClick={handleLogin}
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 2,
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-button-text)",
              "&:hover": {
                backgroundColor: "#220057",
              },
            }}
          >
            {isSubmitting ? "Please wait..." : "Log In"}
          </Button>

          <Box
            mt={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevents the default anchor behavior
                handleOpenResetDialog();
              }}
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>
          {resetMessage && (
            <Typography variant="body2" color={resetMessage.color} mt={1}>
              {resetMessage.text}
            </Typography>
          )}

          <Dialog open={openResetDialog} onClose={handleCloseResetDialog}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Enter your email address, and we'll send you a link to reset
                your password.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                error={!!resetEmailError}
                helperText={resetEmailError}
              />
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                flexDirection: "flex-end",
                gap: 1,
                mx: 2,
                mb: 2,
              }}
            >
              <Button onClick={handleCloseResetDialog}>Cancel</Button>
              <Button
                onClick={handlePasswordResetLink}
                variant="contained"
                color="primary"
                disabled={isResetting}
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </Button>
            </DialogActions>
          </Dialog>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* SOCIAL LOGIN BUTTONS */}
          <Box sx={{ marginTop: 2 }} display="grid" gap={2}>
            <Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
              >
                Continue with Google
              </Button>
            </Box>
            {/* <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" fullWidth startIcon={<Facebook />}>
                  Facebook
                </Button>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" fullWidth startIcon={<LinkedIn />}>
                  LinkedIn
                </Button>
              </Box>
            </Box> */}
          </Box>

          <Typography mt={4} align="center">
            Don’t have an account?{" "}
            <Link href="sign-up" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
