import { Box, useMediaQuery, CircularProgress } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import MyExpenses from "../components/MyExpenses.jsx";
import SpendingCharts from "../components/SpendingCharts.jsx";
import Navbar from "../components/NavBar.jsx";
import axios from "../utils/axios";

const defaultChartRange = {
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  endDate: new Date().setHours(23, 59, 59, 999),
};

export default function Home() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [chartExpenses, setChartExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [overBudget, setOverBudget] = useState({
    total: false,
    categories: [],
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date().setHours(23, 59, 59, 999),
  });

  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = import.meta.env.VITE_API_URL;
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handleCategoryFilterApply = (categoryId, categoryName) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setPageNo(1);
    fetchExpenses(selectedDateRange, categoryId, 1);
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
    setPageNo(1);
    fetchExpenses(selectedDateRange, null, 1);
  };

  const fetchExpenses = async (
    range = selectedDateRange,
    categoryId = selectedCategory?.id,
    currentPage = pageNo
  ) => {
    try {
      const startEpoch = new Date(range.startDate).getTime();
      const endEpoch = new Date(range.endDate).getTime();

      let url = `${apiUrl}/api/expenses/getExpenses?userId=${userId}&startDate=${startEpoch}&endDate=${endEpoch}&pageNo=${currentPage}&pageSize=${pageSize}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }

      const response = await axios.get(url);
      setExpenses(response.data || []);
      setTotalPages(response.data[0].totalPage || 1);
    } catch (error) {
      console.error("Failed to fetch filtered expenses:", error);
    }
  };

  const fetchChartExpenses = async () => {
    try {
      const startEpoch = new Date(defaultChartRange.startDate).getTime();
      const endEpoch = new Date(defaultChartRange.endDate).getTime();
      const response = await axios.get(
        `${apiUrl}/api/expenses/getExpenses?userId=${userId}&startDate=${startEpoch}&endDate=${endEpoch}`
      );
      setChartExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch chart expenses:", error);
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
      setTotalBudget(totalBudgetRes.data.totalBudget || null);
      setCategoryBudgets(categoryBudgetRes.data || []);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
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
    if (userId) {
      fetchExpenses(selectedDateRange, selectedCategory?.id, pageNo);
    }
  }, [userId, selectedDateRange, selectedCategory, pageNo]);

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

  const handleExpenseAdded = () => {
    fetchExpenses(selectedDateRange, selectedCategory?.id, pageNo);
    fetchChartExpenses();
  };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 3,
          py: 2,
        }}
      >
        <Box
          sx={{
            pr: isMobile ? 0 : 2,
            pb: isMobile ? 2 : 0,
            width: isMobile ? "100%" : "50%",
          }}
        >
          <MyExpenses
            expenses={expenses}
            onExpenseAdded={handleExpenseAdded}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onApplyCategoryFilter={handleCategoryFilterApply}
            onClearCategoryFilter={handleClearCategoryFilter}
            pageNo={pageNo}
            setPageNo={setPageNo}
            totalPages={totalPages}
          />
        </Box>
        <Box
          sx={{
            pl: isMobile ? 0 : 2,
            pt: isMobile ? 2 : 0,
            width: isMobile ? "100%" : "50%",
          }}
        >
          <SpendingCharts
            expenses={chartExpenses}
            totalBudget={totalBudget}
            categoryBudgets={categoryBudgets}
            overBudget={overBudget}
          />
        </Box>
      </Box>
    </>
  );
}
