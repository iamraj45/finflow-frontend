import { Box, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import MyExpenses from "../components/MyExpenses.jsx";
import SpendingCharts from "../components/SpendingCharts.jsx";
import Navbar from '../components/NavBar.jsx';
import axios from '../utils/axios';

export default function Home() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [overBudget, setOverBudget] = useState({ total: false, categories: [] });

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 1st of this month
    endDate: new Date(), // today
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const fetchExpenses = async () => {
    try {
      const startEpoch = new Date(selectedDateRange.startDate).getTime();
      const endEpoch = new Date(selectedDateRange.endDate).getTime();
      const response = await axios.get(`${apiUrl}/api/expenses/getExpenses?userId=${userId}&startDate=${startEpoch}&endDate=${endEpoch}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const totalBudgetRes = await axios.get(`${apiUrl}/api/getUserData?userId=${userId}`);
      const categoryBudgetRes = await axios.get(`${apiUrl}/api/budgets/getCategoryBudget?userId=${userId}`);
      setTotalBudget(totalBudgetRes.data.totalBudget || null);
      setCategoryBudgets(categoryBudgetRes.data || []);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId, selectedDateRange]);

  useEffect(() => {
    if (!expenses.length || totalBudget === null) return;

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
      return acc;
    }, {});

    const crossedCategories = categoryBudgets.filter(catBud => {
      const spent = categoryTotals[catBud.categoryId] || 0;
      return spent > catBud.budget;
    });

    setOverBudget({
      total: totalSpent > totalBudget,
      categories: crossedCategories.map(cat => cat.categoryId),
    });
  }, [expenses, totalBudget, categoryBudgets]);

  const handleExpenseAdded = () => {
    fetchExpenses();
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
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: '400px' }}>
          <SpendingCharts
            expenses={expenses}
            totalBudget={totalBudget}
            categoryBudgets={categoryBudgets}
            overBudget={overBudget}
          />
        </Box>
      </Box>
    </>
  );
}
