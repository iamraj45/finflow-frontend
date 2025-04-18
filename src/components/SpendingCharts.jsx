import React, { useEffect, useState, useContext } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { CategoryContext } from '../context/CategoryContext';

function generateShades(baseColor, count) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 10 + i * (70 / count);
    shades.push(`hsl(270, 100%, ${lightness}%)`);
  }
  return shades;
}

const SpendingCharts = ({ expenses, totalBudget, categoryBudgets, overBudget }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const { categories } = useContext(CategoryContext);

  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const categoryMap = {};
    let totalAmount = 0;

    expenses.forEach(exp => {
      totalAmount += exp.amount;
      categoryMap[exp.categoryId] = (categoryMap[exp.categoryId] || 0) + exp.amount;
    });

    const categoryWise = Object.entries(categoryMap).map(([id, amt]) => {
      const categoryName = categories.find(cat => cat.id === parseInt(id))?.name || 'Unknown';
      return {
        categoryId: id,
        category: categoryName,
        amount: amt,
        percentage: totalAmount > 0 ? (amt / totalAmount) * 100 : 0,
      };
    }).filter(entry => entry.percentage > 0);

    const dateWise = expenses.reduce((acc, exp) => {
      const dateStr = new Date(exp.date).toISOString().split('T')[0];
      const existing = acc.find(item => item.date === dateStr);
      if (existing) {
        existing.Amount += exp.amount;
      } else {
        acc.push({ date: dateStr, Amount: exp.amount });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    setCategoryData(categoryWise);
    setDateData(dateWise);
  }, [expenses, categories]);

  const COLORS = generateShades('#130037', categoryData.length);

  const overLimitCategories = categoryData
    .filter(entry => overBudget?.categories?.includes(parseInt(entry.categoryId)))
    .map(entry => entry.category);

  return (
    <Box sx={{ textAlign: 'center', border: '1px solid #ccc', p: 2 }}>
      {expenses.length === 0 ? (
        <Typography variant="h5" color="textSecondary" sx={{ py: 5 }}>
          No expenses found. Start by adding some to view your charts!
        </Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>My Spendings</Typography>

            {overBudget?.total && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                🚨 You have exceeded your <strong>total budget</strong> of ₹{totalBudget}.
              </Alert>
            )}

            {overLimitCategories.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                ⚠️ Budget limit exceeded for: <strong>{overLimitCategories.join(', ')}</strong>
              </Alert>
            )}

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="category" interval={0} angle={-30} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" name="Amount">
                  {categoryData.map((entry, index) => {
                    const isOver = overBudget?.categories?.includes(parseInt(entry.categoryId));
                    return (
                      <Cell
                        key={`cell-bar-${index}`}
                        fill={isOver ? '#d32f2f' : COLORS[index % COLORS.length]}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="percentage"
                  nameKey="category"
                  outerRadius={100}
                  fill="#130037"
                  label={({ percentage }) => `${percentage.toFixed(2)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Spending Over Time</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dateData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Amount" stroke="#6a1b9a" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default SpendingCharts;
