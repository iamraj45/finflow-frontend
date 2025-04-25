import React, { createContext, useState, useEffect } from "react";
import axios from "../utils/axios";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [totalBudget, setTotalBudget] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);

  const [userData, setUserData] = useState(null);

  const [expenses, setExpenses] = useState(null);

  const fetchBudgets = async () => {
    try {
      const totalRes = await axios.get(
        `${apiUrl}/api/getUserData?userId=${userId}`
      );
      const categoryRes = await axios.get(
        `${apiUrl}/api/budgets/getCategoryBudget?userId=${userId}`
      );

      setUserData(totalRes.data); // save complete user info
      setTotalBudget(totalRes.data?.totalBudget || null);
      setCategoryBudgets(categoryRes.data || []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const saveTotalBudget = async (budget) => {
    if (!userData) return;

    const updatedUser = {
      ...userData,
      totalBudget: parseFloat(budget),
    };

    try {
      await axios.post(`${apiUrl}/api/updateUserData`, updatedUser);
      setTotalBudget(updatedUser.totalBudget);
      setUserData(updatedUser); // update local context
    } catch (err) {
      console.error("Failed to save total budget:", err);
    }
  };

  const saveCategoryBudgets = async (budgets) => {
    try {
      await axios.post(
        `${apiUrl}/api/budgets/setCategoryBudget?userId=${userId}`,
        budgets
      );
      await fetchBudgets();
    } catch (err) {
      console.error("Failed to save category budgets:", err);
    }
  };

  const deleteCategoryBudget = async (categoryId) => {
    try {
      await axios.delete(`${apiUrl}/api/budgets/deleteCategoryBudget`, {
        params: {
          userId,
          categoryId,
        },
      });
      await fetchBudgets(); // Refresh budget data after deletion
    } catch (err) {
      console.error("Failed to delete category budget:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const startEpoch = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0).getTime();

      const endEpoch = new Date().setHours(23, 59, 59, 999);
      const response = await axios.get(
        `${apiUrl}/api/expenses/getExpenses?userId=${userId}&startDate=${startEpoch}&endDate=${endEpoch}`
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, [userId]);

  return (
    <BudgetContext.Provider
      value={{
        totalBudget,
        categoryBudgets,
        fetchBudgets,
        saveTotalBudget,
        saveCategoryBudgets,
        deleteCategoryBudget,
        expenses,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
