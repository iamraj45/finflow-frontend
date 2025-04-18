import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [totalBudget, setTotalBudget] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const totalRes = await axios.get(`${apiUrl}/api/getUserData?userId=${userId}`);
      const categoryRes = await axios.get(`${apiUrl}/api/budgets/getCategoryBudget?userId=${userId}`);

      setTotalBudget(totalRes.data?.totalBudget || null);
      setCategoryBudgets(categoryRes.data || []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }
  };

  const saveTotalBudget = async (budget) => {
    try {
      await axios.post(`${apiUrl}/api/getUserData?userId=${userId}`, totalBudget );
      setTotalBudget(totalBudget);
    } catch (err) {
      console.error('Failed to save total budget:', err);
    }
  };

  const saveCategoryBudgets = async (budgets) => {
    try {
      await axios.post(`${apiUrl}/api/budgets/setCategoryBudget?userId=${userId}`, budgets);
      await fetchBudgets();
    } catch (err) {
      console.error('Failed to save category budgets:', err);
    }
  };  

  useEffect(() => {
    fetchBudgets();
  }, [userId]);

  return (
    <BudgetContext.Provider value={{
      totalBudget,
      categoryBudgets,
      fetchBudgets,
      saveTotalBudget,
      saveCategoryBudgets,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};
