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
} from "@mui/material";
import { Google, Facebook, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import image from "../../assets/img.png";
import { loginUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { signInWithGoogle } from "../../utils/signInWithGoogle";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (err.response?.data?.message?.includes("Google")) {
        setError(
          "This account was created via Google Sign-In. Please log in with Google."
        );
      } else {
        setError("Login failed. Please check your credentials.");
      }
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
            <Link href="#" underline="hover">
              Forgot password?
            </Link>
          </Box>

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
            <Box sx={{ display: "flex", gap: 2 }}>
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
            </Box>
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
