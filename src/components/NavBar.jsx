import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Popover,
  Alert,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AppLogo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { CategoryContext } from "../context/CategoryContext";

const Navbar = ({ expenses, categoryBudgets, totalBudget, overBudget }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [overLimitCategories, setOverLimitCategories] = useState([]);
  const { categories } = useContext(CategoryContext);

  const [hasSeenNotifications, setHasSeenNotifications] = useState(() => {
    const stored = localStorage.getItem("hasSeenNotifications");
    return stored === null ? false : JSON.parse(stored);
  });

  const [showTotalAlert, setShowTotalAlert] = useState(() => {
    const stored = localStorage.getItem("showTotalAlert");
    return stored === null ? true : JSON.parse(stored);
  });

  const [showCategoryAlert, setShowCategoryAlert] = useState(() => {
    const stored = localStorage.getItem("showCategoryAlert");
    return stored === null ? true : JSON.parse(stored);
  });

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userPhoto = localStorage.getItem("userPhoto");

  const notificationOpen = Boolean(notificationAnchorEl);

  // Handle notification click
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setHasUnreadNotifications(false);
    setHasSeenNotifications(true); // 👈 User has seen the alert(s)
    localStorage.setItem("hasSeenNotifications", "true");
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
    setHasUnreadNotifications(false);
    localStorage.setItem("hasSeenNotifications", "true");
  };

  // Effect for processing expense data and checking budget limits
  useEffect(() => {
    if (!expenses || expenses.length === 0 || !categories || !categoryBudgets)
      return;

    const categoryMap = {};
    let totalAmount = 0;

    expenses.forEach((exp) => {
      totalAmount += exp.amount;
      categoryMap[exp.categoryId] =
        (categoryMap[exp.categoryId] || 0) + exp.amount;
    });

    const categoryWise = Object.entries(categoryMap)
      .map(([id, amount]) => {
        const categoryName =
          categories.find((cat) => cat.id === parseInt(id))?.name ||
          "Unknown category";

        // Check if this category has a budget
        const budgetEntry = categoryBudgets?.find(
          (b) => b.categoryId === parseInt(id)
        );

        const isOverBudget = budgetEntry && amount > budgetEntry.budget;

        return {
          categoryId: parseInt(id),
          category: categoryName,
          amount: amount,
          percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
          isOverBudget: isOverBudget,
        };
      })
      .filter((entry) => entry.percentage > 0);

    setCategoryData(categoryWise);

    // Find categories that are over budget
    const categoriesOverBudget = categoryWise
      .filter((cat) => cat.isOverBudget)
      .map((cat) => cat.category);

    setOverLimitCategories(categoriesOverBudget);

    // Update notification status
    const hasTotalBudgetAlert = overBudget?.total && showTotalAlert;
    const hasCategoryBudgetAlert =
      categoriesOverBudget.length > 0 && showCategoryAlert;

    if (
      (hasTotalBudgetAlert || hasCategoryBudgetAlert) &&
      !hasSeenNotifications
    ) {
      setHasUnreadNotifications(true);
    } else {
      setHasUnreadNotifications(false);
    }
  }, [
    expenses,
    categories,
    categoryBudgets,
    overBudget,
    showTotalAlert,
    showCategoryAlert,
    notificationOpen,
  ]);

  const handleCloseTotalAlert = () => {
    setShowTotalAlert(false);
    localStorage.setItem("showTotalAlert", "false");
  };

  const handleCloseCategoryAlert = () => {
    setShowCategoryAlert(false);
    localStorage.setItem("showCategoryAlert", "false");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("showTotalAlert");
    localStorage.removeItem("showCategoryAlert");
    localStorage.removeItem("hasSeenNotifications");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    setDrawerOpen(false);
    navigate("/sign-in");
  };

  const drawerList = (
    <Box sx={{ width: "100%" }} role="presentation">
      <Box
        sx={{
          backgroundColor: "#130037",
          color: "white",
          padding: "0 35px",
          minHeight: "64px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box display="flex">
          <Chip
            avatar={<Avatar alt="username" src={userPhoto} />}
            label={userName}
            variant="outlined"
            sx={{
              fontSize: 17,
              border: "none",
              color: "var(--color-primary)",
              gap: 2,
              px: 0, // horizontal padding
              py: 0, // vertical padding
            }}
          />
        </Box>
      </Box>

      {/* Drawer Menu Items */}
      <List>
        <ListItem
          sx={{ padding: "10px 20px", cursor: "pointer" }}
          onClick={() => {
            navigate("/profile");
            setDrawerOpen(false);
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: "#130037",
              color: "white",
              ml: 1,
              "&:hover": {
                backgroundColor: "#2d005c",
              },
            }}
          >
            <PersonOutlineIcon />
          </IconButton>
          <ListItemText sx={{ paddingLeft: "20px" }} primary="My Profile" />
        </ListItem>

        <ListItem
          sx={{ padding: "10px 20px", cursor: "pointer" }}
          onClick={() => {
            navigate("/budget");
            setDrawerOpen(false);
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: "#130037",
              color: "white",
              ml: 1,
              "&:hover": {
                backgroundColor: "#2d005c",
              },
            }}
          >
            <AttachMoneyIcon />
          </IconButton>
          <ListItemText
            sx={{ paddingLeft: "20px" }}
            primary="Budget Settings"
          />
        </ListItem>

        <ListItem
          sx={{ padding: "10px 20px", cursor: "pointer" }}
          onClick={handleLogout}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: "#130037",
              color: "white",
              ml: 1,
              "&:hover": {
                backgroundColor: "#2d005c",
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
          <ListItemText sx={{ paddingLeft: "20px" }} primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#130037" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "64px",
          }}
        >
          {/* Left Section: App Logo and Name */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <img src={AppLogo} alt="App Logo" style={{ height: 50 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                FinFlow
              </Typography>
            </Box>
          </Link>

          {/* Right Section: Notifications and Menu Icons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={!hasUnreadNotifications}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ pr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Popover */}
      <Popover
        open={notificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            width: 300,
            p: 2,
            maxHeight: 400,
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: 1,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>

          {overBudget?.total && showTotalAlert && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              onClose={handleCloseTotalAlert}
            >
              You have exceeded your <strong>total monthly budget</strong> of ₹
              {totalBudget}
            </Alert>
          )}

          {overLimitCategories.length > 0 && showCategoryAlert && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              onClose={handleCloseCategoryAlert}
            >
              Budget limit exceeded for:{" "}
              <strong>{overLimitCategories.join(", ")}</strong>
            </Alert>
          )}

          {!(
            (overBudget?.total && showTotalAlert) ||
            (overLimitCategories.length > 0 && showCategoryAlert)
          ) && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No new notifications
            </Typography>
          )}
        </Box>
      </Popover>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
};

export default Navbar;
