import React, { useState, useEffect } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import SpendingCharts from "../components/SpendingCharts";
import axios from "../utils/axios";
import Navbar from "../components/NavBar";

const ChartsPage = () => {
  const [loading, setLoading] = useState(true);
  const [chartExpenses, setChartExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [overBudget, setOverBudget] = useState({
    total: false,
    categories: [],
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const defaultChartRange = {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date().setHours(23, 59, 59, 999),
  };

  const fetchChartExpenses = async () => {
    try {
      const startEpoch = new Date(defaultChartRange.startDate).getTime();
      const endEpoch = new Date(defaultChartRange.endDate).getTime();
      const response = await axios.get(
        `${apiUrl}/api/expenses/getExpenses?userId=${userId}&startDate=${startEpoch}&endDate=${endEpoch}`
      );
      setChartExpenses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch chart expenses:", error);
      setChartExpenses([]); // Set empty array to prevent undefined errors
    }
  };

  const fetchBudgets = async () => {
    try {
      const totalBudgetRes = await axios.get(
        `${apiUrl}/api/getUserData?userId=${userId}`
      );
      const categoryBudgetRes = await axios.get(
        `${apiUrl}/api/budgets/getCategoryBudget?userId=${userId}`
      );
      setTotalBudget(totalBudgetRes.data.totalBudget || 0); // Use 0 as fallback
      setCategoryBudgets(categoryBudgetRes.data || []);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
      setTotalBudget(0);
      setCategoryBudgets([]);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!userId) return;
        await Promise.all([fetchChartExpenses(), fetchBudgets()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  useEffect(() => {
    if (!chartExpenses.length || totalBudget === null) return;

    const totalSpent = chartExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = chartExpenses.reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
      return acc;
    }, {});

    const crossedCategories = categoryBudgets.filter((catBud) => {
      const spent = categoryTotals[catBud.categoryId] || 0;
      return spent > catBud.budget;
    });

    setOverBudget({
      total: totalSpent > totalBudget,
      categories: crossedCategories.map((cat) => cat.categoryId),
    });
  }, [chartExpenses, totalBudget, categoryBudgets]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <>
      <Navbar
        expenses={chartExpenses}
        categoryBudgets={categoryBudgets}
        totalBudget={totalBudget}
        overBudget={overBudget}
      />
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Box sx={{ mt: 0 }}>
            <SpendingCharts
              expenses={chartExpenses}
              totalBudget={totalBudget}
              categoryBudgets={categoryBudgets}
              overBudget={overBudget}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ChartsPage;
