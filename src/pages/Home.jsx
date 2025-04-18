import { Box, useMediaQuery, Alert } from '@mui/material';
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
  const [showAlert, setShowAlert] = useState(true);

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
    fetchBudgets();
  }, [userId]);

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
      {showAlert && (overBudget.total || overBudget.categories.length > 0) && (
        <Alert severity="warning" onClose={() => setShowAlert(false)}>
          {overBudget.total && "⚠️ You have crossed your total budget! "}
          {overBudget.categories.length > 0 && `⚠️ Over budget in ${overBudget.categories.length} category(ies).`}
        </Alert>
      )}
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
            totalBudget={totalBudget}
            categoryBudgets={categoryBudgets}
            overBudget={overBudget}
          />
        </Box>
      </Box>
    </>
  );
}
