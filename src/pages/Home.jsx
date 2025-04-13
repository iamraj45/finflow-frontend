import { Box, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import MyExpenses from "../components/MyExpenses.jsx";
import SpendingCharts from "../components/SpendingCharts.jsx";
import Navbar from '../components/NavBar.jsx';
import axios from '../utils/axios';

export default function Home() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [refreshCharts, setRefreshCharts] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/expenses/getExpenses?userId=${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId]);

  const handleExpenseAdded = () => {
    fetchExpenses(); // refresh data
    setRefreshCharts(prev => !prev); // optional, can remove if child no longer fetches
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: 1, minWidth: '400px' }}>
          <MyExpenses
            expenses={expenses}
            onExpenseAdded={handleExpenseAdded}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: '400px' }}>
          <SpendingCharts
            expenses={expenses}
          />
        </Box>
      </Box>
    </>
  );
}
