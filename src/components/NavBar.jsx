import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AppLogo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDrawerOpen(false);
    navigate("/sign-in");
  };

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ backgroundColor: '#130037', color: 'white', padding: '0 35px', minHeight: '64px', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body3" sx={{ fontWeight: 'bold', color: 'white' }}>
          Hi, {userName}
        </Typography>
      </Box>

      <Divider />

      {/* Drawer Menu Items */}
      <List>
        <ListItem sx={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => { navigate('/profile'); setDrawerOpen(false); }}>
          <IconButton
            size='small'
            sx={{
              backgroundColor: '#130037',
              color: 'white',
              ml: 1,
              '&:hover': {
                backgroundColor: '#2d005c',
              }
            }}
          ><PersonOutlineIcon /></IconButton>
          <ListItemText sx={{ paddingLeft: '20px' }} primary="My Profile" />
        </ListItem>

        {/* <ListItem sx={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => { navigate('/settings'); setDrawerOpen(false); }}>
          <IconButton
            size='small'
            sx={{
              backgroundColor: '#130037',
              color: 'white',
              ml: 1,
              '&:hover': {
                backgroundColor: '#2d005c',
              }
            }}
          ><SettingsIcon /></IconButton>
          <ListItemText sx={{ paddingLeft: '20px' }} primary="Settings" />
        </ListItem> */}

        <ListItem sx={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => { navigate('/budget'); setDrawerOpen(false); }}>
          <IconButton
            size='small'
            sx={{
              backgroundColor: '#130037',
              color: 'white',
              ml: 1,
              '&:hover': {
                backgroundColor: '#2d005c',
              }
            }}
          ><AttachMoneyIcon /></IconButton>
          <ListItemText sx={{ paddingLeft: '20px' }} primary="Budget Settings" />
        </ListItem>

        <ListItem sx={{ padding: '10px 20px', cursor: 'pointer' }} onClick={handleLogout}>
          <IconButton
            size='small'
            sx={{
              backgroundColor: '#130037',
              color: 'white',
              ml: 1,
              '&:hover': {
                backgroundColor: '#2d005c',
              }
            }}
          ><LogoutIcon /></IconButton>
          <ListItemText sx={{ paddingLeft: '20px' }} primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#130037' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '64px' }}>

          {/* Left Section: App Logo and Name */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <img src={AppLogo} alt="App Logo" style={{ height: 50 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                FinFlow
              </Typography>
            </Box>
          </Link>

          {/* Right Section: Menu Icon for Drawer */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>
    </>
  );
};

export default Navbar;
