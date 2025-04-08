import React from 'react';
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

const Login = () => {
    const theme = useTheme();
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
                        color: 'var(--color-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 10,
                    }}
                >
                    <Typography variant="h3" fontWeight="bold" gutterBottom color='var(--color-primary)'>
                        Welcome to
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color='var(--color-primary)'>
                        FinFlow Community
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }} color='var(--color-primary)'>
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
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{ sx: { backgroundColor: 'var(--color-input-bg)' } }}
                    />
                    <TextField
                        label="Your password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        margin="normal"
                        InputProps={{ sx: { backgroundColor: 'var(--color-input-bg)' } }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-button-text)',
                            '&:hover': {
                                backgroundColor: '#220057',
                            },
                        }}
                    >
                        Log In
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
                        Don’t have an account?{' '}
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
