import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AppLogo from '../assets/logo.png'; 
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove the token
    localStorage.removeItem("token");

    // Close menu
    handleMenuClose();

    // Redirect to login page
    navigate("/sign-in");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#130037' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Left Section: App Logo and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={AppLogo} alt="App Logo" style={{ height: 50 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
            FinFlow
          </Typography>
        </Box>

        {/* Right Section: Account Avatar + Menu */}
        <Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          > 
            <Avatar sx={{ bgcolor: '#7300e6' }}>
              <AccountCircleRoundedIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
