import React, { useState, useEffect } from 'react';
import { registerUser } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

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
} from '@mui/material';
import { Google, Facebook, GitHub, LinkedIn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import image from '../../assets/img.png';

const Register = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setError('');
    setSuccessMessage('');
    setIsSubmitting(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!name) {
      setNameError('Name is required');
      isValid = false;
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!agreed) {
      setError('You must agree to the Terms & Conditions to proceed.');
      isValid = false;
    }

    if (!isValid) return;

    try {
      setIsSubmitting(true);
      const response = await registerUser({ name, email, password });
      if (response.data.status === false) {
        setError(response.data.message);
        setIsSubmitting(false);
        return;
      }
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/sign-in');
      }, 3000);
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Something went wrong. Try again!');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container sx={{ height: '100vh', backgroundColor: 'var(--color-primary)' }}>
      {/* LEFT SECTION */}
      {!isSmallScreen && (
        <Grid
          item
          xs={12}
          md={6}
          width={'60%'}
          sx={{
            backgroundImage: `url(${image})`,
            backgroundPosition: 'center',
            color: 'var(--color-primary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 10,
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom color='var(--color-primary)'>
            Join the
          </Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom color='var(--color-primary)'>
            FinFlow Community
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }} color='var(--color-primary)'>
            Start tracking your expenses like a pro!
          </Typography>
        </Grid>
      )}

      {/* RIGHT SECTION */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          width: isSmallScreen ? '100%' : '40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 10 },
          backgroundColor: 'var(--color-primary)',
        }}
      >
        <Box width="100%" maxWidth="400px">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body2" mb={2}>
            Sign up to track your expenses and save smarter.
          </Typography>

          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{ sx: { backgroundColor: 'var(--color-input-bg)' } }}
          />
          <TextField
            label="Email"
            value={email}
            error={!!emailError}
            helperText={emailError}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{ sx: { backgroundColor: 'var(--color-input-bg)' } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{ sx: { backgroundColor: 'var(--color-input-bg)' } }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setError('');
                }}
              />
            }
            label="I agree to the Terms & Conditions"
            sx={{ mt: 1 }}
          />
          {error && (
            <Typography variant="body2" color="error" mt={1}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body2" color="success.main" mt={1}>
              {successMessage}
            </Typography>
          )}
          <Button
            onClick={handleRegister}
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 2,
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-button-text)',
              '&:hover': {
                backgroundColor: '#220057',
              },
            }}
          >
            {isSubmitting ? 'Please wait...' : 'Sign Up'}
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* SOCIAL SIGN-UP LINKS */}
          <Box sx={{ marginTop: 2 }} display="grid" gap={2}>
            <Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Google />}
              >
                Continue with Google
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
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
            Already have an account?{' '}
            <Link href="/sign-in" underline="hover" >
              Log in
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
